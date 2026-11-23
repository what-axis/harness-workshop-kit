---
name: measure
description: 숫자로 잴 수 있는 항목(토큰 밖 컬러, 명도 대비, 터치 영역 44, 12px 미만 글자)을 기계로 측정해 04_deliver/reports/measure.md 를 만든다.
allowed-tools: Bash(node scripts/measure.mjs*)
---

# 기계 측정

`node scripts/measure.mjs` 를 실행합니다. 인자를 받으면 그 폴더를 잽니다: `node scripts/measure.mjs $ARGUMENTS`

끝나면 `04_deliver/reports/measure.md` 를 읽고 사용자에게 이렇게 보고합니다.

1. 요약 표 (화면별 건수)
2. 가장 심각한 것 3개를 쉬운 말로. 예: "가격 글자가 배경과 대비 3.68:1 이라 기준 4.5:1 에 못 미쳐요."
3. 이 측정이 **보지 못하는 것**을 한 줄로 상기: 위계, 흐름, 예외 상태, 카피는 리뷰어와 QA, 사람이 봅니다.

직접 화면을 고치지 않습니다. 고치려면 designer 에이전트에게 measure.md 를 근거로 맡깁니다.
