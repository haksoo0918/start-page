# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 이 문서에 기록됩니다.
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.6.2] - 2026-09-02

### ⚡ UX 및 디자인 정돈 (UX & Cleanup)
- **바로가기 클릭 시 현재 탭 이동**:
  - `LinksHub.tsx`의 `target="_blank"` 속성을 제거하여 새 창이 아닌 현재 탭에서 즉시 사이트로 전환
- **헤더 우측 불필요한 상태 문구 삭제**:
  - `App.tsx` 헤더의 지역 및 비 소식 상태 텍스트(`header-status`)를 제거하여 정갈한 미니멀 타이틀 라인으로 정리

## [1.6.1] - 2026-09-02

### 📝 문서화 및 코드 정돈 (Docs & Cleanup)
- **전체 소스 코드 및 스타일시트 주석 100% 한글화**:
  - 컴포넌트(`App.tsx`, `BookmarkModal.tsx`, `LinksHub.tsx`, `RainForecastCard.tsx`, `StockCard.tsx`, `RegionSelectModal.tsx`)
  - 데이터 및 서비스(`stockData.ts`, `stockService.ts`, `useLocalStorage.ts`)
  - 스타일시트(`app.css`, `saniti-tokens.css`)

## [1.6.0] - 2026-09-02

### 🚀 배포 및 플랫폼 확장 (Platform & Extension)
- **크롬 확장 프로그램 (Manifest V3) 정식 지원**:
  - `public/manifest.json` 구성을 통해 `dist` 폴더를 Chrome, Edge, Whale 브라우저의 새 탭 확장 프로그램으로 직접 등록 가능 (로컬 서버/터미널 실행 불필요)
  - `host_permissions` 권한 등록을 통해 확장 프로그램 환경에서의 Yahoo Finance 및 외부 API CORS 차단 원천 해결
- **종합 [README.md](README.md) 가이드 구축**:
  - 확장 프로그램 10초 등록 가이드 및 Vercel 무료 웹 배포 가이드 수록

## [1.5.2] - 2026-09-02

### 🎨 UI 및 스타일 정돈 (Style & Cleanup)
- **새 바로가기 추가 타일 원본 디자인 복원**:
  - `add-link-tile` 클래스로 복구하여 투명 배경 및 점선 테두리(`border: 1px dashed`) 스타일 정상화
- **시세 카드 타이틀 간소화**:
  - `주요 시세 및 지수` ➔ `주요 시세`로 제목 단일화

## [1.5.1] - 2026-09-02

### 🛡️ 안정성 및 품질 강화 (Resilience & Tests)
- **파비콘 에러 방어 및 Fallback 고도화 (`LinksHub.tsx`)**:
  - 외부 파비콘 로딩 실패 시 깨진 이미지 엑스박스 대신 단정한 지구본/이니셜 대체 배지로 자동 전환
- **TDD 단위 테스트 스위트 전면 확장**:
  - `stockData.test.ts` (7대 시세 무결성 및 시장별 타임라인 검증)
  - `weatherService.test.ts` (기상 코드 매핑 및 지역 정합성 검증)
  - `useLocalStorage.test.ts` (스토리지 직렬화 및 상태 동기화 검증)
  - `urlHelper.test.ts` (URL 정규화 및 타이틀 추출 검증)
  - ➔ 총 18개 단위 테스트 100% Pass (Green) 달성

## [1.5.0] - 2026-09-02

### ✨ 신규 기능 (Feature)
- **바로가기 URL 우선 입력 & 웹페이지 제목 자동 가져오기**:
  - 바로가기 추가/수정 모달에서 웹사이트 주소(URL) 입력 필드를 1순위로 배치 및 자동 포커스
  - 주소 입력 시 실제 웹페이지의 HTML `<title>`을 비동기로 자동 조회하여 제목 칸에 자동 완성
  - 제목 조회 중 회전 스피너 애니메이션(`@keyframes spin`) 및 `✨ 자동 완성됨` 인디케이터 제공

## [1.4.1] - 2026-09-01

### 🎨 스타일 미세 조정 (Style)
- `dashboard-header` 좌우 내부 패딩(`padding: 8px 16px 12px 16px`)을 적용하여 타이틀 및 상태 텍스트의 여유 공간 확보

## [1.4.0] - 2026-09-01

### 🗑️ 기능 제거 및 최적화 (Cleanup)
- **배경 커스터마이징 기능 완전 삭제**:
  - 헤더의 '배경 설정' 버튼 및 아이콘 완전 제거
  - `BackgroundModal.tsx` 컴포넌트 및 배경 이미지 렌더링 레이어, 로컬스토리지 상태 관리 코드 전면 삭제
  - Saniti Light 본연의 정갈하고 가벼운 순수 대시보드로 복원

## [1.3.0] - 2026-09-01

### ✨ 디자인 및 UI 개선 (Design & UI)
- 날씨 카드 레이아웃 & 비주얼 밸런스 완성 (제목 '날씨' 간소화, 강수확률 수직 시선 흐름, 오늘 카드 위계 강조)
- 최저/최고 기온 명문화 (`최저 18° · 최고 26°`)
- 전역 기본 폰트 Google Noto Sans KR 100% 통일

## [1.2.0] - 2026-09-01

### ✨ 기능 개선 및 고도화 (Enhanced)
- 7대 주요 시세 시장별(한국/미국/24H가상자산) 특화 타임라인 분기 및 Trailing 롤링 날짜 적용
- 강수확률 차트 오늘 밤 실제 22시 단독 강조 및 세로 구분선 정밀 정렬

## [1.0.0] - 2026-09-01

### ✨ 최초 릴리즈 (Initial Release)
- 자주 가는 링크 5열 그리드 & 드래그 앤 드롭 순서 변경
- 전국 250+ 시군구 날씨 예보
- Saniti Light 디자인 시스템 적용
- 100vh 윈도우 무스크롤 고정 레이아웃
