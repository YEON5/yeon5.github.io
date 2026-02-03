export function initSticky() {
  handleScrollTop();

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
