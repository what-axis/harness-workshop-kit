// 화면 스크린샷 찍기
// 사용: node scripts/shot.mjs [화면 폴더] [결과 폴더]
// 기본: 03_develop/screens 의 모든 .html 을 03_develop/shots 에 PNG로 저장하고
//       한눈에 보는 gallery.html 을 만듭니다.
import path from 'node:path';
import fs from 'node:fs';
import { openBrowser, resolveScreensDir, listScreens, rel, ROOT, VIEWPORT } from './_browser.mjs';

const screensDir = resolveScreensDir(process.argv[2]);
const outDir = path.resolve(ROOT, process.argv[3] || path.join(path.dirname(screensDir), 'shots'));
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
