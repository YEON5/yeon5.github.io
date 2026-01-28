// 슬라이드 애니메이션 중복 실행 방지를 위해 타이머 ID를 저장할 타입 정의
interface SlideElement extends HTMLElement {
  _slideTimer?: number;
}

// =================================================================
// Slide Animation Utils (Accordion, Dropdown 등에서 사용)
// =================================================================

export const slideUp = (element: SlideElement, duration: number = 300) => {
  // 기존 타이머가 있다면 취소 (광클 방지)
  if (element._slideTimer) clearTimeout(element._slideTimer);

  element.style.height = element.offsetHeight + 'px';
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  element.offsetHeight; // trigger reflow
  element.style.overflow = 'hidden';

  element.style.height = '0';
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';

  element._slideTimer = window.setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
    element._slideTimer = undefined;
  }, duration);
};

export const slideDown = (element: SlideElement, duration: number = 300) => {
  // 기존 타이머가 있다면 취소 (광클 방지)
  if (element._slideTimer) clearTimeout(element._slideTimer);

  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;
  if (display === 'none') display = 'block'; // flex나 grid 등 상황에 맞춰 조정 가능
  element.style.display = display;

  // Get target height
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.height = 'auto';
  const targetHeight = element.offsetHeight;
  
  // Reset styles for animation start
  element.style.position = '';
  element.style.visibility = '';
  element.style.overflow = 'hidden';
  element.style.height = '0';
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';
  
  element.offsetHeight; // trigger reflow

  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  
  // Animate to target
  element.style.height = targetHeight + 'px';
  element.style.removeProperty('padding-top');
  element.style.removeProperty('padding-bottom');
  element.style.removeProperty('margin-top');
  element.style.removeProperty('margin-bottom');

  element._slideTimer = window.setTimeout(() => {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
    element._slideTimer = undefined;
  }, duration);
};

export const slideToggle = (element: HTMLElement, duration: number = 300) => {
  if (window.getComputedStyle(element).display === 'none') {
    return slideDown(element, duration);
  } else {
    return slideUp(element, duration);
  }
};