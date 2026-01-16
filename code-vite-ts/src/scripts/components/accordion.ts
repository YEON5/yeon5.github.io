import { slideDown, slideUp } from './utils';

export const initAccordion = () => {
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const header = target.closest('.accordion .item-head');

    if (header) {
      const accordion = header.closest('.accordion') as HTMLElement;
      if (accordion) {
        toggleAccordion(accordion);
      }
    }
  });
};

const toggleAccordion = (accordion: HTMLElement) => {
  const body = accordion.querySelector('.item-body') as HTMLElement;
  const btn = accordion.querySelector('.btn-expand');

  if (!body) return;

  if (accordion.classList.contains('is-active')) {
    accordion.classList.remove('is-active');
    slideUp(body, 350);
    btn?.setAttribute('aria-expanded', 'false');
  } else {
    accordion.classList.add('is-active');
    slideDown(body, 350);
    btn?.setAttribute('aria-expanded', 'true');

    // 개별 동작해야 하는 경우 주석 처리
    // const parent = accordion.parentElement;
    // if (parent && parent.classList.contains('accordion-wrap')) {
    //   const siblings = Array.from(parent.children).filter(
    //     (child) => child !== accordion && child.classList.contains('accordion')
    //   );
    //   siblings.forEach((child) => {
    //     const sibling = child as HTMLElement;
    //     const sibBody = sibling.querySelector('.item-body') as HTMLElement;
    //     const sibBtn = sibling.querySelector('.btn-expand');

    //     if (sibling.classList.contains('is-active')) {
    //       sibling.classList.remove('is-active');
    //       if (sibBody) slideUp(sibBody, 350);
    //       sibBtn?.setAttribute('aria-expanded', 'false');
    //     }
    //   });
    // }
  }
};
