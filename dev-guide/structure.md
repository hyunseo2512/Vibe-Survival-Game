# 📂 프로젝트 구조 및 실행 가이드

## 1. 디렉토리 구조 (Directory Structure)

현재 **`node_modules`의 위치는 정상**입니다. 프로젝트의 뿌리(Root)에 있는 것이 맞습니다.

```text
p1/ (프로젝트 최상위)
├── node_modules/     <-- ✅ 라이브러리 저장소 (정상 위치)
├── package.json      <-- ⚙️ 설정 파일
├── vite.config.ts    <-- ⚙️ 빌드 설정
├── index.html        <-- 📌 [중요] 웹사이트 대문 (여기로 옮겨야 함!)
└── src/
    ├── main/         <-- 🖥️ Electron (창 관리)
    ├── renderer/     <-- 🎨 Phaser (게임 화면)
        └── index.html (❌ 현재 여기 있어서 404 에러 발생)
```

## 2. 에러 원인 분석

- **404 Not Found**: Vite는 실행 시 `p1/index.html`을 찾는데, 파일이 `p1/src/renderer/index.html`에 숨어 있어서 못 찾고 있습니다.
- **Security Warning**: 이건 개발 모드에서만 뜨는 단순 경고입니다. 배포하면 사라지니 무시하셔도 됩니다.

## 3. 실행 위치 (Execution Path)

모든 명령어는 **`package.json`이 있는 `p1` 폴더**에서 실행해야 합니다.

```bash
# ✅ 올바른 위치: /home/zxcvne/project/p1
$ npm install
$ npm run dev
```
