## code-basic

## code-vite-ts

@ 이미지 경로 예시 (public/assets/images)
HTML: <img src="/assets/images/logo.png">
SCSS: background-image: url('/assets/images/bg.png');

## code-vue

1.src/scripts/components/layout.ts (네비게이션 및 레이아웃)
gnbInit, snbInit, lnbInit: GNB, SNB, LNB 메뉴 동작
stickyInit: 스크롤 시 헤더/LNB고정 처리
subSlideMenu: 서브 메뉴 슬라이드 처리

<!-- includeLayout: (Vite 환경에서는 필요 없을 수 있으나, 마크업 구조에 따라 확인 필요) -->

2.src/scripts/components/scroll.ts (스크롤 인터랙션)
scrollEvent: 스크롤 방향(Up/Down) 감지 및 커스텀 이벤트 트리거

scrollAction: Top 버튼, 앵커 이동, 헤더 보더 처리
scrollAnimated, scrollAnimate: 스크롤 시 요소 애니메이션 등장 효과
headerPercent: 스크롤 진행률(%) 표시

3.src/scripts/components/common.ts (기타 공통 UI)
loading: 로딩 화면 제어
progressInit: 프로그레스 바 애니메이션
waveEffectEvent: 버튼 클릭 시 물결 효과
userAgent: 브라우저/OS감지 클래스 추가
tab.ts 추가 보완 (Swiper)

4.tabSlide: Swiper 라이브러리를 사용하는 탭 슬라이드 기능이 ui.pub.js에 있습니다. 현재 code-vite-ts에는 Swiper가 설치되어 있지 않습니다.
확인 필요: Swiper를 npm으로 설치(npm install swiper)해서 구현할지, 아니면 제외할지 결정이 필요합니다.
