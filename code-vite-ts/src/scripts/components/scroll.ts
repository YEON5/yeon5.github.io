export default function scrollEvent(): void {
  let oldScrTop: number = window.scrollY;
  let scrollEndTime: number | undefined;
  let resizeEndTime: number | undefined;

  const scrPosition = (val: number): void => {
    // Scroll First Check
    if (val <= 0) {
      document.body.classList.add('is-scrollFirst');
    } else {
      document.body.classList.remove('is-scrollFirst');
    }

    // Scroll Last Check
    // Using Math.ceil to handle potential sub-pixel rendering differences
    if (Math.ceil(val + window.innerHeight) >= document.documentElement.scrollHeight) {
      document.body.classList.add('is-scrollLast');
    } else {
      document.body.classList.remove('is-scrollLast');
    }
  };

  const onScroll = (): void => {
    const curScrTop: number = window.scrollY;

    // Scroll Direction
    if (oldScrTop < curScrTop) {
      // Down
      window.dispatchEvent(new CustomEvent('scrollDown'));
      document.body.classList.add('is-scrollDown');
      document.body.classList.remove('is-scrollUp');
    } else if (oldScrTop > curScrTop) {
      // Up
      window.dispatchEvent(new CustomEvent('scrollUp'));
      document.body.classList.add('is-scrollUp');
      document.body.classList.remove('is-scrollDown');
    }
    oldScrTop = curScrTop;

    // Scroll Position (First/Last)
    scrPosition(curScrTop);

    // Scroll End Debounce
    if (scrollEndTime) {
      clearTimeout(scrollEndTime);
    }
    scrollEndTime = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('scrollEnd'));
    }, 100);
  };

  const onResize = (): void => {
    if (resizeEndTime) {
      clearTimeout(resizeEndTime);
    }
    resizeEndTime = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('resizeEnd'));
    }, 100);
  };

  // Remove existing listeners if any
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);

  // Add listeners
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);
}