// 자동 검사(훅)용: 화면 파일이 저장될 때마다 기계 측정을 돌립니다.
// Claude Code 가 저장 정보를 표준 입력(JSON)으로 넘겨 줍니다.
// 문제가 있으면 종료 코드 2 로 끝나고, 그 내용이 Claude 에게 되돌아가 스스로 고치게 됩니다.
// 켜는 방법은 docs/hook.md 를 보세요.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { ROOT } from './_browser.mjs';

let input = '';
for await (const chunk of process.stdin) input += chunk;
let file = '';
try {
  file = JSON.parse(input)?.tool_input?.file_path || '';
} catch {}

const norm = file.split(path.sep).join('/');
const isScreen = /03_develop\/screens\/[^/]+\.(html|css)$/i.test(norm);
if (!isScreen) process.exit(0); // 화면 파일이 아니면 아무것도 하지 않음

const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'measure.mjs'), '--strict'], {
  cwd: ROOT,
  encoding: 'utf8',
});
if (r.status === 2) {
  process.stderr.write(r.stderr || '기계 측정에서 문제가 발견됐습니다. 04_deliver/reports/measure.md 를 확인하세요.');
  process.exit(2);
}
process.exit(0);
