import { slideUp, slideDown } from './utils';

export function initDropdown() {
  // 1. 토글형 (Dropdown)
  const toggleBtns = document.querySelectorAll('.btn-toggle');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = btn.closest('.dropdown') as HTMLElement;
      if (!dropdown) return;

      if (dropdown.classList.contains('is-active')) {
        closeToggle(dropdown);
      } else {
        closeAllToggles(); // 다른거 닫기
        openToggle(dropdown);
      }
    });
  });

  // 2. 메뉴형 (Dropdowns)
  const menuBtns = document.querySelectorAll('.btn-dropdown');
  menuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapper = btn.closest('.dropdowns') as HTMLElement;
      if(!wrapper) return;

      const body = wrapper.querySelector('.drop-body') as HTMLElement;
      const isActive = wrapper.classList.contains('is-active');

      if(isActive) {
        wrapper.classList.remove('is-active');
        btn.setAttribute('aria-expanded', 'false');
        if(body) body.setAttribute('aria-hidden', 'true');
      } else {
        wrapper.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
        if(body) body.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // 외부 클릭 닫기
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      closeAllToggles();
    }
  });
}

function openToggle(ele: HTMLElement) {
  const btn = ele.querySelector('.btn-toggle');
  const list = ele.querySelector('.drop-list');
  const body = ele.querySelector('.item-body') as HTMLElement;

  ele.classList.add('is-active');
  btn?.setAttribute('aria-expanded', 'true');
  list?.setAttribute('aria-hidden', 'false');
  if(body) slideDown(body, 200);
}

function closeToggle(ele: HTMLElement) {
  const btn = ele.querySelector('.btn-toggle');
  const list = ele.querySelector('.drop-list');
  const body = ele.querySelector('.item-body') as HTMLElement;

  ele.classList.remove('is-active');
  btn?.setAttribute('aria-expanded', 'false');
  list?.setAttribute('aria-hidden', 'true');
  if(body) slideUp(body, 200);
}

function closeAllToggles() {
  document.querySelectorAll('.dropdown.is-active').forEach((ele) => {
    closeToggle(ele as HTMLElement);
  });
}