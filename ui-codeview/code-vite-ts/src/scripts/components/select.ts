export function initSelect() {
  const MOBILE_BREAKPOINT = 768;

  // Trigger Click
  const triggers = document.querySelectorAll('[data-select-trigger]');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const btn = e.currentTarget as HTMLElement;
      const box = btn.closest('[data-select]') as HTMLElement;
      
      // 다른 활성화된 셀렉트 닫기
      document.querySelectorAll('[data-select].is-active').forEach((other) => {
        if(other !== box) closeSelect(other as HTMLElement);
      });

      if (box.classList.contains('is-active')) {
        closeSelect(box);
      } else {
        openSelect(box);
      }
    });
  });

  // Option Click
  const options = document.querySelectorAll('.select-layer .option');
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      const btn = e.currentTarget as HTMLElement;
      const box = btn.closest('[data-select]') as HTMLElement;
      const trigger = box.querySelector('[data-select-trigger]') as HTMLElement;
      const textTarget = box.querySelector('.select-value') as HTMLElement;
      const hiddenInput = box.querySelector('.select-hidden-input') as HTMLInputElement;

      const showText = btn.textContent || '';
      const realValue = btn.dataset.value || '';

      // 값 업데이트
      if(textTarget) {
        textTarget.textContent = showText;
        textTarget.classList.add('is-selected');
      }
      
      if(hiddenInput) {
        hiddenInput.value = realValue;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 활성 상태 업데이트
      const list = btn.closest('.select-list');
      list?.querySelectorAll('.option').forEach(o => {
        o.classList.remove('current');
        o.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('current');
      btn.setAttribute('aria-selected', 'true');

      closeSelect(box);
      trigger?.focus();
    });
  });

  // Close Button
  document.querySelectorAll('[data-select-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const box = target.closest('[data-select]') as HTMLElement;
      closeSelect(box);
      (box.querySelector('[data-select-trigger]') as HTMLElement)?.focus();
    });
  });

  // 외부 클릭 닫기
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if(!target.closest('[data-select]')) {
      document.querySelectorAll('[data-select].is-active').forEach(box => closeSelect(box as HTMLElement));
    }
  });

  // =========================================================================
  // 접근성 (Focus Trap & ESC)
  // =========================================================================
  document.addEventListener('keydown', (e) => {
    const openBox = document.querySelector('[data-select].is-active') as HTMLElement;
    
    // 열린 셀렉트 박스가 없으면 무시
    if (!openBox) return;

    // 1. ESC 키 누르면 닫기
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeSelect(openBox);
        (openBox.querySelector('[data-select-trigger]') as HTMLElement)?.focus();
        return;
    }

    // Tab 키 포커스 가두기 (모바일에서만 동작)
    if (window.innerWidth <= MOBILE_BREAKPOINT && e.key === 'Tab') {
        const layer = openBox.querySelector('.select-layer') as HTMLElement;
        // 레이어 내부의 포커스 가능한 요소들 찾기
        const focusableEls = layer.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        
        if (focusableEls.length === 0) return;

        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        const activeEl = document.activeElement as HTMLElement;

        if (e.shiftKey) {
            // Shift + Tab: 첫 번째 요소나 레이어 자체에서 뒤로 갈 때 -> 마지막 요소로 이동
            if (activeEl === firstEl || activeEl === layer) {
                e.preventDefault();
                lastEl.focus();
            }
        } else {
            // Tab: 마지막 요소에서 앞으로 갈 때 -> 첫 번째 요소로 이동
            if (activeEl === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        }
    }
  });

  function openSelect(box: HTMLElement) {
    box.classList.add('is-active');
    box.querySelector('[data-select-trigger]')?.setAttribute('aria-expanded', 'true');

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            // 레이어에 포커스를 주어 스크린 리더가 인식하게 함
            const layer = box.querySelector('.select-layer') as HTMLElement;
            if (layer) layer.focus();
        }, 350);
    }
  }

  function closeSelect(box: HTMLElement) {
    box.classList.remove('is-active');
    box.querySelector('[data-select-trigger]')?.setAttribute('aria-expanded', 'false');
    document.body.style.removeProperty('overflow');
  }
}