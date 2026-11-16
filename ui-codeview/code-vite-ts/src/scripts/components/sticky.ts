export function initSticky() {
  initStickyPadding();
  handleScrollTop();
}

// 하단 sticky button 높이 계산
export function initStickyPadding() {
    const $stickyBtn = document.querySelector('.btn-wrap.btn-sticky') as HTMLElement;
    const $content = document.querySelector('.content') as HTMLElement;

    // 요소가 없으면 실행 중지
    if (!$stickyBtn || !$content) return;

    // 높이 감지 및 CSS 변수 세팅 함수
    const setPadding = () => {
        const height = $stickyBtn.offsetHeight;
        // content 요소에 CSS 변수(--sticky-height) 주입
        $content.style.setProperty('--sticky-height', `${height}px`);
    };

    // 초기 실행
    setPadding();

    // 리사이즈 감지 (텍스트 줄바꿈 등으로 버튼 높이 변할 때 대응)
    const observer = new ResizeObserver(() => {
        setPadding();
    });

    observer.observe($stickyBtn);
}


// Scroll Top Button (맨 위로 가기)
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
