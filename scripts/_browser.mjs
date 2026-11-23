// 공통: 브라우저 열기 + 경로 도우미
// 새 브라우저를 내려받지 않고, 이미 설치된 Chrome 또는 Edge를 씁니다.
import { chromium } from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VIEWPORT = { width: 390, height: 844 };

export async function openBrowser() {
  const tries = [
    { channel: 'chrome' },
    { channel: 'msedge' },
    {}, // playwright 전체 버전을 설치한 경우의 기본 Chromium
  ];
  let lastError;
  for (const opt of tries) {
    try {
      return await chromium.launch({ ...opt, headless: true });
    } catch (e) {
      lastError = e;
    }
  }
  console.error('\n[안내] Chrome 또는 Edge를 찾지 못했습니다.');
  console.error('Chrome을 설치한 뒤 다시 실행해 주세요: https://www.google.com/chrome/');
  console.error('(원인: ' + String(lastError && lastError.message).split('\n')[0] + ')\n');
  process.exit(1);
}

// 인자로 폴더를 주면 그 폴더, 없으면 03_develop/screens
export function resolveScreensDir(arg) {
  const dir = path.resolve(ROOT, arg || '03_develop/screens');
  if (!fs.existsSync(dir)) {
    console.error(`[안내] 폴더가 없습니다: ${path.relative(ROOT, dir)}`);
    process.exit(1);
  }
  return dir;
}

export function listScreens(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.html') && !f.startsWith('_'))
    .sort()
    .map((f) => ({ name: f, file: path.join(dir, f), url: pathToFileURL(path.join(dir, f)).href }));
}

export function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}
