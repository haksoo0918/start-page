# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(60% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 변경 요구사항: 바로가기 URL 전체 경로 표시 및 호스트 강조

### 2.1 요구사항 배경 및 목적
- 기존에는 바로가기 카드 하단에 도메인(Host)만 표시되어, 세부 경로가 포함된 링크(예: `comic.naver.com/webtoon`, `github.com/trending`)의 전체 URL 맥락을 파악하기 어려웠음.
- 전체 경로를 표시하되, 카드 레이아웃을 해치지 않도록 말줄임표(`...`)를 적용하고 **도메인(Host) 부분만 굵게(Bold)** 강조하여 가독성을 높임.

### 2.2 상세 기능 및 UI 사양
1. **URL 전체 경로 포맷팅**:
   - `https://`, `http://`, `www.` 프로토콜/접두사는 제거하여 간결함 유지.
   - 호스트(Host)와 세부 경로(Path/Query)를 분리 파싱.
2. **시각적 계층화 (Host 볼드 강조)**:
   - **호스트 (`.link-url-host`)**: `font-weight: 600`, 약간 더 또렷한 톤(`var(--color-slate)`)으로 굵게 강조.
   - **경로 (`.link-url-path`)**: `font-weight: 400`, 부드러운 톤(`var(--color-mute)`)으로 자연스럽게 연결.
3. **말줄임표(Ellipsis) 처리**:
   - 타일 너비를 벗어나는 긴 URL은 `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`으로 한 줄 내에서 안전하게 말줄임 처리.

---

## 3. 진행 절차
1. **PRD 작성** (현재 단계 - 오직 PRD.md만 작성)
2. **사용자 승인 확인** (대기)
3. **`LinksHub.tsx` 포맷팅 함수 및 렌더링 구현** 
4. **`app.css` 스타일 적용** 
5. **단위 테스트 및 실제 브라우저 캡쳐 검증** 
