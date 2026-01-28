// 팝업을 연 버튼(Opener)을 저장하기 위한 WeakMap
const popupOpenerMap = new WeakMap<HTMLElement, HTMLElement>();

// 스크롤 위치 저장 변수
let savedScrollTop = 0;

export function initPopup() {
  // 1. Popup Trigger (열기)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-popup-trigger]') as HTMLElement;

    if (btn) {
      e.preventDefault();
      const targetId = btn.dataset.popupTrigger;
      if (targetId) popupOpen(targetId, btn);
    }
  });

  // 2. External Popup Load (동적 로드)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-popup-load]') as HTMLElement;

    if (btn) {
      e.preventDefault();
      const url = btn.dataset.popupLoad;
      if (url) loadExternalPopup(url, btn);
    }
  });

  // 3. Popup Close (닫기 버튼)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-popup-close]') as HTMLElement;

    if (btn) {
      e.preventDefault();
      const popWrap = btn.closest('.popup-wrap') as HTMLElement;
      if (popWrap) popupClose(popWrap.id);
    }
  });

  // 4. Dimmed Click Close (배경 클릭 시 닫기)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('popup-wrap')) {
      popupClose(target.id);
    }
  });

  // 5. Keyboard Events (ESC & Tab)
  document.addEventListener('keydown', (e) => {
    const activePopups = document.querySelectorAll('.popup-wrap.is-active');
    if (activePopups.length === 0) return;

    const topPopup = activePopups[activePopups.length - 1] as HTMLElement;

    if (e.key === 'Escape' || e.key === 'Esc') {
      popupClose(topPopup.id);
      return;
    }

    if (e.key === 'Tab') {
      handleFocusTrap(e, topPopup);
    }
  });
}

// =================================================================
// Core Functions
// =================================================================

export function popupOpen(id: string, opener: HTMLElement | null = null) {
  const popWrap = document.getElementById(id);
  if (!popWrap) return;

  const trigger = opener || (document.activeElement as HTMLElement);
  if (trigger) {
    popupOpenerMap.set(popWrap, trigger);
  }

  popWrap.classList.add('is-active');
  popWrap.setAttribute('aria-hidden', 'false');

  const baseZIndex = 1002;
  const activeCount = document.querySelectorAll('.popup-wrap.is-active').length;
  popWrap.style.zIndex = (baseZIndex + activeCount).toString();

  // 첫 번째 팝업일 때만 스크롤 잠금 실행
  if (activeCount === 1) {
    lockScroll();
  }

  setTimeout(() => {
    const popupInner = popWrap.querySelector('.popup') as HTMLElement;
    if (popupInner) {
      popupInner.setAttribute('tabindex', '-1');
      popupInner.focus();
    }
  }, 50);
}

export function popupClose(id: string) {
  const popWrap = document.getElementById(id);
  if (!popWrap) return;

  popWrap.classList.remove('is-active');
  popWrap.setAttribute('aria-hidden', 'true');
  popWrap.style.removeProperty('z-index');

  const activeCount = document.querySelectorAll('.popup-wrap.is-active').length;
  
  // 남은 팝업이 없을 때만 스크롤 잠금 해제
  if (activeCount === 0) {
    unlockScroll();
  }

  const opener = popupOpenerMap.get(popWrap);
  if (opener && document.body.contains(opener)) {
    opener.focus();
  }
  popupOpenerMap.delete(popWrap);

  if (popWrap.dataset.dynamic === 'true') {
    setTimeout(() => {
      popWrap.remove();
    }, 300);
  }
}

function loadExternalPopup(url: string, btn: HTMLElement) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const popupEl = doc.querySelector('.popup-wrap') || doc.body.firstElementChild;
      
      if (popupEl instanceof HTMLElement) {
        popupEl.setAttribute('data-dynamic', 'true');
        document.body.appendChild(popupEl);

        const targetId = popupEl.id;
        setTimeout(() => {
          popupOpen(targetId, btn);
        }, 50);
      }
    })
    .catch(error => {
      console.error('Popup Load Error:', error);
      alert('팝업을 불러오는데 실패했습니다.');
    });
}

function handleFocusTrap(e: KeyboardEvent, popWrap: HTMLElement) {
  const focusableEls = popWrap.querySelectorAll<HTMLElement>(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
  );

  if (focusableEls.length === 0) return;

  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];
  const activeEl = document.activeElement as HTMLElement;

  if (e.shiftKey) {
    if (activeEl === firstEl || activeEl === popWrap.querySelector('.popup')) {
      e.preventDefault();
      lastEl.focus();
    }
  } else {
    if (activeEl === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }
}

// =================================================================
// Scroll Control (Fix applied)
// =================================================================

function lockScroll() {
  const body = document.body;
  const wrapper = document.querySelector('.wrapper');

  // 현재 위치 저장
  savedScrollTop = window.scrollY || document.documentElement.scrollTop;

  // body 고정 및 위치 조정
  body.style.top = `-${savedScrollTop}px`;
  body.classList.add('scrollOff');

  if (wrapper) wrapper.setAttribute('aria-hidden', 'true');
}

function unlockScroll() {
  const body = document.body;
  const html = document.documentElement;
  const wrapper = document.querySelector('.wrapper');

  // 1. 애니메이션/부드러운 스크롤 강제 종료 (중요)
  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';
  body.style.transition = 'none'; // 혹시 모를 transition 제거

  // 2. 스타일 초기화
  body.classList.remove('scrollOff');
  body.style.removeProperty('top');
  body.style.removeProperty('padding-right');

  // 3. 저장했던 위치로 즉시 이동
  window.scrollTo(0, savedScrollTop);

  // 접근성 해제
  if (wrapper) wrapper.removeAttribute('aria-hidden');

  // 4. 속성 복구 (지연 실행)
  setTimeout(() => {
    html.style.removeProperty('scroll-behavior');
    body.style.removeProperty('scroll-behavior');
    body.style.removeProperty('transition'); // transition 복구
  }, 10);
}