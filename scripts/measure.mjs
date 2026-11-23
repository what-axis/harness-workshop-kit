// 숫자로 확인되는 항목을 기계가 재는 검사
// 사용: node scripts/measure.mjs [화면 폴더] [--strict]
// 재는 것 4가지
//   1) 토큰 밖 컬러: DESIGN.md 컬러 토큰 표에 없는 색을 쓴 곳
//   2) 명도 대비: 글자와 배경의 대비가 4.5:1(큰 글자 3:1)에 못 미치는 곳
//   3) 터치 영역: 누를 수 있는 요소 중 44px보다 작은 곳
//   4) 글자 크기: 12px보다 작은 글자
// 결과: 04_deliver/reports/measure.md (사람과 리뷰어 에이전트가 읽는 표)
//       04_deliver/reports/measure.json (원본 수치)
// --strict 를 붙이면 문제가 하나라도 있을 때 종료 코드 2로 끝납니다(훅에서 사용).
import path from 'node:path';
import fs from 'node:fs';
import { openBrowser, resolveScreensDir, listScreens, rel, ROOT, VIEWPORT } from './_browser.mjs';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const dirArg = args.find((a) => !a.startsWith('--'));
const screensDir = resolveScreensDir(dirArg);
const reportDir = path.resolve(ROOT, '04_deliver/reports');
fs.mkdirSync(reportDir, { recursive: true });

