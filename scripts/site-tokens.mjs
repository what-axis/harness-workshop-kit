// 배포된 화면에서 겉모습 값 읽기
// 사용: node scripts/site-tokens.mjs <주소 또는 HTML 파일> [--desktop]
//   예) node scripts/site-tokens.mjs https://www.example.com
//       node scripts/site-tokens.mjs examples/after/01-pdp.html
// 실제로 그려진 화면에서 색, 글자, 모서리, 간격, 버튼 모양을 세어 01_discover/site-tokens.md 로 남깁니다.
// 읽을 수 있는 것은 겉모습뿐입니다. 빈 상태, 오류, 문구 규칙은 화면에 보이지 않으므로 직접 채워야 합니다.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { openBrowser, ROOT, rel } from './_browser.mjs';

const args = process.argv.slice(2);
const desktop = args.includes('--desktop');
const target = args.find((a) => !a.startsWith('--'));
if (!target) {
  console.log('[안내] 읽을 주소나 HTML 파일을 알려 주세요. 예: node scripts/site-tokens.mjs https://www.example.com');
  process.exit(1);
}
const isUrl = /^https?:\/\//i.test(target);
const url = isUrl ? target : pathToFileURL(path.resolve(process.cwd(), target)).href;
if (!isUrl && !fs.existsSync(path.resolve(process.cwd(), target))) {
  console.log(`[안내] 파일이 없습니다: ${target}`);
  process.exit(1);
}
const viewport = desktop ? { width: 1280, height: 800 } : { width: 390, height: 844 };

const browser = await openBrowser();
const context = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: !desktop, hasTouch: !desktop });
const page = await context.newPage();
try {
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
} catch (e) {
  console.log(`[안내] 화면을 열지 못했습니다: ${String(e.message).split('\n')[0]}`);
  console.log('로그인이 필요한 화면이거나 주소가 틀렸을 수 있습니다. 공개된 화면 주소로 다시 해 보세요.');
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(400);

const data = await page.evaluate(() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  // 어떤 표기(rgb, oklch 등)로 적힌 색이든 화면에 칠해 본 값으로 바꿉니다.
  const toHex = (c) => {
    if (!c || c === 'transparent') return null;
    if (cache.has(c)) return cache.get(c);
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
    const hex = a < 26 ? null : '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase() + (a < 250 ? ` (투명도 ${Math.round((a / 255) * 100)}%)` : '');
    cache.set(c, hex); return hex;
  };
  const add = (map, key, w = 1) => { if (key === null || key === undefined || key === '') return; map[key] = (map[key] || 0) + w; };
  const text = {}, bg = {}, border = {}, fonts = {}, sizes = {}, weights = {}, radii = {}, gaps = {};
  const buttons = [];
  const cap = innerWidth * 900;
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (own) {
      add(text, toHex(cs.color), own.length);
      add(fonts, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), own.length);
      add(sizes, Math.round(parseFloat(cs.fontSize) * 10) / 10, own.length);
      add(weights, cs.fontWeight, own.length);
    }
    const b = toHex(cs.backgroundColor);
    if (b) add(bg, b, Math.min(r.width * r.height, cap));
    const bw = parseFloat(cs.borderTopWidth) || 0;
    if (bw > 0 && cs.borderTopStyle !== 'none') add(border, toHex(cs.borderTopColor));
    const rad = parseFloat(cs.borderTopLeftRadius) || 0;
    const radLabel = rad <= 0 ? null : rad >= r.height / 2 - 0.5 ? '알약(완전히 둥글게)' : Math.round(rad);
    if (radLabel && (b || bw > 0)) add(radii, radLabel);
    if (/flex|grid/.test(cs.display)) { const g = parseFloat(cs.rowGap) || parseFloat(cs.columnGap) || 0; if (g > 0) add(gaps, Math.round(g)); }
    const tag = el.tagName.toLowerCase();
    if (tag === 'button' || el.getAttribute('role') === 'button' || (tag === 'a' && b)) {
      buttons.push({
        label: (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 22) || '(글자 없음)',
        w: Math.round(r.width), h: Math.round(r.height), bg: b || '없음', color: toHex(cs.color), radius: radLabel || 0,
        size: Math.round(parseFloat(cs.fontSize)), weight: cs.fontWeight,
      });
    }
  }
  const pageBg = toHex(getComputedStyle(document.body).backgroundColor) || toHex(getComputedStyle(document.documentElement).backgroundColor) || '#FFFFFF';
  return { title: document.title, pageBg, text, bg, border, fonts, sizes, weights, radii, gaps, buttons };
});

const outDir = path.join(ROOT, '01_discover');
fs.mkdirSync(outDir, { recursive: true });
await page.screenshot({ path: path.join(outDir, 'site-tokens.png'), fullPage: false });
await browser.close();

