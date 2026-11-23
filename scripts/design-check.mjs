// DESIGN.md 진단: AI가 읽는 디자인 규칙 문서가 세 층을 갖췄는지 기계로 확인합니다.
// 사용: node scripts/design-check.mjs [DESIGN.md 경로]
//   1층 겉모습  컬러, 타이포, 간격과 모서리, 컴포넌트 규격
//   2층 행동    상태 규칙(빈·오류·처리 중·불가), 카피 톤
//   3층 검증    숫자로 쓴 규칙, 이름 붙인 금지 사항, 글자색 대비, 버전 표기
// 결과: 04_deliver/reports/design-check.md
// 이 검사는 "문서에 적혀 있는가"만 봅니다. 규칙이 옳은지는 사람이 판단합니다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.cwd(), process.argv[2] || path.join(ROOT, 'DESIGN.md'));
if (!fs.existsSync(target)) {
  console.log(`[안내] ${target} 파일이 없습니다.`);
  process.exit(1);
}
const text = fs.readFileSync(target, 'utf8');

// ---- 문서를 머리말(YAML)과 제목별 구역으로 나누기 ----
let front = '';
let body = text;
const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
if (fm) { front = fm[1]; body = text.slice(fm[0].length); }
const sections = [];
let cur = { title: '(머리말)', text: '' };
for (const line of body.split('\n')) {
  const h = line.match(/^##\s+(.+)$/);
  if (h) { sections.push(cur); cur = { title: h[1].trim(), text: '' }; } else cur.text += line + '\n';
}
sections.push(cur);
const find = (re) => sections.find((s) => re.test(s.title));
const yamlHas = (key) => new RegExp(`^${key}:`, 'm').test(front);

// ---- 컬러 토큰 읽기 (표 형식과 YAML 형식 모두) ----
const colors = [];
const colorSec = find(/컬러|색상|Colou?rs?|Color Palette/i);
if (colorSec) {
  for (const line of colorSec.text.split('\n')) {
    const hex = line.match(/#([0-9a-fA-F]{6})\b/);
    if (!hex || !line.includes('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    colors.push({ name: (cells[0] || '').replace(/[`*]/g, ''), hex: '#' + hex[1].toUpperCase(), role: cells.slice(2).join(' ') });
  }
}
if (colors.length === 0 && yamlHas('colors')) {
  const block = front.split(/^colors:\s*$/m)[1]?.split(/^\S/m)[0] || '';
  for (const m of block.matchAll(/^\s+([\w.-]+):\s*"?(#[0-9a-fA-F]{6})"?/gm)) colors.push({ name: m[1], hex: m[2].toUpperCase(), role: '' });
}

// ---- 명도 대비 ----
const lum = (hex) => {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// 역할 칸의 첫 구절로 글자색인지 바탕색인지 가립니다. 역할이 없으면(YAML) 이름으로 추정합니다.
const firstRole = (c) => (c.role || '').split(/[,.(·]/)[0];
const isBg = (c) => /바탕|배경/.test(firstRole(c)) || /^(paper|surface|canvas|background|bg)\b/i.test(c.name);
const isText = (c) => !isBg(c) && (/글자|본문|텍스트/.test(firstRole(c)) || /^(ink|text|body|foreground|muted)\b/i.test(c.name));
const pairs = [];
for (const t of colors.filter(isText)) for (const b of colors.filter(isBg)) {
  if (t.hex === b.hex) continue;
  pairs.push({ text: t.name, bg: b.name, ratio: ratio(t.hex, b.hex) });
}
const failPairs = pairs.filter((p) => p.ratio < 4.5);

// ---- 층별 점검 ----
const stateSec = find(/상태|States?\b|State Rules/i);
const copySec = find(/카피|문구|Voice|Content|Tone/i);
const dontSec = find(/금지|Don'?ts?|하지 말/i);
const stateText = stateSec ? stateSec.text : '';
const bullets = dontSec ? dontSec.text.match(/^\s*[-*]\s+.+$/gm) || [] : [];
const dontItems = dontSec && /Do/i.test(dontSec.title) ? bullets.filter((l) => /^\s*[-*]\s+(Don'?t|Never|Avoid|No\b)/i.test(l)) : bullets;
const numericRules = (body.match(/\d+(\.\d+)?\s*:\s*1|\d+\s*(px|pt)\b|(높이|최소|이상|이하|미만)\s*\d+|\d+\s*(이상|이하|미만)/g) || []).length;
const hasVersion = /버전|version|업데이트|updated|v\d+\.\d+|20\d\d[-.]\d{1,2}/i.test(text);

const layers = [
  { name: '1층 겉모습', note: '남의 레퍼런스 파일로도 채워지는 층', checks: [
    ['컬러 토큰 5개 이상', colors.length >= 5, `${colors.length}개`],
    ['타이포그래피', !!find(/타이포|Typograph/i) || yamlHas('typography'), ''],
    ['간격과 모서리', !!find(/간격|모서리|Layout|Spacing|Shapes?/i) || yamlHas('spacing') || yamlHas('rounded'), ''],
    ['컴포넌트 규격', !!find(/컴포넌트|Components?/i) || yamlHas('components'), ''],
  ] },
  { name: '2층 행동', note: '우리 제품을 아는 사람만 쓸 수 있는 층', checks: [
    ['상태 규칙 구역', !!stateSec, stateSec ? `"${stateSec.title}"` : '없음'],
    ['빈 상태', /빈 상태|비어|empty/i.test(stateText), ''],
    ['오류 상태와 안내 문장', /오류|에러|error/i.test(stateText), ''],
    ['처리 중(로딩)', /처리 중|로딩|loading|skeleton/i.test(stateText), ''],
    ['불가(품절·비활성)', /불가|품절|비활성|disabled|unavailable/i.test(stateText), ''],
    ['카피 톤', !!copySec, copySec ? `"${copySec.title}"` : '없음'],
  ] },
  { name: '3층 검증', note: '기계와 리뷰어가 채점할 수 있게 만드는 층', checks: [
    ['숫자로 쓴 규칙 8개 이상', numericRules >= 8, `${numericRules}개`],
    ['금지 사항 3개 이상', dontItems.length >= 3, `${dontItems.length}개`],
    ['글자색과 바탕색 대비 4.5:1', pairs.length > 0 && failPairs.length === 0, pairs.length === 0 ? '글자색·바탕색 역할을 찾지 못함' : `${pairs.length}쌍 중 미달 ${failPairs.length}쌍`],
    ['버전 또는 날짜 표기', hasVersion, ''],
  ] },
];

// ---- 보고서 ----
const kb = (Buffer.byteLength(text) / 1024).toFixed(1);
const out = [];
out.push(`# DESIGN.md 진단`, '', `대상: \`${path.relative(ROOT, target) || target}\` · 크기 ${kb}KB`, '');
out.push('| 층 | 채움 | 뜻 |', '|---|---|---|');
for (const l of layers) out.push(`| ${l.name} | ${l.checks.filter((c) => c[1]).length} / ${l.checks.length} | ${l.note} |`);
out.push('');
for (const l of layers) {
  out.push(`## ${l.name}`, '');
  for (const [label, ok, detail] of l.checks) out.push(`- ${ok ? '[x]' : '[ ]'} ${label}${detail ? ` (${detail})` : ''}`);
  out.push('');
}
if (failPairs.length) {
  out.push('## 대비가 부족한 조합', '', '| 글자 | 바탕 | 대비 |', '|---|---|---|');
  for (const p of failPairs.sort((a, b) => a.ratio - b.ratio).slice(0, 12)) out.push(`| ${p.text} | ${p.bg} | ${p.ratio.toFixed(2)}:1 |`);
  out.push('', '글자로 쓰지 않는 색이라면 역할 칸에 "아이콘·테두리만"처럼 적어 두세요.', '');
}
if (Number(kb) > 40) out.push('## 크기', '', `문서가 ${kb}KB 입니다. 매번 통째로 읽히는 파일이므로 길수록 비용과 흔들림이 커집니다. 컴포넌트 상세는 별도 파일로 나누는 것을 검토하세요.`, '');
out.push('## 이 진단이 보지 못하는 것', '', '규칙이 옳은지, 우리 브랜드다운지, 실제 화면과 일치하는지는 사람이 판단합니다.', '');

const reportDir = path.join(ROOT, '04_deliver/reports');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'design-check.md'), out.join('\n'));

console.log(`\nDESIGN.md 진단 (${kb}KB)`);
for (const l of layers) {
  const n = l.checks.filter((c) => c[1]).length;
  console.log(`  ${l.name}  ${'■'.repeat(n)}${'□'.repeat(l.checks.length - n)}  ${n}/${l.checks.length}`);
  for (const [label, ok, detail] of l.checks) if (!ok) console.log(`     빠짐: ${label}${detail ? ` (${detail})` : ''}`);
}
console.log('\n자세한 내용: 04_deliver/reports/design-check.md\n');
