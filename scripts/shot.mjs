// 화면 스크린샷 찍기
// 사용: node scripts/shot.mjs [화면 폴더] [결과 폴더] [--loop=N]
// 기본: 03_develop/screens 의 모든 .html 을 03_develop/shots 에 PNG로 저장하고
//       한눈에 보는 gallery.html 을 만듭니다.
import path from 'node:path';
import fs from 'node:fs';
import { openBrowser, resolveScreensDir, listScreens, rel, ROOT, VIEWPORT } from './_browser.mjs';

// --loop=N 을 붙이면 그 루프의 스크린샷을 shots/loopN/ 에도 따로 남기고,
// 루프끼리 나란히 보는 progress.html 을 만듭니다. (예: node scripts/shot.mjs --loop=1)
const args = process.argv.slice(2);
const loopArg = args.find((a) => /^--loop=\d+$/.test(a));
const loopNo = loopArg ? Number(loopArg.split('=')[1]) : null;
const pos = args.filter((a) => !a.startsWith('--'));
const screensDir = resolveScreensDir(pos[0]);
const outDir = path.resolve(ROOT, pos[1] || path.join(path.dirname(screensDir), 'shots'));
fs.mkdirSync(outDir, { recursive: true });

const screens = listScreens(screensDir);
if (screens.length === 0) {
  console.log(`[안내] ${rel(screensDir)} 에 .html 화면이 없습니다. 디자이너 에이전트에게 먼저 화면을 만들게 하세요.`);
  process.exit(0);
}

const browser = await openBrowser();
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
const done = [];
for (const s of screens) {
  const page = await context.newPage();
  await page.goto(s.url);
  await page.waitForTimeout(250);
  const png = s.name.replace(/\.html$/i, '.png');
  await page.screenshot({ path: path.join(outDir, png), fullPage: true });
  await page.close();
  done.push({ html: s.name, png });
  console.log(`찍음  ${rel(path.join(outDir, png))}`);
}
await browser.close();

// 화면 파일이 없어진 옛 스크린샷은 지웁니다. 갤러리에 옛 화면이 섞이지 않게 하려는 것입니다.
const keep = new Set(done.map((d) => d.png));
for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith('.png') && !keep.has(f)) { try { fs.unlinkSync(path.join(outDir, f)); console.log(`지움  ${rel(path.join(outDir, f))} (화면 파일이 없음)`); } catch {} }
}

// 루프별 보관과 비교 화면
if (loopNo !== null) {
  const loopDir = path.join(outDir, `loop${loopNo}`);
  fs.mkdirSync(loopDir, { recursive: true });
  for (const d of done) fs.copyFileSync(path.join(outDir, d.png), path.join(loopDir, d.png));
  console.log(`보관  ${rel(loopDir)}  (${done.length}장)`);
}
const loops = fs.readdirSync(outDir).filter((f) => /^loop\d+$/.test(f)).sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
if (loops.length) {
  const names = [...new Set(loops.flatMap((l) => fs.readdirSync(path.join(outDir, l)).filter((f) => f.endsWith('.png'))))].sort();
  const rows = names.map((n) => `<tr><th>${n.replace(/\.png$/, '')}</th>${loops.map((l) => fs.existsSync(path.join(outDir, l, n)) ? `<td><img src="${l}/${n}" alt="${l} ${n}"></td>` : '<td class="none">아직 없음</td>').join('')}</tr>`).join('\n');
  fs.writeFileSync(path.join(outDir, 'progress.html'), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>루프별 화면 변화</title>
<style>body{margin:0;padding:32px;background:#f2f2f0;font-family:system-ui,sans-serif;color:#141414}h1{font-size:18px;margin:0 0 6px}p{font-size:13px;color:#555;margin:0 0 20px}
table{border-collapse:separate;border-spacing:16px 20px}th{font-size:13px;font-weight:600;text-align:left;vertical-align:top;white-space:nowrap}thead th{text-align:center}
img{width:220px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.12);display:block;background:#fff}td.none{width:220px;font-size:12px;color:#999;text-align:center;border:1px dashed #ccc;border-radius:18px}</style></head>
<body><h1>루프별 화면 변화</h1><p>가로는 루프, 세로는 화면입니다. 왼쪽에서 오른쪽으로 보면 같은 화면이 어떻게 바뀌었는지 보입니다.</p>
<table><thead><tr><th></th>${loops.map((l) => `<th>루프 ${l.slice(4)}</th>`).join('')}</tr></thead><tbody>
${rows}
</tbody></table></body></html>`);
  console.log(`비교   ${rel(path.join(outDir, 'progress.html'))}  (루프끼리 나란히)`);
}

// 갤러리: 스크린샷을 나란히 보는 한 장
const cards = done
  .map(
    (d) => `<figure><img src="${d.png}" alt="${d.html}"><figcaption>${d.html}</figcaption></figure>`
  )
  .join('\n');
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>화면 갤러리</title>
<style>body{margin:0;padding:32px;background:#f2f2f0;font-family:system-ui,sans-serif;color:#141414}
h1{font-size:18px;margin:0 0 20px}.row{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}
figure{margin:0}img{width:300px;border-radius:24px;box-shadow:0 8px 28px rgba(0,0,0,.12);display:block;background:#fff}
figcaption{font-size:13px;margin-top:10px;color:#555;text-align:center}</style></head>
<body><h1>화면 갤러리 · ${done.length}장 · ${rel(screensDir)}</h1><div class="row">
${cards}
</div></body></html>`;
fs.writeFileSync(path.join(outDir, 'gallery.html'), html);
console.log(`\n갤러리  ${rel(path.join(outDir, 'gallery.html'))}  (브라우저로 열어 한눈에 확인)`);
