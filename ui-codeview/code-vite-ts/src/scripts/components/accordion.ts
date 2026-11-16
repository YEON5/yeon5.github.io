import { slideUp, slideDown } from './utils';

export function initAccordion() {
  const handleAccordion = (e: Event) => {
    const btn = e.currentTarget as HTMLElement;
    const item = btn.closest('.accordion') as HTMLElement;
    const wrapper = btn.closest('.accordion-wrap, .inner-accordion') as HTMLElement;

    if (!item || !wrapper) return;

    e.preventDefault();
    e.stopPropagation();

    // 단일 오픈 모드 확인
    const isSingleOpen = wrapper.dataset.accordion === 'single';
    const isActive = item.classList.contains('is-active');

    if (isActive) {
      closeItem(item);
    } else {
      if (isSingleOpen) {
        // 형제 요소 중 열린 것 닫기
        const siblings = Array.from(wrapper.children).filter(
          (child) => child !== item && child.classList.contains('accordion') && child.classList.contains('is-active')
        ) as HTMLElement[];
        
        siblings.forEach((sibling) => closeItem(sibling));
      }
      openItem(item);
    }
  };

  // 이벤트 바인딩 (동적 요소 대응을 위해 상위 위임 권장하나, 여기선 직관적으로 작성)
  const buttons = document.querySelectorAll('.btn-expand');
  buttons.forEach((btn) => {
    btn.removeEventListener('click', handleAccordion); // 중복 방지
    btn.addEventListener('click', handleAccordion);
  });
}

function openItem(item: HTMLElement) {
  const btn = item.querySelector('.btn-expand') as HTMLElement;
  const body = item.querySelector('.item-body') as HTMLElement;

  if (btn && body) {
    item.classList.add('is-active');
    btn.setAttribute('aria-expanded', 'true');
    slideDown(body, 350);
  }
}

function closeItem(item: HTMLElement) {
  const btn = item.querySelector('.btn-expand') as HTMLElement;
  const body = item.querySelector('.item-body') as HTMLElement;

  if (btn && body) {
    item.classList.remove('is-active');
    btn.setAttribute('aria-expanded', 'false');
    slideUp(body, 350);
  }
}