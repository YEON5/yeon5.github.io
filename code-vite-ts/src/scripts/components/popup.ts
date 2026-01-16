import { scrollOn, scrollOff } from './utils';

declare global {
  interface Window {
    popupOpen: (id: string, focus?: HTMLElement) => void;
    popupClose: (id: string) => void;
  }
}

let activeFocus: HTMLElement | null = null;

export const initPopup = () => {
  // Track focus for accessibility return
  document.addEventListener('focusin', (e) => {
    activeFocus = e.target as HTMLElement;
  });

  // Expose to window for legacy onclick support
  window.popupOpen = popupOpen;
  window.popupClose = popupClose;

  // Initialize Toast Popups if any
  initToastPopup();
};

export const popupOpen = (id: string, focus?: HTMLElement) => {
  const popWrap = document.getElementById(id);
  if (!popWrap) return;

  const focusTarget = popWrap.querySelector('.popup') as HTMLElement;
  // Use a safer way to find the last button or focusable element
  const focusable = popWrap.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const lastFocus = focusable.length > 0 ? (focusable[focusable.length - 1] as HTMLElement) : null;

  // Store opener
  (popWrap as any)._opener = activeFocus;

  popWrap.classList.add('is-active');
  popWrap.setAttribute('aria-hidden', 'false');

  // Event listener for transition end to set focus
  const onTransitionEnd = () => {
      if (popWrap.classList.contains('is-active')) {
          focusTarget?.setAttribute('tabindex', '0');
          focusTarget?.focus();

          // Add focus guard if not exists
          if (lastFocus && !popWrap.querySelector('.popup-focus')) {
              const guard = document.createElement('div');
              guard.className = 'popup-focus';
              guard.tabIndex = 0;
              lastFocus.after(guard);
              guard.addEventListener('focusin', () => {
                  focusTarget?.focus();
              });
          }
      }
      popWrap.removeEventListener('transitionend', onTransitionEnd);
  };
  popWrap.addEventListener('transitionend', onTransitionEnd);
  
  // Fallback if no transition
  setTimeout(() => {
     if (window.getComputedStyle(popWrap).transitionDuration === '0s') {
         onTransitionEnd();
     }
  }, 50);

  scrollOn();
  changeZindex(id);
};

export const popupClose = (id: string) => {
  const popWrap = document.getElementById(id);
  if (!popWrap) return;

  const opener = (popWrap as any)._opener as HTMLElement;

  // Remove focus guard
  const guard = popWrap.querySelector('.popup-focus');
  if (guard) guard.remove();

  popWrap.classList.remove('is-active');
  popWrap.setAttribute('aria-hidden', 'true');
  popWrap.style.removeProperty('z-index');

  const onTransitionEnd = () => {
      if (!popWrap.classList.contains('is-active')) {
          if (opener && document.body.contains(opener)) {
              opener.focus();
          }
      }
      popWrap.removeEventListener('transitionend', onTransitionEnd);
  };
  popWrap.addEventListener('transitionend', onTransitionEnd);
  
  // Fallback
  setTimeout(() => {
    if (window.getComputedStyle(popWrap).transitionDuration === '0s') {
        onTransitionEnd();
    }
 }, 50);

  scrollOff();
};

const changeZindex = (id: string) => {
  const popWrap = document.getElementById(id);
  if (!popWrap) return;

  const activePopups = document.querySelectorAll('.popup-wrap.is-active').length;
  const baseZIndex = 1002;
  const currentZ = baseZIndex + activePopups;
  popWrap.style.zIndex = currentZ.toString();
};

/*-------------------------------------------------------------------
    ## Toast Alert Popup
-------------------------------------------------------------------*/
const initToastPopup = () => {
    const toastBtns = document.querySelectorAll('.btn-toast');
    toastBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const id = target.getAttribute('data-id');
            if (!id) return;
            
            const toast = document.getElementById(id);
            if (!toast) return;
            
            const textEl = toast.querySelector('p');

            if (!target.classList.contains('is-active')) {
                target.classList.add('is-active');
                target.setAttribute('title', '저장함');
                if (textEl) textEl.textContent = '저장되었습니다.';
            } else {
                target.classList.remove('is-active');
                target.setAttribute('title', '');
                if (textEl) textEl.textContent = '취소되었습니다.';
            }
            
            toastAction(toast);
        });
    });
};

const toastAction = (target: HTMLElement, speed: number = 500, duration: number = 1000) => {
    // fadeIn
    target.style.display = 'block';
    target.style.opacity = '0';
    target.style.transition = `opacity ${speed}ms`;
    
    // Trigger reflow
    target.offsetHeight;
    target.style.opacity = '1';
    
    setTimeout(() => {
        // fadeOut
        target.style.opacity = '0';
        setTimeout(() => {
             target.style.display = 'none';
        }, speed);
    }, duration + speed);
};
