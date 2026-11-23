# 자동 검사(훅) 켜기

훅은 "어떤 일이 일어날 때마다 자동으로 실행되는 장치"입니다. 여기서는 **화면 파일이 저장될 때마다 기계 측정을 돌리고, 문제가 있으면 디자이너 에이전트에게 바로 되돌려 주는** 훅을 겁니다. 사람이 "검사해 줘"라고 말하지 않아도 리뷰가 파이프라인에 박혀 있는 상태가 됩니다.

워크숍에서는 강사가 시연합니다. 직접 켜 보고 싶다면 아래를 따라 하세요.

## 켜는 방법

`.claude/settings.json` 을 아래 내용으로 바꿉니다. (기존 `permissions` 는 그대로 두고 `hooks` 를 더한 것입니다)

```json
{
  "permissions": {
    "allow": [
      "Bash(node scripts/shot.mjs*)",
      "Bash(node scripts/measure.mjs*)",
      "Bash(node scripts/doctor.mjs*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "node scripts/hook-measure.mjs" }
        ]
      }
    ]
  }
}
```

저장한 뒤 Claude Code 를 다시 시작합니다. `/hooks` 를 입력하면 등록된 훅을 볼 수 있습니다.

## 어떻게 동작하나

1. 에이전트가 `03_develop/screens/` 의 html 이나 css 를 저장한다
2. 훅이 `scripts/measure.mjs --strict` 를 실행한다
3. 토큰 밖 컬러, 대비 미달, 터치 영역 미달, 작은 글자가 한 건이라도 있으면 그 사실이 에이전트에게 전달된다
4. 에이전트가 `04_deliver/reports/measure.md` 를 읽고 스스로 고친다

## 끄는 방법

`.claude/settings.json` 에서 `hooks` 부분을 지우고 다시 시작합니다.

## 알아 둘 점

- 훅은 숫자로 잴 수 있는 것만 막습니다. 위계, 흐름, 예외 상태는 여전히 리뷰어와 QA, 사람이 봅니다.
- 처음 화면을 만드는 중에는 파일을 저장할 때마다 검사가 걸려 느려질 수 있습니다. 1차 화면이 나온 뒤에 켜는 것을 권합니다.
- 회사 노트북에서 훅 실행이 막혀 있으면 `/measure` 를 직접 실행하는 방식으로 대신합니다.
