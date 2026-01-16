/**
 * Scroll Functionality
 * Ported from ui.pub.js (jQuery) to Vanilla TypeScript
 */

export class ScrollManager {
  private lastScrollTop: number = 0;
  private scrollEndTime: number | null = null;
  private resizeEndTime: number | null = null;
  private isScrolled: boolean = false;

  constructor() {
    this.init();
  }

  public init(): void {
    this.initScrollEvent();
    this.initScrollAction();
    this.initSticky();
    this.initScrollProgress();
    this.initScrollAnimation();
  }

  /**
   * Scroll Event: Scroll Up/Down Custom Event & Status Classes
   * Corresponds to scrollEvent()
   */
  private initScrollEvent(): void {
    let scrTop = window.scrollY;
    
    const scrPosition = (val: number) => {
      // Scroll First
      if (val === 0) {
        document.body.classList.add('is-scrollFirst');
      } else {
        document.body.classList.remove('is-scrollFirst');
      }

      // Scroll Last
      if ((window.innerHeight + Math.ceil(val)) >= document.body.offsetHeight) {
        document.body.classList.add('is-scrollLast');
      } else {
        document.body.classList.remove('is-scrollLast');
      }
    };

    // Initial check
    scrPosition(scrTop);

    window.addEventListener('scroll', () => {
      const curScrTop = window.scrollY;

      // Scroll Direction
      if (this.lastScrollTop > curScrTop) {
        window.dispatchEvent(new CustomEvent('scrollUp'));
        document.body.classList.add('is-scrollUp');
        document.body.classList.remove('is-scrollDown');
      } else if (this.lastScrollTop < curScrTop) {
        window.dispatchEvent(new CustomEvent('scrollDown'));
        document.body.classList.add('is-scrollDown');
        document.body.classList.remove('is-scrollUp');
      }
      this.lastScrollTop = curScrTop;

      // Scroll End Detection
      if (this.scrollEndTime) clearTimeout(this.scrollEndTime);
      this.scrollEndTime = window.setTimeout(() => {
        this.isScrolled = false;
        window.dispatchEvent(new CustomEvent('scrollEnd'));
      }, 100);

      scrPosition(curScrTop);
    });

    // Resize End Detection
    window.addEventListener('resize', () => {
      if (this.resizeEndTime) clearTimeout(this.resizeEndTime);
      this.resizeEndTime = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('resizeEnd'));
      }, 100);
    });
  }

  /**
   * Scroll Action
   * Corresponds to scrollAction()
   */
  private initScrollAction(): void {
    const btnScrollTop = document.querySelector('.btn-scrollTop');
    
    // Toggle Scroll Top Button
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        btnScrollTop?.classList.add('is-active');
      } else {
        btnScrollTop?.classList.remove('is-active');
      }
    });

    // Scroll to Top Click
    btnScrollTop?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // GNB Anchor Links
    const gnbLinks = document.querySelectorAll('.header .gnb .node1 > a');
    gnbLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href) as HTMLElement;
          if (target) {
            const scrollPosTop = target.offsetTop - 150;
            window.scrollTo({
              top: scrollPosTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Header border on scroll
    const header = document.querySelector('.header');
    const stepWrap = document.getElementById('stepWrap');

    if (stepWrap && header) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < 100 && !header.classList.contains('bor-none')) {
          header.classList.add('bor-none');
        } else if (scrollY >= 100 && header.classList.contains('bor-none')) {
          header.classList.remove('bor-none');
        }
      });
    }
  }

  /**
   * Sticky Header / LNB
   * Corresponds to stickyInit()
   */
  private initSticky(): void {
    const header = document.querySelector('.header');
    const lnb = document.querySelector('.lnb') as HTMLElement;
    let lnbPos = lnb ? lnb.offsetTop : 0;

    const handleSticky = () => {
      const scrTop = window.scrollY;

      // Header Fixed
      if (header) {
        if (scrTop > 0 && !header.classList.contains('fixed')) {
          header.classList.add('fixed');
        } else if (scrTop === 0 && header.classList.contains('fixed')) {
          header.classList.remove('fixed');
        }
      }

      // LNB Fixed
      if (lnb) {
        // Recalculate lnbPos if needed or keep static? 
        // Original code sets lnbPos once.
        if (lnbPos <= scrTop) {
          lnb.classList.add('fixed');
        } else {
          lnb.classList.remove('fixed');
        }
      }
    };

    window.addEventListener('scroll', handleSticky);
    handleSticky(); // Initial check
  }

  /**
   * Header Scroll Percent (Reading Progress)
   * Corresponds to headerPercent()
   */
  private initScrollProgress(): void {
    const headerLine = document.querySelector('.header-line') as HTMLElement;
    if (!headerLine) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (100 * scrollTop) / (docHeight - winHeight);
      
      headerLine.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }

  /**
   * Scroll Animation
   * Corresponds to scrollAnimated()
   */
  private initScrollAnimation(): void {
    const animateSections = document.querySelectorAll('.ui-animate');
    const clsAnimate = 'animated';
    const percent = 0.3;
    let time: number | null = null;
    let winHOld = -1;
    let direction: 'up' | 'down' = 'down';

    const action = () => {
      const winH = window.scrollY + window.innerHeight;
      const winH2 = window.scrollY;

      if (winHOld > winH2) direction = 'up';
      if (winHOld < winH2) direction = 'down';
      winHOld = winH2;

      animateSections.forEach((section) => {
        const el = section as HTMLElement;
        const objH = el.offsetTop + (el.offsetHeight * percent);
        // const objH2 = el.offsetTop;

        // Trigger when scrolling down and passing the threshold
        if (winH > objH && direction === 'down') {
          const animateType = el.getAttribute('data-animate');
          el.classList.add(clsAnimate);
          if (animateType) el.classList.add(animateType);

          const children = el.querySelectorAll('.to-animate');
          children.forEach((child) => {
            const childEl = child as HTMLElement;
            childEl.classList.add(clsAnimate);
            
            const duration = childEl.getAttribute('data-duration');
            if (duration) childEl.classList.add(duration);
            
            const childAnimate = childEl.getAttribute('data-animate');
            if (childAnimate) childEl.classList.add(childAnimate);
          });
        }
      });
    };

    window.addEventListener('scroll', () => {
      if (time) clearTimeout(time);
      time = window.setTimeout(action, 50); // Debounce slightly
    });
    
    // Initial check
    action();
  }
}