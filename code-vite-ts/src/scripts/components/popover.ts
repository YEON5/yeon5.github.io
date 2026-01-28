export function initPopover() {
  // 1. Popover Trigger Click (열기/토글)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-popover-trigger]') as HTMLElement;

    if (btn) {
      e.preventDefault();
      e.stopPropagation(); // 이벤트 버블링 중단

      const targetId = btn.getAttribute('aria-controls');
      if (!targetId) return;

      const popover = document.getElementById(targetId);
      if (!popover) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        closePopover(popover);
      } else {
        closeAllPopovers();
        openPopover(btn, popover);
      }
    }
  });

  // 2. Close Button Click (닫기 버튼)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const closeBtn = target.closest('[data-popover-close]') as HTMLElement;

    if (closeBtn) {
      e.preventDefault();
      const popover = closeBtn.closest('.popover-inner') as HTMLElement;
      if (popover) closePopover(popover);
    }
  });

  // 3. Outside Click (외부 영역 클릭 시 닫기)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // 팝오버 내부도 아니고, 트리거 버튼도 아닐 때
    if (!target.closest('.popover-inner') && !target.closest('[data-popover-trigger]')) {
      closeAllPopovers();
    }
  });

  // 4. Scroll Event (스크롤 시 닫기)
  // window 스크롤
  window.addEventListener('scroll', handleScrollClose, { passive: true });
  
  // .container 스크롤 (필요한 경우)
  const container = document.querySelector('.container');
  if (container) {
    container.addEventListener('scroll', handleScrollClose, { passive: true });
  }
}

// 스크롤 핸들러
function handleScrollClose() {
  // 떠있는(visible) 팝오버가 있는지 확인
  const visiblePopovers = document.querySelectorAll('.popover-inner[aria-hidden="false"]');
  if (visiblePopovers.length > 0) {
    closeAllPopovers();
  }
}

// 팝오버 열기
function openPopover(btn: HTMLElement, popover: HTMLElement) {
  const wrapper = btn.closest('.popover') as HTMLElement;

  btn.setAttribute('aria-expanded', 'true');
  if (wrapper) wrapper.classList.add('is-active');
  
  popover.setAttribute('aria-hidden', 'false');
  fadeIn(popover, 300);
}

// 팝오버 닫기
function closePopover(popover: HTMLElement) {
  const id = popover.id;
  // 해당 팝오버를 제어하는 버튼 찾기
  const btn = document.querySelector(`[aria-controls="${id}"]`) as HTMLElement;

  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    const wrapper = btn.closest('.popover') as HTMLElement;
    if (wrapper) wrapper.classList.remove('is-active');
    
    // 닫힌 후 버튼으로 포커스 복귀
    btn.focus();
  }

  popover.setAttribute('aria-hidden', 'true');
  fadeOut(popover, 300);
}

// 모든 팝오버 닫기
function closeAllPopovers() {
  // 현재 열려있는(.popover-inner 중 aria-hidden="false"인 것) 요소를 찾음
  const visiblePopovers = document.querySelectorAll('.popover-inner[aria-hidden="false"]');
  visiblePopovers.forEach((el) => {
    closePopover(el as HTMLElement);
  });
}

// Animatio Utils
function fadeIn(element: HTMLElement, duration: number = 300) {
  element.style.opacity = '0';
  element.style.display = 'block';
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  
  // Reflow를 발생시켜 transition이 적용되도록 함
  element.offsetHeight; 

  element.style.opacity = '1';

  // 애니메이션 종료 후 정리
  setTimeout(() => {
    element.style.removeProperty('transition');
    element.style.removeProperty('opacity');
  }, duration);
}

function fadeOut(element: HTMLElement, duration: number = 300) {
  element.style.opacity = '1';
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  
  // Reflow
  element.offsetHeight; 

  element.style.opacity = '0';

  setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('transition');
    element.style.removeProperty('opacity');
  }, duration);
}