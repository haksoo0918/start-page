# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(60% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 변경 요구사항: 크롬 확장 프로그램 CORS 방어 및 host_permissions 권한 부여

### 2.1 문제 정의
- `chrome-extension://` 오리진 환경에서 Yahoo Finance 시세 API 호출 시 `host_permissions` 부재로 인한 CORS 차단 에러 발생.

### 2.2 해결 방안
- `public/manifest.json`에 `host_permissions` 명시:
  - `"https://query1.finance.yahoo.com/*"`
  - `"https://api.open-meteo.com/*"`
  - `"https://api.binance.com/*"`
  - `"https://api.microlink.io/*"`
  - `"https://*/*"`
- 크롬 확장 프로그램이 외부 시세, 날씨, 타이틀 조회 API와 CORS 제약 없이 자유롭고 안전하게 통신하도록 보장.

---

## 3. 진행 절차
1. **PRD 및 계획서 업데이트** (현재 단계)
2. **사용자 승인 확인** 
3. **public/manifest.json host_permissions 추가 및 빌드** 
4. **확장 프로그램 새로고침 후 통신 정상화 확인** 
