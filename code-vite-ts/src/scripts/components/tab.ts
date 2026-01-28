export function initTab() {
  const tabButtons = document.querySelectorAll('[class^="tab"] .tab-nav button');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      const li = target.parentElement as HTMLElement;
      
      if (li.classList.contains('is-active')) return;

      const targetId = target.getAttribute('aria-controls');
      if (!targetId) return;
      
      const tabBody = target.closest('.tab, .tab-round')?.querySelector('.tab-body');
      const targetPanel = document.getElementById(targetId);

      if (!tabBody || !targetPanel) return;

      // 1. Tab Nav 활성화
      const siblingsLi = Array.from(li.parentElement?.children || []);
      siblingsLi.forEach((sib) => {
        sib.classList.remove('is-active');
        sib.querySelector('button')?.setAttribute('aria-selected', 'false');
      });

      li.classList.add('is-active');
      target.setAttribute('aria-selected', 'true');

      // 2. Tab Content 활성화
      const siblingsPanel = Array.from(tabBody.children);
      siblingsPanel.forEach((panel) => {
        panel.classList.remove('is-active');
        panel.setAttribute('aria-hidden', 'true');
      });

      targetPanel.classList.add('is-active');
      targetPanel.setAttribute('aria-hidden', 'false');

      // 3. 스크롤 보정
      moveScrollToLeft(li);
      scrollCorrection(target);
    });
  });
}

// 탭 버튼 좌측 정렬 (가로 스크롤 시)
function moveScrollToLeft(targetLi: HTMLElement) {
  const ul = targetLi.parentElement;
  if (!ul) return;

  const offset = 20;
  const newScrollPos = ul.scrollLeft + targetLi.offsetLeft - offset;

  ul.scrollTo({
    left: newScrollPos,
    behavior: 'smooth'
  });
}

// 탭 전환 시 화면 스크롤 보정 (Sticky 대응)
function scrollCorrection(btn: HTMLElement) {
  const tabNav = btn.closest('.tab-nav') as HTMLElement;
  const tabWrap = btn.closest('.tab') as HTMLElement;

  if (!tabNav || !tabWrap) return;

  const contentStartTop = tabWrap.getBoundingClientRect().top + window.scrollY;
  const styleTop = getComputedStyle(tabNav).top;
  const cssTop = styleTop === 'auto' ? 0 : parseFloat(styleTop);
  const navHeight = tabNav.offsetHeight;

  const targetScroll = contentStartTop - cssTop - navHeight;
  const currentScroll = window.scrollY;

  if (currentScroll > targetScroll + 5) {
    window.scrollTo({
      top: targetScroll,
      behavior: 'auto' // 즉시 이동
    });
  }
}