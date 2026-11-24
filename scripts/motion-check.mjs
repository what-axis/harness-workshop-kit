// 움직임 점검: 화면에 넣은 전환과 애니메이션이 우리 규칙 안에 있는지 기계로 확인합니다.
// 사용: node scripts/motion-check.mjs [폴더 또는 HTML 파일] [--limit=200]
//   기본 대상은 03_develop/screens 입니다.
//   길이 기준은 DESIGN.md 의 "길이는 NNNms 이하" 문장에서 읽습니다. 없으면 200ms 입니다.
// 보는 것 (모두 글로 적힌 CSS 를 읽어서 판단합니다. 화면을 실제로 재생하지는 않습니다)
//   1 가장 긴 움직임이 기준 이하인가
//   2 transition: all 을 쓰지 않았는가
//   3 ease-in 으로 시작하는 움직임이 없는가
//   4 크기나 위치 속성(width, height, top, left, margin, padding)을 움직이지 않는가
//   5 scale(0) 에서 나타나는 요소가 없는가
//   6 끝없이 반복되는 움직임이 없는가
//   7 움직임이 있으면 prefers-reduced-motion 대응이 있는가
// 결과: 04_deliver/reports/motion-check.md
// 이 검사는 "값이 규칙 안에 있는가"만 봅니다. 그 움직임이 필요한지는 사람이 판단합니다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith('--limit='));
const targetArg = args.find((a) => !a.startsWith('--'));
const target = path.resolve(process.cwd(), targetArg || path.join(ROOT, '03_develop/screens'));

function designLimit() {
  try {
    const d = fs.readFileSync(path.join(ROOT, 'DESIGN.md'), 'utf8');
    const m = d.match(/길이는\s*(\d+)\s*ms\s*이하/);
    if (m) return Number(m[1]);
  } catch {}
  return 200;
}
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : designLimit();

if (!fs.existsSync(target)) {
  console.log(`[안내] ${target} 가 없습니다. 화면을 먼저 만들거나 경로를 적어 주세요.`);
  process.exit(1);
}
const files = fs.statSync(target).isDirectory()
  ? fs.readdirSync(target).filter((f) => f.endsWith('.html')).sort().map((f) => path.join(target, f))
  : [target];
if (!files.length) {
  console.log(`[안내] ${target} 에 HTML 화면이 없습니다.`);
  process.exit(1);
}

