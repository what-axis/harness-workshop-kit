---
name: screenshot
description: screens/ 또는 sample/의 HTML 화면을 모바일 뷰포트 PNG로 캡처해 shots/에 저장한다. "스크린샷 찍어줘", "화면 확인해줘", 화면 캡처 요청 시 사용.
---

# 화면 스크린샷 스킬

HTML 프로토타입을 실제 렌더링된 이미지로 확인한다. Playwright CLI를 사용한다.

## 실행 방법

대상 HTML 파일 하나당 아래 명령을 실행한다 (프로젝트 루트 기준):

```bash
mkdir -p shots
npx playwright screenshot --viewport-size="390,844" --full-page "file://$(pwd)/screens/01_회의실목록.html" "shots/01_회의실목록.png"
```

- 파일명은 원본 HTML과 같은 이름으로 `shots/`에 저장한다
- "전부 찍어줘"면 `screens/*.html` 각각에 대해 실행한다
- 캡처 후에는 생성된 PNG를 Read 도구로 열어 실제 렌더링을 눈으로 확인하고, 코드만 봐서는 알 수 없는 문제(요소 겹침, 잘림, 여백 붕괴)가 보이면 사용자에게 보고한다

## 실패 시

- `browserType.launch: Executable doesn't exist` 류 오류 → `npx playwright install chromium` 실행 후 재시도
- 그래도 실패하면 사용자에게 "HTML 파일을 브라우저로 직접 열어 확인해 주세요"라고 안내하고 파일 경로를 알려준다 (macOS: `open 파일경로`, Windows: `start 파일경로`)
