# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 이 문서에 기록됩니다.
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.0.0] - 2026-09-01

### ✨ 기능 추가 (Added)
- **자주 가는 링크 허브 (Quick Links Hub)**: 
  - 5열 와이드 그리드 타일 배치
  - 마우스 드래그 앤 드롭(Drag & Drop)을 통한 자유로운 순서 변경 및 실시간 LocalStorage 영구 보존
  - 파비콘 자동 추출, 사이트명/도메인 표시, 바로가기 추가/수정/삭제 모달
  - 링크 확장 시 독립 슬림 스크롤 적용
- **일산 등 시/군/구 상세 일기예보 위젯 (Rain Forecast)**:
  - 전국 250+ 시/군/구(고양시 일산동구/서구, 분당, 송도, 서울 전 구 등) 한글 검색 지원
  - 오늘 & 내일 비 올 확률(%) 대형 강조 배지 및 우산 챙기기 알림
  - 48시간 시간대별 강수확률 및 기온 타임라인 바 차트 (Open-Meteo 실시간 연동)
- **4대 핵심 자산 시세 위젯 (Stock & Market Charts)**:
  - KOSPI, S&P 500, TLT(미국 장기채), GOLD(국제 금 시세) 시세 연동
  - `1D`, `1W`, `1M`, `1Y` 기간별 인터랙티브 영역 차트
- **배경 커스터마이징 (Background Settings)**:
  - 고화질 프리셋 배경 선택, URL 직접 입력, 내 컴퓨터 파일 업로드
  - 배경 흐림(Blur) 및 카드 투명도 미세 조절 슬라이더
  - 단색 기본 배경 초기화 및 LocalStorage 저장
- **모달 단축키 지원**:
  - 모든 팝업 모달에서 `ESC` 키 입력 시 즉시 닫기 지원

### 🎨 디자인 및 UI (Design)
- **Saniti 디자인 시스템(`saniti-design`) 적용**:
  - 부드러운 소프트 그레이 배경(`--color-canvas: #f8f9fa`)과 화이트 카드(`--color-canvas-card: #ffffff`)의 라이트 테마
  - 시그니처 코랄 레드(`--color-brand: #f36458`) 포인트
  - 정갈한 1px Hairline 보더(`--color-hairline: #e5e7eb`)
  - **Google Noto Sans KR** (본문/헤딩) + **IBM Plex Mono** (레이블/티커/수치)
- **1920x1018 FHD 데스크톱 기본 최적화**:
  - 브라우저 창 전체 우측 스크롤바 완전 제거 (`100vh Fixed Layout`)
  - 차트 하단 여백 공백 제거 및 Flex 100% 렌더링
  - 1024x800 소형 화면 가드(반응형 안전장치) 탑재