const top = (map, n = 8) => {
  const all = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const sum = all.reduce((s, [, v]) => s + v, 0) || 1;
  return all.slice(0, n).map(([k, v]) => [k, Math.round((v / sum) * 100)]);
};
const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)];
const pct = (rows) => rows.map(([k, p]) => [k, p < 1 ? '1% 미만' : `${p}%`]);

const out = [];
out.push('# 화면에서 읽은 겉모습 값', '');
out.push(`- 대상: ${isUrl ? url : rel(path.resolve(process.cwd(), target))}${data.title ? ` (${data.title})` : ''}`);
out.push(`- 화면 크기: ${viewport.width} x ${viewport.height}${desktop ? ' (데스크톱)' : ' (모바일)'}`);
out.push(`- 스크린샷: \`01_discover/site-tokens.png\``, '');
out.push('실제로 그려진 화면에서 센 값입니다. 이름은 붙이지 않았습니다. 어떤 값을 토큰으로 삼을지는 사람이 정합니다.', '');
out.push('## 색', '', `화면 바탕: ${data.pageBg}`, '', '### 글자색 (글자 수 기준)', '', ...table(['HEX', '비중'], pct(top(data.text))), '');
out.push('### 바탕색 (넓이 기준)', '', ...table(['HEX', '비중'], pct(top(data.bg))), '');
if (Object.keys(data.border).length) out.push('### 테두리색 (쓰인 횟수 기준)', '', ...table(['HEX', '비중'], pct(top(data.border, 5))), '');
out.push('## 글자', '', `글꼴: ${top(data.fonts, 3).map(([k, p]) => `${k} (${p}%)`).join(', ') || '찾지 못함'}`, '');
out.push(...table(['크기(px)', '비중'], pct(top(data.sizes, 10).sort((a, b) => Number(b[0]) - Number(a[0])))), '');
out.push(`굵기: ${top(data.weights, 5).map(([k, p]) => `${k} (${p}%)`).join(', ') || '찾지 못함'}`, '');
if (Object.keys(data.radii).length) out.push('## 모서리 (쓰인 횟수 기준)', '', ...table(['값', '비중'], pct(top(data.radii, 6))), '');
if (Object.keys(data.gaps).length) out.push('## 요소 사이 간격 (쓰인 횟수 기준)', '', ...table(['값(px)', '비중'], pct(top(data.gaps, 6))), '');
if (data.buttons.length) {
  const seen = new Set();
  const uniq = data.buttons.filter((b) => { const k = [b.h, b.bg, b.color, b.radius].join('/'); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 10);
  out.push('## 누를 수 있는 것', '', ...table(['문구', '크기', '배경', '글자', '모서리', '글자 크기 / 굵기', '44 미만'],
    uniq.map((b) => [b.label.replace(/\|/g, '/'), `${b.w} x ${b.h}`, b.bg, b.color || '', b.radius, `${b.size} / ${b.weight}`, b.w < 44 || b.h < 44 ? '예' : ''])), '');
  const small = data.buttons.filter((b) => b.w < 44 || b.h < 44).length;
  out.push(`누를 수 있는 것 ${data.buttons.length}개 중 가로나 세로가 44 미만인 것 ${small}개`, '');
}
out.push('## 이 값으로 할 수 있는 것과 없는 것', '');
out.push('- 할 수 있는 것: DESIGN.md 의 1 컬러, 2 타이포그래피, 3 간격과 모서리, 4 컴포넌트 규격의 초안');
out.push('- 할 수 없는 것: 5 상태 규칙, 6 카피 톤, 7 금지 사항. 화면 한 장에는 빈 상태, 오류, 처리 중이 보이지 않습니다');
out.push('- 로그인 뒤의 화면, 눌러야 나오는 화면은 읽지 못했습니다. 그런 화면은 스크린샷이나 피그마 변수로 보충합니다');
out.push('- 비중이 작은 색은 사진이나 일러스트에서 온 것일 수 있습니다. 토큰으로 삼기 전에 스크린샷과 비교해 보세요', '');
fs.writeFileSync(path.join(outDir, 'site-tokens.md'), out.join('\n'));

console.log(`\n화면에서 읽은 겉모습 값 (${viewport.width} x ${viewport.height})`);
console.log(`  글자색  ${top(data.text, 4).map(([k, p]) => `${k} ${p}%`).join(', ')}`);
console.log(`  바탕색  ${top(data.bg, 4).map(([k, p]) => `${k} ${p}%`).join(', ')}`);
console.log(`  글자 크기  ${top(data.sizes, 6).map(([k]) => k).sort((a, b) => b - a).join(', ')}`);
console.log(`  누를 수 있는 것 ${data.buttons.length}개`);
console.log('\n상세  01_discover/site-tokens.md');
console.log('읽은 것은 겉모습뿐입니다. 상태와 문구 규칙은 직접 채웁니다.\n');
