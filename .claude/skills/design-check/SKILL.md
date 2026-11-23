---
name: design-check
description: DESIGN.md 가 세 층(겉모습, 행동, 검증)을 갖췄는지 기계로 진단해 04_deliver/reports/design-check.md 를 만든다. DESIGN.md 를 만들거나 고친 뒤, 또는 남의 레퍼런스 파일을 평가할 때 쓴다.
allowed-tools: Bash(node scripts/design-check.mjs*)
argument-hint: "[진단할 DESIGN.md 경로. 비우면 이 키트의 DESIGN.md]"
---

# DESIGN.md 진단

`node scripts/design-check.mjs $ARGUMENTS` 를 실행합니다.

끝나면 `04_deliver/reports/design-check.md` 를 읽고 이렇게 보고합니다.

1. 세 층의 채움 정도를 표로 (1층 겉모습, 2층 행동, 3층 검증)
2. 빠진 항목을 쉬운 말로. 예: "빈 상태일 때 화면이 무엇을 보여 줘야 하는지 적혀 있지 않아요."
3. 빠진 항목마다 **사용자에게 물어볼 질문 한 개**. 답을 지어내지 않습니다. 예: "장바구니가 비었을 때 가장 먼저 보여 주고 싶은 것은 무엇인가요?"
4. 이 진단이 보지 못하는 것 한 줄: 규칙이 옳은지, 우리 브랜드다운지는 사람이 판단합니다.

문서를 직접 고치지 않습니다. 사용자가 질문에 답하면 그 답을 "숫자나 예·아니오로 확인할 수 있는 문장"으로 바꿔 보여 주고, 승인을 받은 뒤에 DESIGN.md 의 알맞은 구역에 넣습니다.
