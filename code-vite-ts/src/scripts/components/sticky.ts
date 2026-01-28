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
  const header = document.querySelector('.header') as HTMLElement;
  
  if (!anchorWrap) return;

  // [중요] Placeholder 생성 (Fixed 전환 시 빈 공간 채우기용)
  // 이것이 없으면 스크롤이 튑니다.
  const placeholder = document.createElement('div');
  placeholder.style.width = '100%';
  placeholder.style.display = 'none'; // 평소엔 숨김
  // 높이는 calcDimensions에서 설정
  
  // DOM 삽입
  anchorWrap.insertAdjacentElement('afterend', placeholder);

  let anchorInitialTop = 0;
  let headerHeight = 0;

  // 치수 계산 함수
  const calcDimensions = () => {
    // 정확한 계산을 위해 잠시 스타일 초기화
    const wasFixed = anchorWrap.classList.contains('is-fixed');
    if (wasFixed) {
      anchorWrap.classList.remove('is-fixed');
      anchorWrap.style.removeProperty('top');
      placeholder.style.display = 'none';
    }

    headerHeight = header ? header.offsetHeight : 0;
    
    // 현재 앵커의 위치 계산
    const rect = anchorWrap.getBoundingClientRect();
    anchorInitialTop = rect.top + window.scrollY;

    // placeholder 높이 동기화
    placeholder.style.height = `${anchorWrap.offsetHeight}px`;

    // 상태 복구
    if (wasFixed) handleScroll(); 
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    
    // [핵심] 스크롤이 (앵커 위치 - 헤더 높이) 보다 내려갔을 때
    if (scrollTop >= anchorInitialTop - headerHeight) {
      if (!anchorWrap.classList.contains('is-fixed')) {
        anchorWrap.classList.add('is-fixed');
        anchorWrap.style.top = `${headerHeight}px`; // 헤더 바로 아래 붙임
        placeholder.style.display = 'block'; // [중요] 빈 공간 차지하여 덜컹거림 방지
      }
    } else {
      if (anchorWrap.classList.contains('is-fixed')) {
        anchorWrap.classList.remove('is-fixed');
        anchorWrap.style.removeProperty('top');
        placeholder.style.display = 'none'; // [중요] 공간 제거
      }
    }
  };

  // 초기화
  calcDimensions();
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    calcDimensions();
    handleScroll();
  });
}