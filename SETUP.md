# 설치 안내

워크숍 전에 아래 다섯 단계를 끝내 주세요. 15분 안팎이면 됩니다. 터미널을 처음 써도 괜찮습니다. 적힌 줄을 그대로 복사해 붙여 넣으면 됩니다.

> 회사 노트북은 보안 정책 때문에 설치나 접속이 막힐 수 있습니다. 가능하면 개인 노트북을 준비해 주세요. 회사 노트북만 가능하다면 미리 한 번 끝까지 해 보고, 막히는 곳을 알려 주세요.

## 준비물

- 노트북 (macOS 13 이상 또는 Windows 10 이상), 전원 어댑터
- Claude 유료 계정 (Pro 이상). 오후 실습은 사용량이 많아 Pro 는 한도에 닿을 수 있습니다. Max 를 쓰면 여유롭습니다.
- Chrome 브라우저

## 1. 터미널 열기

- **macOS:** Spotlight(Cmd + Space)에서 "터미널"을 검색해 실행
- **Windows:** 시작 메뉴에서 "PowerShell"을 검색해 실행 (화면에 `PS C:\` 로 시작하는 줄이 보이면 맞습니다)

## 2. Claude Code 설치

**macOS**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://claude.ai/install.ps1 | iex
```

설치가 끝나면 **터미널을 닫았다가 다시 열고** 아래를 입력합니다. 버전 숫자가 나오면 성공입니다.

```
claude --version
```

Windows 는 [Git for Windows](https://git-scm.com/downloads/win) 도 함께 설치해 두면 실습이 더 매끄럽습니다. (설치 화면에서는 기본값 그대로 "Next")

## 3. Node.js 설치

스크린샷과 측정 도구가 Node.js 를 씁니다. [nodejs.org](https://nodejs.org) 에서 **LTS** 버전을 내려받아 설치합니다. 설치 후 터미널을 다시 열고 확인합니다.

```
node --version
```

`v18` 이상이면 됩니다.

## 4. 스타터 키트 내려받기

1. 저장소 페이지에서 초록색 **Code** 버튼을 누르고 **Download ZIP** 을 선택합니다.
2. 압축을 풀고, 폴더를 **문서(Documents)** 안으로 옮깁니다. 폴더 이름이 `harness-workshop-kit-main` 이면 `harness-workshop-kit` 로 바꿉니다.
3. 터미널에서 그 폴더로 들어갑니다.

**macOS**

```bash
cd ~/Documents/harness-workshop-kit
```

**Windows**

```powershell
cd $HOME\Documents\harness-workshop-kit
```

(문서 폴더가 OneDrive 에 있다면 `cd $HOME\OneDrive\문서\harness-workshop-kit` 처럼 실제 위치로 들어갑니다. 탐색기에서 폴더를 터미널 창으로 끌어다 놓으면 경로가 자동으로 입력됩니다.)

Git 을 쓰는 분은 `git clone https://github.com/what-axis/harness-workshop-kit` 로 받아도 됩니다.

4. 측정 도구를 설치합니다. 한 번만 하면 됩니다.

```
npm install
```

## 5. 5분 점검

```
node scripts/doctor.mjs
```

네 줄이 모두 `[통과]` 이고 "준비 완료입니다"가 보이면 설치는 끝입니다.

마지막으로 Claude Code 를 실행해 로그인합니다.

```
claude
```

- 처음 실행하면 브라우저가 열립니다. Claude 유료 계정으로 로그인합니다.
- "이 폴더를 신뢰하나요?"라는 질문에는 "예"를 고릅니다.
- 입력창이 나오면 아래를 붙여 넣고 Enter.

```
이 폴더가 어떤 키트인지 세 줄로 설명해줘.
```

답이 돌아오면 준비 완료입니다. 나갈 때는 `/exit` 를 입력합니다.

## 안 될 때

| 증상 | 해결 |
|---|---|
| `claude` 를 찾을 수 없다고 나온다 | 터미널을 완전히 닫았다가 다시 엽니다. 그래도 안 되면 2단계를 다시 실행 |
| `npm` 을 찾을 수 없다고 나온다 | 3단계 Node.js 설치 후 터미널을 다시 엽니다 |
| Windows 에서 스크립트 실행이 막혔다고 나온다 | PowerShell 대신 "명령 프롬프트(cmd)"를 열어 같은 줄을 입력 |
| 점검에서 "브라우저 자동 실행 실패" | Chrome 을 설치하거나 최신으로 업데이트. 안 돼도 실습은 가능합니다 |
| 로그인 화면이 열리지 않거나 접속이 막힌다 | 회사 보안망일 수 있습니다. 개인 핫스팟으로 연결해 다시 시도 |
| 로그인은 됐는데 Claude Code 를 쓸 수 없다고 나온다 | 무료 계정입니다. Pro 이상으로 올려야 합니다 |

터미널이 부담스럽다면 Claude 데스크톱 앱의 Code 화면에서 이 폴더를 열어 같은 실습을 할 수 있습니다. 이 경우에도 3단계와 4단계의 `npm install` 은 필요합니다.

끝까지 안 되면 점검 화면을 캡처해 안내 메일에 적힌 연락처로 보내 주세요. 당일 시작 전에 함께 해결합니다.
