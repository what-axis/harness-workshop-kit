# UX/UI 디자이너를 위한 하네스 엔지니어링 — 스타터 키트

2026-10-30 데브멘토 워크숍 실습 환경입니다. 이 폴더 하나에 오늘 쓰는 모든 재료가 들어 있습니다.

## 받는 법

```bash
git clone https://github.com/what-axis/harness-workshop-kit
cd harness-workshop-kit
```

git이 안 되면: 저장소 페이지에서 초록색 **Code → Download ZIP** 을 눌러 받고 압축을 풀어도 똑같습니다.

## 준비 확인 (3단계 — 행사 전날까지 완료)

1. 터미널에서 `claude` 실행 → 로그인 화면 없이 대화창이 뜨는가
2. **이 폴더 안에서** `claude` 실행 후 `/agents` 입력 → designer, reviewer, qa, director 네 개가 보이는가
3. 대화창에 `sample/점검용_샘플화면.html 스크린샷 찍어줘` 입력 → `shots/` 폴더에 PNG가 생기는가

3번이 안 되면 터미널에서 `npx playwright install chromium` 을 먼저 실행하세요. (자세한 해결법: 워크숍 안내 메일의 설치 가이드)

## 폴더 안내

| 경로 | 내용 |
|---|---|
| `CLAUDE.md` | 이 프로젝트의 규칙 — Claude Code가 자동으로 읽습니다 |
| `.claude/agents/` | 에이전트 4종: designer(화면 생성) · reviewer(루브릭 채점) · qa(케이스·누락 도출) · director(수정 지시·정지 판단) |
| `.claude/skills/` | 스킬 2종: screenshot(화면 캡처) · design-loop(디렉터 루프 실행) |
| `brief/실습용_기획서.md` | 오늘의 실습 프로젝트: 사내 회의실 예약 서비스 '모두의회의실' |
| `research/` | 사용자 인터뷰 스크립트 3인분 + "나를 인터뷰해" 프롬프트 |
| `design/DESIGN.md` | 샘플 디자인 시스템 (디자이너 에이전트가 읽는 명세) |
| `rubric/루브릭.md` | 반쯤 채워진 채점표 — 오후에 여러분의 기준으로 완성합니다 |
| `qa/QA_체크리스트.md` | 상태·엣지·누락 화면 점검 목록 |
| `hooks-example/` | 자동 채점 훅 시연 자료 (기본 비활성) |
| `screens/` `reports/` `shots/` `outputs/` | 실습 중 생성되는 화면 / 리포트 / 스크린샷 / 기타 산출물 |

## 오늘의 흐름

인터뷰(Discover) → 브리프·가설(Define) → 1차 화면(Develop, 검증 없이) → 채점·QA·수정 반복(Deliver) → 내 업무 하네스 카드

각 단계의 상세 안내는 워크숍 화면에 공유되는 실습 안내를 따라가면 됩니다.
