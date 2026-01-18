# Electron (일렉트론) 상세 가이드

## 1. 개요 (Overview)

Electron은 **웹 기술(HTML, CSS, JS)**로 **데스크탑 앱(Windows, Mac)**을 만드는 프레임워크입니다.
크롬 브라우저(Chromium)와 Node.js를 합쳐놓은 형태입니다.

## 2. 작동 프로세스 (Process Architecture)

Electron은 보안과 안정성을 위해 두 가지 프로세스로 나뉘어 일합니다.

### 2.1. Main Process (메인 프로세스)

- **역할**: 앱의 **'본체'**이자 **'관리자'**입니다.
- **권한**: 컴퓨터 시스템(파일 접근, 트레이 아이콘, 알림 등)에 접근할 수 있는 강력한 권한이 있습니다.
- **파일**: 보통 `main.ts` 또는 `index.ts`라는 파일에서 시작됩니다.
- **하는 일**:
  - `BrowserWindow`를 생성하여 창을 띄웁니다.
  - 앱이 켜지고 꺼질 때의 이벤트를 처리합니다.

```typescript
// main.ts 예시
const { app, BrowserWindow } = require("electron");

function createWindow() {
  // 800x600 크기의 창 생성
  const win = new BrowserWindow({ width: 800, height: 600 });
  // 우리가 만든 웹 게임(index.html)을 로드
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
```

### 2.2. Renderer Process (렌더러 프로세스)

- **역할**: 실제 **'화면'**을 보여주는 **'웹 브라우저'**입니다.
- **권한**: 보안상 컴퓨터 시스템에 직접 접근할 수 없습니다. (브라우저와 동일)
- **하는 일**:
  - HTML, CSS, Phaser 게임 로직이 여기서 돌아갑니다.
  - 우리가 대부분의 코드를 작성할 곳입니다.

## 3. 통신 (IPC: Inter-Process Communication)

렌더러(게임 화면)에서 파일을 저장하고 싶다면 메인(관리자)에게 부탁해야 합니다. 이때 사용하는 것이 **IPC**입니다.

- **ipcRenderer**: 렌더러가 메인에게 메시지를 보냄 ("저장해줘!")
- **ipcMain**: 메인이 메시지를 받아서 처리함 ("ㅇㅋ 저장함")

```typescript
// [Renderer] 게임에서
ipcRenderer.send("save-game", saveData);

// [Main] 관리자에서
ipcMain.on("save-game", (event, data) => {
  fs.writeFileSync("save.json", data); // 파일 저장
});
```

## 4. 우리 프로젝트에서의 전략

- **최소한의 Electron**: 우리는 '게임'이 메인이므로, Electron은 단순히 창을 띄우는 용도로만 가볍게 사용합니다.
- **복잡한 건 나중에**: 자동 업데이트나 트레이 아이콘 같은 고급 기능은 게임이 완성된 후에 붙입니다.
