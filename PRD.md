# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(60% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 변경 요구사항: 파비콘 로딩 Fallback 강화 및 TDD 테스트 커버리지 전면 확장

### 2.1 파비콘(Favicon) 에러 방어 및 폴백 고도화 (`LinksHub.tsx`)
- **문제**: 일부 웹사이트의 파비콘 로딩 실패 또는 네트워크 지연 시 브라우저 기본 엑스박스(깨진 이미지)가 노출될 위험.
- **해결 방안**:
  - `img onError` 핸들러를 장착하여 파비콘 로딩 실패 시 사이트의 첫 글자(이니셜) 컬러 배지 또는 기본 브랜드 아이콘으로 매끄럽게 fallback 처리.
  - 파비콘 로딩 완료 전 깜빡임 방지.

### 2.2 TDD 테스트 스위트 전면 확장 (Test Suite Expansion)
- **시세 데이터 Seam (`stockData.test.ts`)**: 7대 핵심 자산 무결성 및 시장별(KR/US/24H) 1D/1W/1M/1Y 데이터 구조 검증.
- **날씨 서비스 Seam (`weatherService.test.ts`)**: 날씨 코드 매핑 및 기본 지역(일산동구) 정합성 검증.
- **스토리지 훅 Seam (`useLocalStorage.test.ts`)**: 상태 저장 및 JSON 직렬화/역직렬화 fallback 검증.

---

## 3. 진행 절차
1. **PRD 및 계획서 업데이트** (현재 단계)
2. **사용자 승인 확인** 
3. **단위 테스트 스위트 작성 (`stockData.test.ts`, `weatherService.test.ts`, `useLocalStorage.test.ts`)** 
4. **LinksHub.tsx 파비콘 에러 방어 및 fallback 적용** 
5. **테스트/빌드 검증 및 캡쳐 화면 확인** 
