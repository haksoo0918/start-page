# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(60% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 변경 요구사항: 미사용 잔여 코드(Dead Code) 전면 정리 및 무결성 확보

### 2.1 조사된 미사용 잔여 코드 및 정리 항목
1. **`src/utils/urlHelper.ts`**:
   - 제목 자동완성 기능 제거에 따라 불필요해진 `fetchPageTitle`, `extractTitleFromHtml`, `cleanTitle` 비동기 스크래핑 잔여 코드 삭제.
   - 핵심 `normalizeUrl` 유틸리티만 남겨 번들 크기 경량화 및 코드 단순화.
2. **`src/utils/urlHelper.test.ts`**:
   - 삭제된 함수 테스트를 정리하고 실제 사용 중인 `normalizeUrl` 무결성 검증으로 최적화.
3. **`src/styles/app.css`**:
   - 헤더 우측 상태 문구 삭제로 인해 더 이상 사용되지 않는 `.header-status` CSS 클래스 제거.
4. **`public/manifest.json`**:
   - `version`을 최신 버전(`1.6.2`)으로 동기화.

---

## 3. 진행 절차
1. **PRD 및 계획서 업데이트** (현재 단계)
2. **사용자 승인 확인** 
3. **잔여 코드 삭제 및 정돈 적용** 
4. **단위 테스트 및 빌드 검증** 
