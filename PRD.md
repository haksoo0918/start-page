# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(62% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 신규 기능 요구사항: 크롬 툴바 미니 팝업을 통한 '현재 페이지 바로가기 추가'

### 2.1 요구사항 배경 및 목적
- 사용자가 다른 웹사이트를 둘러보다가 마음에 드는 사이트를 발견했을 때, 주소를 일일이 복사해서 시작페이지를 열고 붙여넣는 번거로움 없이 **브라우저 우측 상단 확장 프로그램 아이콘을 눌러 즉시 시작화면에 바로가기로 등록** 할 수 있도록 지원합니다.

### 2.2 상세 기능 및 UX 사양
1. **확장 프로그램 액션 팝업 (`popup.html`)**:
   - 툴바 아이콘 클릭 시 작고 정갈한 Saniti Light 스타일의 미니 팝업창 표시.
   - `chrome.tabs.query`를 통해 현재 활성화된 탭의 **제목(`tab.title`)** 과 **URL(`tab.url`)** 을 자동으로 가져와 입력 폼에 미리 채움.
   - 사이트 이름(제목)과 주소를 직접 수정한 뒤 **[추가하기]** 버튼 클릭 가능.
2. **스토리지 동기화 및 실시간 반영**:
   - `chrome.storage.local`을 활용하여 팝업에서 추가한 링크를 안전하게 영구 저장.
   - 새 탭 대시보드(`App.tsx` / `useLocalStorage.ts`)는 `chrome.storage.onChanged` 리스너를 통해 툴바에서 추가된 링크를 **새로고침 없이 실시간으로 즉시 동기화**.
   - 일반 웹 환경(GitHub Pages 배포본)에서는 기존 `window.localStorage`로 완벽하게 Fallback 작동.
3. **매니페스트 권한 설정 (`public/manifest.json`)**:
   - `"permissions": ["activeTab", "storage"]`
   - `"action": { "default_popup": "popup.html", "default_title": "현재 페이지를 시작화면에 추가" }`

---

## 3. 진행 절차
1. **PRD 작성** (현재 단계 - 오직 PRD.md만 작성)
2. **사용자 승인 확인** (대기)
3. **`public/manifest.json` 액션 팝업 및 권한 등록** 
4. **미니 팝업 HTML 및 스크립트(`public/popup.html`, `public/popup.js` / Vite 멀티엔트리) 구현** 
5. **`useLocalStorage.ts`에 `chrome.storage` 양방향 동기화 지원** 
6. **단위 테스트 및 빌드 검증** 
