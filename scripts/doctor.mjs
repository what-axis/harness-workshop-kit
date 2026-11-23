// 5분 점검: 실습 준비가 됐는지 확인합니다.
// 사용: node scripts/doctor.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT } from './_browser.mjs';

const ok = (m) => console.log('  [통과] ' + m);
const no = (m, fix) => {
  console.log('  [확인 필요] ' + m);
  if (fix) console.log('             -> ' + fix);
  failed++;
};
let failed = 0;

console.log('\n디자인 하네스 스타터 키트 점검\n');

// 1. Node
const major = Number(process.versions.node.split('.')[0]);
major >= 18 ? ok(`Node.js ${process.versions.node}`) : no(`Node.js ${process.versions.node}`, 'Node.js LTS(18 이상)를 설치하세요: https://nodejs.org');

// 2. Claude Code (터미널의 claude 명령, 또는 Claude 앱의 Code 탭)
const inClaude = !!(process.env.CLAUDECODE || process.env.CLAUDE_CODE_ENTRYPOINT);
try {
  const v = execSync('claude --version', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  ok(`Claude Code ${v}`);
} catch {
  if (inClaude) ok('Claude Code (Claude 앱의 Code 탭에서 실행 중)');
  else console.log('  [안내] 터미널용 claude 명령은 없습니다. Claude 앱의 Code 탭으로 진행한다면 괜찮습니다.');
}

// 3. 키트 파일
const must = [
  'DESIGN.md', 'CLAUDE.md',
  '.claude/agents/designer.md', '.claude/agents/reviewer.md', '.claude/agents/qa.md', '.claude/agents/director.md',
  '00_inputs/product-brief.md', '04_deliver/rubric.md', '04_deliver/qa-checklist.md',
];
const missing = must.filter((f) => !fs.existsSync(path.join(ROOT, f)));
missing.length === 0 ? ok(`키트 파일 ${must.length}개`) : no('빠진 파일: ' + missing.join(', '), '키트를 다시 내려받으세요.');

// 4. 측정 도구
if (!fs.existsSync(path.join(ROOT, 'node_modules', 'playwright-core'))) {
  no('측정 도구가 설치되지 않음', '이 폴더에서 npm install 을 한 번 실행하세요.');
} else {
  try {
    const { openBrowser } = await import('./_browser.mjs');
    const b = await openBrowser();
    const p = await b.newPage();
    await p.setContent('<p>ok</p>');
    await b.close();
    ok('브라우저 자동 실행 (스크린샷, 측정 가능)');
  } catch (e) {
    no('브라우저 자동 실행 실패', 'Chrome 을 설치하거나 업데이트하세요. 안 되면 강사에게 알려 주세요(측정 없이도 실습은 가능).');
  }
}

console.log('');
if (failed === 0) {
  console.log('준비 완료입니다.\n');
} else {
  console.log(`확인이 필요한 항목이 ${failed}개 있습니다. 화살표(->) 안내를 따라 해 보고, 막히면 이 화면을 찍어 보내 주세요.\n`);
}