// HTML 한 파일에서 CSS 글을 모읍니다: <style>, 같은 폴더의 연결된 CSS, style 속성.
function collectCss(file) {
  const html = fs.readFileSync(file, 'utf8');
  let css = '';
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) css += m[1] + '\n';
  for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)) {
    const href = (m[0].match(/href=["']([^"']+)["']/) || [])[1];
    if (!href || /^(https?:)?\/\//.test(href)) continue;
    const p = path.resolve(path.dirname(file), href.split('?')[0]);
    if (fs.existsSync(p)) css += fs.readFileSync(p, 'utf8') + '\n';
  }
  for (const m of html.matchAll(/\sstyle=["']([^"']*)["']/gi)) css += `._inline{${m[1]}}\n`;
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

const toMs = (num, unit) => (unit === 's' ? Number(num) * 1000 : Number(num));
// 값 안의 시간(120ms, .3s, calc(120ms * var(--s,1)))을 모두 꺼냅니다.
function times(value) {
  return [...value.matchAll(/(\d*\.?\d+)(ms|s)\b/g)].map((m) => toMs(m[1], m[2]));
}
const LAYOUT = /\b(width|height|top|left|right|bottom|margin(?:-\w+)?|padding(?:-\w+)?)\b/;

function check(file) {
  const css = collectCss(file);
  const decls = [...css.matchAll(/(^|[;{\s])(transition|transition-duration|transition-property|transition-timing-function|animation|animation-duration|animation-timing-function|animation-iteration-count)\s*:\s*([^;}]+)/g)]
    .map((m) => ({ prop: m[2], value: m[3].trim() }));
  const moving = decls.filter((d) => !/^none\b/.test(d.value));
  const hasMotion = moving.length > 0 || /@keyframes/.test(css);
  const out = { file: path.basename(file), hasMotion, max: 0, fails: [] };
  if (!hasMotion) return out;

  // 1 가장 긴 움직임. transition 과 animation 의 첫 시간이 길이, 둘째 시간은 지연이라 길이만 봅니다.
  for (const d of moving) {
    if (!/^(transition|transition-duration|animation|animation-duration)$/.test(d.prop)) continue;
    for (const part of d.value.split(/,(?![^(]*\))/)) {
      const t = times(part);
      if (t.length) out.max = Math.max(out.max, t[0]);
    }
  }
  if (out.max > LIMIT) out.fails.push(`가장 긴 움직임이 ${out.max}ms 입니다 (기준 ${LIMIT}ms 이하)`);

  // 2 transition: all
  const all = moving.filter((d) => (d.prop === 'transition' && (/\ball\b/.test(d.value) || !/[a-z-]{3,}/i.test(d.value.replace(/cubic-bezier\([^)]*\)|calc\([^)]*\)|var\([^)]*\)|ease(-in|-out|-in-out)?|linear|steps\([^)]*\)|\d*\.?\d+m?s/g, '')))) || (d.prop === 'transition-property' && /\ball\b/.test(d.value)));
  if (all.length) out.fails.push(`transition: all 이 ${all.length}곳 있습니다. 움직일 속성을 이름으로 적습니다`);

  // 3 ease-in (ease-in-out 은 제외)
  const easeIn = moving.filter((d) => /\bease-in\b(?!-out)/.test(d.value));
  if (easeIn.length) out.fails.push(`ease-in 이 ${easeIn.length}곳 있습니다. 느리게 출발하면 반응이 늦어 보입니다`);

  // 4 크기나 위치 속성을 움직임
  const layout = moving.filter((d) => /^transition(-property)?$/.test(d.prop) && LAYOUT.test(d.value.replace(/cubic-bezier\([^)]*\)/g, '')));
  if (layout.length) out.fails.push(`크기나 위치 속성을 움직이는 곳이 ${layout.length}곳 있습니다. transform 과 opacity 로 바꿉니다`);

  // 5 scale(0) 에서 등장
  if (/scale\(\s*0(\.0+)?\s*\)/.test(css)) out.fails.push('scale(0) 에서 나타나는 요소가 있습니다. 0.9 이상에서 투명도와 함께 시작합니다');

  // 6 끝없는 반복
  const inf = moving.filter((d) => /\binfinite\b/.test(d.value));
  if (inf.length) out.fails.push(`끝없이 반복되는 움직임이 ${inf.length}곳 있습니다. 불러오는 중 표시가 아니라면 뺍니다`);

  // 7 움직임 줄이기 설정 대응
  if (!/prefers-reduced-motion/.test(css)) out.fails.push('prefers-reduced-motion 대응이 없습니다. 움직임 줄이기를 켠 사람에게도 그대로 움직입니다');
  return out;
}

const results = files.map(check);
const withMotion = results.filter((r) => r.hasMotion);
const failed = withMotion.filter((r) => r.fails.length);

const lines = [];
lines.push('# 움직임 점검', '');
lines.push(`- 대상: ${path.relative(ROOT, target) || '.'} (화면 ${results.length}개, 움직임이 있는 화면 ${withMotion.length}개)`);
lines.push(`- 길이 기준: ${LIMIT}ms 이하`);
lines.push(`- 결과: ${failed.length ? `미달 ${failed.length}개` : withMotion.length ? '모두 통과' : '움직임이 없습니다'}`, '');
lines.push('| 화면 | 가장 긴 움직임 | 판정 | 미달 항목 |', '|---|---|---|---|');
for (const r of results) {
  if (!r.hasMotion) { lines.push(`| ${r.file} | 없음 | 해당 없음 | |`); continue; }
  lines.push(`| ${r.file} | ${r.max}ms | ${r.fails.length ? '미달' : '통과'} | ${r.fails.join('<br>')} |`);
}
lines.push('', '이 검사는 CSS 에 적힌 값을 읽은 것입니다. 스크립트가 실행 중에 넣는 움직임은 보지 못합니다. 그 움직임이 필요한지는 사람이 화면을 보고 판단합니다.', '');
const report = lines.join('\n');

console.log(`\n움직임 점검 (길이 기준 ${LIMIT}ms 이하)\n`);
for (const r of results) {
  if (!r.hasMotion) { console.log(`  [없음] ${r.file}`); continue; }
  console.log(`  [${r.fails.length ? '미달' : '통과'}] ${r.file}  가장 긴 움직임 ${r.max}ms`);
  for (const f of r.fails) console.log(`         · ${f}`);
}
const reportDir = path.join(ROOT, '04_deliver/reports');
if (target.startsWith(path.join(ROOT, '03_develop')) && fs.existsSync(reportDir)) {
  fs.writeFileSync(path.join(reportDir, 'motion-check.md'), report);
  console.log('\n리포트: 04_deliver/reports/motion-check.md');
}
console.log('');
process.exit(failed.length ? 2 : 0);
