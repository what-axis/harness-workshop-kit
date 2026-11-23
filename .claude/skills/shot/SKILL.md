---
name: shot
description: 03_develop/screens 의 화면을 스크린샷으로 찍고 한눈에 보는 갤러리를 만든다. 화면을 만들거나 고친 뒤 확인할 때 쓴다.
allowed-tools: Bash(node scripts/shot.mjs*)
---

# 화면 스크린샷 찍기

`node scripts/shot.mjs` 를 실행합니다. 인자를 받으면 그 폴더를 찍습니다: `node scripts/shot.mjs $ARGUMENTS`

- 결과: `03_develop/shots/*.png` 와 `03_develop/shots/gallery.html`
- 끝나면 사용자에게 갤러리 파일 경로를 알려 주고, 브라우저로 열어 보라고 안내합니다. (macOS: `open 03_develop/shots/gallery.html`, Windows: `start 03_develop/shots/gallery.html` 을 대신 실행해도 됩니다)
- 실행이 실패하면 오류 첫 줄을 보여 주고 `node scripts/doctor.mjs` 를 돌려 원인을 확인합니다. 그래도 안 되면 HTML 파일을 브라우저로 직접 열어 보도록 안내합니다.
