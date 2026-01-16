export const slideUp = (element: HTMLElement, duration: number = 300) => {
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
  setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
  }, duration);
};

export const slideDown = (element: HTMLElement, duration: number = 300) => {
  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;
  if (display === 'none') display = 'block';
  element.style.display = display;
  
  // Get height
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.height = 'auto';
  const targetHeight = element.offsetHeight;
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
  element.style.height = targetHeight + 'px';
  element.style.removeProperty('padding-top');
  element.style.removeProperty('padding-bottom');
  element.style.removeProperty('margin-top');
  element.style.removeProperty('margin-bottom');
  
  setTimeout(() => {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
  }, duration);
};

export const slideToggle = (element: HTMLElement, duration: number = 300) => {
  if (window.getComputedStyle(element).display === 'none') {
    return slideDown(element, duration);
  } else {
    return slideUp(element, duration);
  }
};

export const scrollOn = () => {
    const body = document.body;
    const wrapper = document.querySelector('.wrapper');
    setTimeout(() => {
        body.classList.add('scrollOff');
        wrapper?.setAttribute('aria-hidden', 'true');
    }, 50);
};

export const scrollOff = () => {
    const body = document.body;
    const wrapper = document.querySelector('.wrapper');
    setTimeout(() => {
        body.classList.remove('scrollOff');
        wrapper?.removeAttribute('aria-hidden');
    }, 50);
};