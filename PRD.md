# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(60% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 변경 요구사항: 종합 README.md 완성 (2가지 홈 설정 가이드 및 배포 안내 완전 복원)

### 2.1 README.md 필수 수록 항목
1. **[방법 1] GitHub Pages 웹 주소로 브라우저 시작페이지(홈) 설정하기 (가장 추천)**
   - 배포 주소: `https://haksoo0918.github.io/start-page/`
   - Chrome / Edge / Whale 브라우저별 시작 페이지 등록 3단계 가이드
   - GitHub 리포지토리에서 Pages 활성화하는 1회성 설정 안내 (Settings ➔ Pages ➔ GitHub Actions 선택)
2. **[방법 2] 크롬 확장 프로그램(Manifest V3)으로 등록하기 (오프라인/로컬 새 탭 지원)**
   - `npm run build` 후 `dist` 폴더를 `chrome://extensions`에 10초 만에 등록하는 단계별 가이드
3. **새 탭(`Ctrl+T`) 연동 팁**
   - New Tab Redirect 확장 프로그램을 통한 새 탭 오버라이드 팁
4. **주요 기능 명세 및 TDD 개발 가이드**

---

## 3. 진행 절차
1. **PRD 작성** (현재 단계 - 오직 PRD.md만 작성)
2. **사용자 승인 확인** (대기)
3. **README.md 작성 및 보강** 
4. **최종 검토 및 커밋 지시 대기** 
