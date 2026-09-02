# PRD: 데스크톱 브라우저 시작 페이지 (Desktop Browser Start Page)

## 1. 개요 및 목표
데스크톱 브라우저를 켰을 때 **자주 가는 링크(60% 메인)** 를 중심으로, **일산 등 시/군/구 상세 지역의 오늘/내일 날씨 및 강수확률** 과 **7대 핵심 시장 시세(KOSPI, KOSDAQ, S&P 500, NASDAQ, TLT, GOLD, BTC)** 를 한눈에 볼 수 있는 깔끔하고 정갈한 개인화 대시보드를 구축합니다.

---

## 2. 변경 요구사항: GitHub Pages 무료 호스팅 배포 및 CI/CD 자동화

### 2.1 GitHub Pages 배포 지원
- **목적**: 로컬 서버를 켜지 않고도 브라우저 시작 페이지로 영구 사용할 수 있는 나만의 고유 웹 주소(`https://haksoo0918.github.io/start-page/`) 제공.
- **사양**:
  - `vite.config.ts`에 `base: './'` 설정 적용 (서브 디렉토리 에셋 상대 경로 보장)
  - `.github/workflows/deploy.yml` GitHub Actions 워크플로우 구성 (Push 시 자동 빌드 및 Pages 배포)
  - `README.md`에 GitHub Pages 배포 설정 및 브라우저 시작페이지 등록 가이드 최신화

---

## 3. 진행 절차
1. **PRD 및 계획서 작성** (완료)
2. **`vite.config.ts` 상대 경로(`base: './'`) 적용** 
3. **`.github/workflows/deploy.yml` GitHub Actions 구성** 
4. **`README.md` 업데이트** 
5. **단위 테스트 및 빌드 검증** 
