export function initSticky() {
  handleScrollTop();

  // 앵커 탭 상단 고정 (필요 시 주석 해제)
  // initStickyAnchor(); 
}

// 1. Scroll Top Button (맨 위로 가기)
function handleScrollTop() {
  const btnScroll = document.querySelector('.btn-scrollTop') as HTMLElement;
  if (!btnScroll) return;

  // 스크롤 감지 (버튼 노출 여부)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      btnScroll.classList.add('is-active');
    } else {
      btnScroll.classList.remove('is-active');
    }
  }, { passive: true }); // passive: true로 스크롤 성능 최적화

  // 클릭 이벤트 (부드럽게 상단 이동)
  btnScroll.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 2. Sticky Anchor (앵커 탭 고정)
export function initStickyAnchor() {
  const anchorWrap = document.querySelector('.anchor-wrap') as HTMLElement;
  if (!anchorWrap) return;

  const header = document.querySelector('.header') as HTMLElement;
  // 헤더가 없으면 0, 있으면 높이값 계산
  const headerHeight = header ? header.offsetHeight : 0;

  // 앵커의 초기 절대 위치 계산 (현재 스크롤 위치 + 뷰포트 대비 위치)
  const anchorRect = anchorWrap.getBoundingClientRect();
  const anchorInitialTop = anchorRect.top + window.scrollY;

  // Placeholder 생성 (fixed로 붕 떠버린 공간을 채워줄 요소)
  const placeholder = document.createElement('div');
  placeholder.style.height = `${anchorWrap.offsetHeight}px`;
  placeholder.style.display = 'none'; // 초기엔 숨김
  
  // anchorWrap 바로 뒤에 placeholder 삽입
  anchorWrap.insertAdjacentElement('afterend', placeholder);

  // 스크롤 핸들러
  const handleScroll = () => {
    const scrollTop = window.scrollY;

    // 헤더 높이를 뺀 지점에 도달하면 고정
    if (scrollTop >= anchorInitialTop - headerHeight) {
      if (!anchorWrap.classList.contains('is-fixed')) {
        anchorWrap.classList.add('is-fixed');
        placeholder.style.display = 'block'; // 공간 차지
      }
    } else {
      if (anchorWrap.classList.contains('is-fixed')) {
        anchorWrap.classList.remove('is-fixed');
        placeholder.style.display = 'none'; // 공간 숨김
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}