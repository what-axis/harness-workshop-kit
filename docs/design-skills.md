# 디자이너가 참고할 스킬

실습을 끝내고 시간이 남았거나, 화면을 더 보기 좋게 다듬고 움직임까지 넣어 보고 싶을 때 보는 문서입니다. 2026-11-24 에 각 저장소를 내려받아 확인한 내용입니다.

스킬은 글로 쓴 작업 지침 폴더입니다. 이 키트의 `/brief`, `/rubric` 과 같은 형식이고, 남이 잘 써 둔 것을 내려받아 쓰는 것입니다. 스킬은 만드는 쪽(designer)의 솜씨를 올려 줍니다. 기준과 채점은 여전히 `DESIGN.md` 와 `04_deliver/rubric.md` 가 맡습니다.

## 1. 한눈에 보기

별 수와 마지막 수정일은 2026-11-24 깃허브 기준입니다. 스킬 개수는 저장소를 내려받아 센 값입니다.

| 하고 싶은 일 | 스킬 | 저장소 | 별 | 마지막 수정 | 라이선스 |
|---|---|---|---|---|---|
| 새 화면의 방향 잡기 | frontend-design | [anthropics/skills](https://github.com/anthropics/skills) | 198.1k | 11-16 | 스킬별 표기 확인 |
| 새 화면의 방향 잡기 | taste-skill (design-taste-frontend) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 117.5k | 11-22 | MIT |
| 디자인 시스템 초안 | ui-ux-pro-max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 152.2k | 11-24 | MIT |
| 평가하고 다듬기 | impeccable (명령 24개, 검사 규칙 62개) | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 112.0k | 11-18 | Apache-2.0 |
| 마이크로인터랙션 | animate, review-animations 등 20개 | [emilkowalski/skills](https://github.com/emilkowalski/skills) | 58.0k | 11-15 | MIT |
| 마이크로인터랙션과 마감 | better-motion, better-ui 등 16개 | [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | 12.0k | 11-18 | MIT |
| 모션그래픽 (웹) | gsap-core, gsap-timeline 등 8개 | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 17.0k | 04-21 | MIT |
| 영상으로 뽑기 | hyperframes, hyperframes-cli 등 | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | 88.8k | 11-24 | Apache-2.0 |
| 영상으로 뽑기 | remotion-best-practices 등 13개 | [remotion-dev/skills](https://github.com/remotion-dev/skills) | 5.5k | 11-23 | 저장소 확인 필요 |
| 3D 웹 | threejs-fundamentals, threejs-shaders 등 13개 | [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) | 3.7k | 10-19 | MIT |
| 코드 점검 | web-design-guidelines | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 33.6k | 11-20 | MIT |
| 핸드오프 | figma-design-to-code 등 17개 | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | 공식 | 11-18 | 저장소 확인 필요 |

Remotion 은 회사 규모에 따라 유료 라이선스가 필요할 수 있습니다. 회사 일에 쓰기 전에 Remotion 의 라이선스 안내를 확인하세요.

## 2. 설치하기

클로드에게 시키는 방법을 권합니다. 설치 전에 내용을 요약하게 하면 무엇이 들어오는지 알 수 있습니다.

```
emilkowalski/skills 저장소의 animate 스킬을 이 프로젝트에만 설치해줘. 설치하기 전에 SKILL.md 가 무엇을 시키는지 다섯 줄로 요약하고, 실행 파일이 들어 있으면 알려줘.
```

터미널에서 직접 설치한다면 각 저장소 README 의 명령을 씁니다.

| 스킬 | README 에 적힌 명령 |
|---|---|
| emilkowalski/skills | `npx skills@latest add emilkowalski/skills` |
| jakubkrehel/skills | `npx skills add jakubkrehel/skills` |
| impeccable | `npx impeccable install` |
| taste-skill | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` |
| gsap-skills | `npx skills add https://github.com/greensock/gsap-skills` |
| remotion | `npx skills add remotion-dev/skills` |
| hyperframes | `npx skills add heygen-com/hyperframes` |

이 명령들은 README 에서 옮긴 것이고, 이 문서를 쓰면서 직접 실행해 확인하지는 못했습니다. 저장소를 내려받아 스킬 파일을 읽는 것까지 확인했습니다.

설치할 때 지킬 것 세 가지입니다.

1. **설치 전에 읽습니다.** 스킬은 남이 쓴 지시문입니다. `SKILL.md` 는 글이라서 읽을 수 있습니다. 실행 파일이 함께 들어 있으면 무엇을 실행하는지 확인합니다.
2. **같은 일을 하는 스킬은 하나만 둡니다.** 값이 서로 다릅니다. 아래 3번의 표를 보세요.
3. **부딪히면 우리 규칙이 이깁니다.** 순서는 사람이 방금 한 말, `DESIGN.md` 와 채점표, 스킬입니다.

## 3. 같은 항목인데 값이 다릅니다

두 저장소의 스킬 파일에서 직접 읽은 값입니다.

| 항목 | emilkowalski (animate) | jakubkrehel (better-motion) | 이 키트의 DESIGN.md |
|---|---|---|---|
| 버튼 눌림 크기 | 0.97 | 0.96 | 정한 값 없음 |
| 차례로 등장하는 간격 | 30~80ms | 100ms | 정한 값 없음 |
| 서랍과 모달 길이 | 200~500ms | 350~450ms | 200ms 이하 (9번) |

둘 다 깔면 AI는 매번 다른 값을 고릅니다. 하나를 고르고, 고른 값을 `DESIGN.md` 에 적어 확정하세요. 키트의 200ms 기준은 스킬의 서랍 길이와 부딪힙니다. 어느 쪽을 따를지는 사람이 정해서 파일에 적습니다.

## 4. 마이크로인터랙션

`docs/skill-demos/` 에 같은 화면을 두 가지 값으로 만든 예시가 있습니다. 브라우저로 열어 버튼을 눌러 보세요.

| 파일 | 내용 |
|---|---|
| `micro-raw.html` | animate 스킬의 금지 목록에 있는 값으로 일부러 만든 예. `transition: all 500ms ease-in`, `scale(0)` 등장 |
| `micro-tuned.html` | 같은 스킬의 값에 키트의 200ms 기준을 적용한 예. 눌림 120ms, 문구 150ms, 숫자 180ms, 토스트 200ms |

두 파일은 강사가 스킬 파일을 읽고 직접 적용해 만든 것입니다.

animate 스킬이 시키는 순서를 요약하면 이렇습니다.

1. 얼마나 자주 보는 동작인가. 하루에 백 번 넘게 쓰는 동작과 키보드 동작에는 넣지 않습니다.
2. 목적을 한 단어로 말할 수 있는가. 반응, 위치, 상태, 급한 변화 막기. 말하지 못하면 넣지 않습니다.
3. 가장 가벼운 도구로. CSS 전환으로 되면 라이브러리를 들이지 않습니다.
4. `transform` 과 `opacity` 만 움직입니다.
5. 나타날 때는 ease-out, 300ms 안쪽. ease-in 은 쓰지 않습니다.
6. 움직임 줄이기 설정과 터치 기기의 hover 를 함께 처리합니다.

기계로 확인하려면 이렇게 합니다.

```
node scripts/motion-check.mjs docs/skill-demos
```

`motion-check` 는 CSS 에 적힌 값을 읽어 일곱 가지를 봅니다. 가장 긴 움직임이 기준 이하인지, `transition: all` 이 없는지, ease-in 이 없는지, 크기나 위치 속성을 움직이지 않는지, `scale(0)` 등장이 없는지, 끝없는 반복이 없는지, 움직임 줄이기 대응이 있는지입니다. 길이 기준은 `DESIGN.md` 의 "길이는 200ms 이하" 문장에서 읽습니다. 스크립트가 실행 중에 넣는 움직임(GSAP 등)은 보지 못합니다.

## 5. 모션그래픽

`docs/skill-demos/title-sequence.html` 은 겨울 세일 인트로를 GSAP 타임라인 하나로 만든 예시입니다. 인터넷에 연결된 상태에서 열어야 움직입니다.

| 도구 | 결과물 | 맞는 일 |
|---|---|---|
| GSAP (gsap-skills) | 웹 페이지 안의 움직임 | 랜딩 인트로, 스크롤 연동, 배너 |
| Remotion (remotion-dev/skills) | React 코드에서 MP4 | 숫자와 자막이 바뀌는 영상 |
| HyperFrames (heygen-com/hyperframes) | HTML 에서 MP4 | 제품 소개, 짧은 홍보 영상 |

모션그래픽을 글로 시킬 때는 느낌이 아니라 구간과 순서를 말합니다. 예시에 적용한 gsap-skills 의 규칙은 세 가지입니다. 움직임을 타임라인 하나에 올립니다. 구간에 이름표를 붙이고 그 기준으로 배치합니다. 움직임 줄이기 설정이면 이동 없이 페이드만 남깁니다.

### HyperFrames 는 모션그래픽인가요, 영상인가요

영상입니다. skills.sh 의 설치 순위 위쪽에 있는 `hyperframes-cli` 는 HyperFrames 프로젝트를 만들고, 확인하고, 타임라인을 고치고, MP4 로 렌더링하는 명령 도구를 다루는 스킬입니다. 장면은 HTML 과 GSAP 타임라인으로 짜지만, 결과물은 영상 파일입니다. 웹 페이지 안에서 움직이는 것이 필요하면 GSAP 스킬을, 영상 파일이 필요하면 HyperFrames 스킬을 씁니다.

```
npx skills add https://github.com/heygen-com/hyperframes --skill hyperframes-cli
```

## 5-1. 받은 DESIGN.md 로 만든 페이지

`docs/skill-demos/release-note.html` 은 Studio Mono 의 장바구니 릴리스 노트 페이지입니다. 공개 모음에 있는 결제 서비스의 DESIGN.md (제3자 분석)를 읽고, 빌릴 것과 빌리지 않을 것을 나눠서 만들었습니다. 강사가 직접 적용해 만든 예시입니다.

| 빌린 것 (구성과 수치 규칙) | 빌리지 않은 것 | 이유 |
|---|---|---|
| 큰 제목은 굵기 300, 자간을 좁게 | 브랜드 색, 배경 그라데이션, 이름 | 남의 브랜드를 정하는 것이라서 |
| 숫자는 폭 고정(tnum) | 버튼 패딩 8×16 | 터치 영역 44에 못 미쳐서 |
| 채운 버튼은 구역마다 하나 | 글꼴 | 유료 서체라서 |
| 그림자는 화면 목업에만, 두 겹 | | |
| 설명마다 실제 화면을 옆에 | | |

AI 티를 줄인 방법입니다. 새로 그려 낸 물건이 없고, 주인공은 키트의 실제 화면(`examples/after`)입니다. 깊이는 원근과 두 겹 그림자로만 냅니다. 숫자는 모두 `/measure` 가 낸 값입니다(고치기 전 26, 30, 17, 16 에서 고친 뒤 0). 움직임은 첫 화면의 기울기와 전후 비교 막대 두 곳뿐입니다.

처음에는 Three.js 로 그린 3D 텀블러 예시를 넣었다가 뺐습니다. 그려 낸 물건, 빛 번짐, 큰 장식 제목 때문에 AI 가 만든 티가 났습니다. [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills) 를 쓸 때는 물건을 직접 그리기보다 실제 3D 파일이나 사진이 있을 때 쓰는 편이 낫습니다.

```
00_inputs/reference 의 DESIGN.md 에서 구성과 수치 규칙만 빌려서 Studio Mono 장바구니 릴리스 노트 페이지를 만들어줘. 색, 이름, 배경 그림은 빌리지 말고 우리 DESIGN.md 를 써. 그림을 새로 그리지 말고 03_develop/shots 의 실제 화면을 쓰고, 숫자는 measure.md 의 값만 써. 끝나면 빌린 규칙과 빌리지 않은 규칙을 표로 알려줘.
```

## 6. 다듬기

Impeccable 은 디자이너가 쓰는 피드백 단어를 작업 이름으로 바꿔 놓았습니다. 쓰는 법은 `/impeccable 명령 대상` 입니다.

| 이렇게 느껴질 때 | 명령 |
|---|---|
| 밋밋하다 | `bolder` |
| 시끄럽다 | `quieter` |
| 뭐가 많다 | `distill` |
| 글자가 어색하다 | `typeset` |
| 답답하다 | `layout` |
| 문구가 모호하다 | `clarify` |
| 빈 화면과 오류가 없다 | `harden`, `onboard` |
| 내보내기 직전 | `polish` |
| 평가만 받고 싶다 | `critique`, `audit` |

Impeccable 에는 기계 검사기도 있습니다(규칙 62개). 그중에는 `DESIGN.md` 에 없는 글꼴, 색, 모서리, 글자 크기를 잡는 규칙이 있습니다. 이 키트의 `/measure` 와 같은 생각입니다. 이 문서를 쓰면서 규칙 목록까지 확인했고, 키트 화면에 검사를 돌려 보지는 못했습니다.

작지만 티가 나는 값입니다. emilkowalski 와 jakubkrehel 의 스킬 파일에서 골랐습니다.

| 눈에 걸리는 것 | 값 |
|---|---|
| 숫자가 바뀔 때 흔들린다 | `font-variant-numeric: tabular-nums` |
| 큰 제목이 헐겁다 | 자간 `-0.02em` |
| 본문 한 줄이 너무 길다 | 한 줄 65자 안쪽 |
| 겹친 모서리가 어긋난다 | 바깥 반지름 = 안 반지름 + 여백 |
| 터치에서 hover 가 남는다 | hover 되는 기기에서만 적용 |
| 아이콘이 글자보다 가늘다 | 글자 굵기 400 에 선 1.5px |

## 7. 파일 최적화와 관리

키트의 최종 화면 스크린샷 6장(780×1688)을 바꿔 잰 값입니다.

| 형식 | 합계 | 줄어든 정도 |
|---|---|---|
| PNG (원본) | 439.5 KB | |
| WebP (품질 80) | 121.5 KB | 72% |
| AVIF (품질 60) | 76.2 KB | 83% |

최적화도 느낌으로 시키지 않습니다. 전후 용량 표를 함께 달라고 합니다.

```
03_develop/shots 의 PNG 를 WebP 로 바꿔 옆에 저장하고, 파일별 전후 용량을 표로 보여줘. 원본은 지우지 마.
```

움직임이 버벅일 때 보는 것입니다. `transform` 과 `opacity` 만 움직입니다. `transition: all` 대신 속성 이름을 적습니다. 움직이는 흐림 효과는 20px 아래로 둡니다. `will-change` 는 문제가 보일 때만 붙입니다. 긴 목록은 보이는 줄만 그립니다.

파일 관리 규칙은 이 키트의 규칙 그대로입니다. 한 파일이 한 화면 상태입니다. 바꾼 결과는 원본 옆에 새 파일로 둡니다. 아이콘은 SVG 하나에 `currentColor` 를 쓰고 상태마다 파일을 만들지 않습니다. 규칙 밖의 색과 크기는 `/measure` 가 잡습니다.

## 8. 핸드오프

Figma 공식 스킬 가운데 디자이너의 일과 맞닿은 것입니다.

| 스킬 | 방향 | 하는 일 |
|---|---|---|
| `figma-design-to-code` | 피그마에서 코드 | 디자인을 프로젝트의 컴포넌트와 토큰에 맞춰 구현 |
| `figma-generate-design` | 코드에서 피그마 | 만든 화면을 피그마 화면으로 |
| `figma-generate-library` | 코드에서 피그마 | 변수, 컴포넌트, 라이트와 다크 |
| `figma-code-connect` | 양쪽 연결 | 피그마 컴포넌트와 코드 컴포넌트를 짝지음 |
| `figma-implement-motion` | 피그마에서 코드 | 피그마에 넣은 모션을 코드로 |

핸드오프에서 가장 자주 빠지는 것이 움직임입니다. 화면 캡처에는 움직임이 없기 때문입니다. 값이 CSS 에 숫자로 있으니 표로 뽑아 달라고 하면 됩니다.

```
/handoff 를 실행하고, 04_deliver/handoff.md 에 움직임 표(요소, 언제, 무엇이, 길이, 가속, 움직임 줄이기 대응)를 추가해줘. 값은 화면의 CSS 에서 읽어줘.
```

`micro-tuned.html` 의 움직임 표는 이렇게 나옵니다.

| 요소 | 언제 | 무엇이 | 길이 | 가속 |
|---|---|---|---|---|
| 담기 버튼 | 누르는 동안 | 크기 0.97 | 120ms | ease-out |
| 버튼 문구 | 담긴 뒤 | 투명도, 4px 이동 | 150ms | ease-out |
| 장바구니 숫자 | 담긴 뒤 | 크기 0.9 에서 1 | 180ms | ease-out |
| 토스트 | 담긴 뒤 4초 머묾 | 아래에서 위로 | 등장 200ms, 퇴장 150ms | ease-out |
| 움직임 줄이기 | 설정을 켠 사람 | 이동 없이 투명도만 | 150ms | ease |

## 9. 하네스 안에서 쓰는 법

스킬을 많이 까는 것이 AI 를 잘 쓰는 것은 아닙니다. 좋은 스킬 하나를 고르고, 그 값을 우리 규칙으로 확정하고, 기계와 채점표로 지킵니다.

| 자리 | 하는 일 |
|---|---|
| 스킬 | 만드는 쪽의 솜씨. 남이 정한 값과 금지 목록 |
| `DESIGN.md` | 우리 규칙. 부딪히면 여기가 이깁니다 |
| 기계 측정 | `/measure` 와 `motion-check` 가 숫자로 확인 |
| 채점표 | reviewer 가 우리 기준으로 채점 |
| 사람 | 보고, 승인 |

채점표에 넣을 문장 예입니다.

- 상태가 바뀔 때만 움직이고, 가장 긴 움직임이 200ms 이하다 (motion-check 통과).
- 움직임 줄이기 설정에서는 위치가 움직이지 않는다.
- 움직임이 없어도 상태 변화를 글자나 모양으로 알 수 있다.

emilkowalski 저장소의 `learn-taste` 스킬은 대화에서 나온 디자인 지적을 이유와 함께 `DESIGN.md` 나 검사 규칙으로 옮깁니다. 5교시의 "리뷰어의 눈을 내 눈에 맞추기"와 같은 생각입니다.

## 출처

- 스킬 내용: 표에 적은 각 저장소의 `SKILL.md` 와 README (2026-11-24 에 내려받은 판)
- 별 수: 각 저장소의 깃허브 페이지 (2026-11-24)
- 용량: 키트 `examples/after/shots` 를 2026-11-24 에 변환해 잰 값