// ---- DESIGN.md 에서 컬러 토큰 읽기 ----
function readTokens() {
  const file = path.join(ROOT, 'DESIGN.md');
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  // "컬러" 가 들어간 제목부터 다음 같은 수준 제목 전까지
  const m = text.match(/^##[^\n]*컬러[^\n]*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/m);
  const section = m ? m[1] : text;
  const tokens = [];
  for (const line of section.split('\n')) {
    const hex = line.match(/#([0-9a-fA-F]{6})\b/);
    if (!hex) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    const name = (cells[0] || '').replace(/[`*]/g, '') || hex[0];
    tokens.push({ name, hex: '#' + hex[1].toUpperCase() });
  }
  return tokens;
}
const tokens = readTokens();
const tokenSet = new Set(tokens.map((t) => t.hex));

const screens = listScreens(screensDir);
if (screens.length === 0) {
  console.log(`[안내] ${rel(screensDir)} 에 .html 화면이 없습니다.`);
  process.exit(0);
}

const browser = await openBrowser();
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
const results = [];

for (const s of screens) {
  const page = await context.newPage();
  await page.goto(s.url);
  await page.waitForTimeout(250);
  const data = await page.evaluate(() => {
    const parse = (c) => {
      const m = c && c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const hex = (c) =>
      '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
    const over = (top, bottom) => ({
      r: top.r * top.a + bottom.r * (1 - top.a),
      g: top.g * top.a + bottom.g * (1 - top.a),
      b: top.b * top.a + bottom.b * (1 - top.a),
      a: 1,
    });
    const lum = (c) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const ratio = (a, b) => {
      const l1 = lum(a), l2 = lum(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    const visible = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const label = (el) => {
      const t = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '')
        .trim().replace(/\s+/g, ' ').slice(0, 24);
      const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '';
      return `<${el.tagName.toLowerCase()}${cls}> ${t ? '"' + t + '"' : ''}`.trim();
    };
    // 배경: 위로 올라가며 불투명해질 때까지 겹침
    const backgroundOf = (el) => {
      const layers = [];
      let hasImage = false;
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') hasImage = true;
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) {
          layers.push(c);
          if (c.a === 1) break;
        }
      }
      let base = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
      return { color: base, hasImage };
    };

    const colors = {}; // hex -> [위치]
    const addColor = (h, where) => {
      (colors[h] = colors[h] || []).push(where);
    };
    const contrast = [];
    const smallText = [];
    const touch = [];
    const unmeasured = [];

    const all = Array.from(document.body.querySelectorAll('*'));
    for (const el of all) {
      if (el.closest('[data-illust]')) continue; // 상품 이미지, 일러스트, 색상 견본은 제외
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName.toUpperCase())) continue;
      if (!visible(el)) continue;
      const cs = getComputedStyle(el);

      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) addColor(hex(bg), '배경 ' + label(el));
      for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
        if (parseFloat(cs['border' + side + 'Width']) > 0 && cs['border' + side + 'Style'] !== 'none') {
          const bc = parse(cs['border' + side + 'Color']);
          if (bc && bc.a > 0) addColor(hex(bc), '테두리 ' + label(el));
          break;
        }
      }

      const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
      if (hasText) {
        const fg0 = parse(cs.color);
        if (fg0) {
          addColor(hex(fg0), '글자 ' + label(el));
          const size = parseFloat(cs.fontSize);
          const weight = parseInt(cs.fontWeight, 10) || 400;
          if (size < 12) smallText.push({ where: label(el), size: Math.round(size * 10) / 10 });
          const disabled = el.closest('[disabled],[aria-disabled="true"],[data-disabled]');
          if (!disabled) {
            const b = backgroundOf(el);
            if (b.hasImage) {
              unmeasured.push({ where: label(el), why: '배경이 이미지나 그라데이션' });
            } else {
              const fg = fg0.a < 1 ? over(fg0, b.color) : fg0;
              const r = ratio(fg, b.color);
              const large = size >= 24 || (size >= 18.66 && weight >= 700);
              const need = large ? 3 : 4.5;
              if (r < need) {
                contrast.push({
                  where: label(el), fg: hex(fg), bg: hex(b.color),
                  ratio: Math.round(r * 100) / 100, need, size: Math.round(size),
                });
              }
            }
          }
        }
      }

      const tappable = el.matches('a[href],button,[role="button"],input,select,textarea,[onclick],[data-tap]');
      if (tappable && !el.closest('[disabled],[aria-disabled="true"],[data-disabled]')) {
        const r = el.getBoundingClientRect();
        if (r.width < 44 || r.height < 44) {
          touch.push({ where: label(el), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
    }
    return { colors, contrast, smallText, touch, unmeasured };
  });
  await page.close();

  const offToken = [];
  if (tokens.length > 0) {
    for (const [h, wheres] of Object.entries(data.colors)) {
      if (!tokenSet.has(h)) offToken.push({ hex: h, count: wheres.length, example: wheres[0] });
    }
  }
  results.push({ screen: s.name, offToken, ...data, colors: Object.keys(data.colors) });
}
await browser.close();

// ---- 결과 쓰기 ----
const total = { offToken: 0, contrast: 0, touch: 0, smallText: 0 };
for (const r of results) {
  total.offToken += r.offToken.length;
  total.contrast += r.contrast.length;
  total.touch += r.touch.length;
  total.smallText += r.smallText.length;
}

const today = new Date().toISOString().slice(0, 10);
let md = `# 기계 측정 결과\n\n`;
md += `- 대상: \`${rel(screensDir)}\` (${results.length}개 화면, ${VIEWPORT.width}x${VIEWPORT.height})\n`;
md += `- 측정일: ${today}\n`;
md += tokens.length
  ? `- 기준 토큰(DESIGN.md): ${tokens.map((t) => `${t.name} ${t.hex}`).join(', ')}\n`
  : `- 기준 토큰: DESIGN.md 에서 컬러 토큰을 찾지 못해 토큰 검사는 건너뜀\n`;
md += `\n## 요약\n\n| 화면 | 토큰 밖 컬러 | 대비 미달 | 터치 44 미만 | 12px 미만 글자 |\n|---|---|---|---|---|\n`;
for (const r of results) {
  md += `| ${r.screen} | ${r.offToken.length} | ${r.contrast.length} | ${r.touch.length} | ${r.smallText.length} |\n`;
}
md += `| **합계** | **${total.offToken}** | **${total.contrast}** | **${total.touch}** | **${total.smallText}** |\n`;

for (const r of results) {
  md += `\n## ${r.screen}\n`;
  if (!r.offToken.length && !r.contrast.length && !r.touch.length && !r.smallText.length) {
    md += `\n문제 없음.\n`;
  }
  if (r.offToken.length) {
    md += `\n**토큰 밖 컬러**\n\n| 색 | 쓰인 곳 수 | 예시 |\n|---|---|---|\n`;
    for (const o of r.offToken) md += `| ${o.hex} | ${o.count} | ${o.example} |\n`;
  }
  if (r.contrast.length) {
    md += `\n**명도 대비 미달**\n\n| 요소 | 글자색 | 배경색 | 대비 | 필요 |\n|---|---|---|---|---|\n`;
    for (const c of r.contrast) md += `| ${c.where} (${c.size}px) | ${c.fg} | ${c.bg} | ${c.ratio}:1 | ${c.need}:1 |\n`;
  }
  if (r.touch.length) {
    md += `\n**터치 영역 44px 미만**\n\n| 요소 | 크기 |\n|---|---|\n`;
    for (const t of r.touch) md += `| ${t.where} | ${t.w}x${t.h} |\n`;
  }
  if (r.smallText.length) {
    md += `\n**12px 미만 글자**\n\n| 요소 | 크기 |\n|---|---|\n`;
    for (const t of r.smallText) md += `| ${t.where} | ${t.size}px |\n`;
  }
  if (r.unmeasured.length) {
    md += `\n측정 불가(사람이 확인): ${r.unmeasured.map((u) => `${u.where} (${u.why})`).join(', ')}\n`;
  }
}
md += `\n---\n이 표는 숫자로 잴 수 있는 것만 봅니다. 위계, 흐름, 예외 상태, 카피는 리뷰어와 QA, 그리고 사람이 봅니다.\n`;

fs.writeFileSync(path.join(reportDir, 'measure.md'), md);
fs.writeFileSync(path.join(reportDir, 'measure.json'), JSON.stringify({ date: today, tokens, results }, null, 2));

console.log(`\n기계 측정 요약 (${results.length}개 화면)`);
console.log(`  토큰 밖 컬러  ${total.offToken}`);
console.log(`  대비 미달     ${total.contrast}`);
console.log(`  터치 44 미만  ${total.touch}`);
console.log(`  12px 미만     ${total.smallText}`);
console.log(`\n상세  ${rel(path.join(reportDir, 'measure.md'))}`);

const bad = total.offToken + total.contrast + total.touch + total.smallText;
if (strict && bad > 0) {
  console.error(`\n기계 측정에서 ${bad}건이 걸렸습니다. 04_deliver/reports/measure.md 를 읽고 해당 요소를 고친 뒤 다시 저장하세요.`);
  process.exit(2);
}
