export function initAnchor() {
  const anchorWrap = document.querySelector<HTMLElement>('.anchor-wrap');
  if (!anchorWrap) return;

  const ul = anchorWrap.querySelector<HTMLElement>('.anchor-nav > ul');
  if (!ul) return;

  const triggers = ul.querySelectorAll<HTMLElement>('a, button');
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const rawId = trigger.getAttribute('href') || trigger.getAttribute('data-target');
      
      const isAnchor =
        rawId &&
        rawId.startsWith('#') &&
        rawId.length > 1 &&
        rawId !== '#!';

      if (isAnchor) {
        const targetId = rawId.substring(1);
        const section = document.getElementById(targetId);

        if (section) {
          e.preventDefault();
          const offset = getScrollOffset(anchorWrap);
          const y = section.getBoundingClientRect().top + window.scrollY - offset + 1;
          smoothScrollTo(y, 500);
        }
      }

      updateActive(trigger, ul);
      alignLeft(trigger, ul);
    });
  });

  // 앵커 fixed 고정 필요시에 호출
  // initStickyAnchor();
}

// ----------------------------------------------------------------
// Sticky Anchor (스크롤 도달 시 Fixed)
// ----------------------------------------------------------------
export function initStickyAnchor() {
  const anchorWrap = document.querySelector<HTMLElement>('.anchor-wrap');
  if (!anchorWrap) return;

  const header = document.querySelector<HTMLElement>('.header');
  
  // 1. Placeholder 생성 (레이아웃 덜컹거림 방지용)
  // 평소에는 숨겨져 있다가 fixed 될 때만 나타납니다.
  let placeholder = document.querySelector<HTMLElement>('.anchor-placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.className = 'anchor-placeholder';
    placeholder.style.display = 'none'; // 초기엔 숨김
    placeholder.style.width = '100%';
    anchorWrap.insertAdjacentElement('afterend', placeholder);
  }

  // 위치 계산 변수
  let anchorInitialTop = 0;
  let headerHeight = 0;

  // 2. 위치 및 크기 계산 함수
  const calcDimensions = () => {
    // 정확한 위치 계산을 위해 잠시 fixed 해제
    const wasFixed = anchorWrap.classList.contains('is-fixed');
    if (wasFixed) {
      anchorWrap.classList.remove('is-fixed');
      anchorWrap.style.removeProperty('top');
      if (placeholder) placeholder.style.display = 'none';
    }

    // 헤더 및 앵커 위치 재계산
    headerHeight = header ? header.offsetHeight : 0;
    const rect = anchorWrap.getBoundingClientRect();
    anchorInitialTop = rect.top + window.scrollY;

    // Placeholder 높이 동기화
    if (placeholder) {
      placeholder.style.height = `${anchorWrap.offsetHeight}px`;
    }

    // 상태 복구 (스크롤 위치에 따라 다시 판단)
    if (wasFixed) handleScroll();
  };

  // 3. 스크롤 핸들러
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const triggerPoint = anchorInitialTop - headerHeight;

    if (scrollTop >= triggerPoint) {
      // [고정 조건 달성]
      if (!anchorWrap.classList.contains('is-fixed')) {
        anchorWrap.classList.add('is-fixed');
        anchorWrap.style.top = `${headerHeight}px`;
        
        // Fixed로 붕 뜬 자리를 Placeholder가 채움 (덜컹거림 방지)
        if (placeholder) placeholder.style.display = 'block';
      }
    } else {
      // [고정 해제]
      if (anchorWrap.classList.contains('is-fixed')) {
        anchorWrap.classList.remove('is-fixed');
        anchorWrap.style.removeProperty('top');
        
        // 다시 원래대로 돌아왔으므로 Placeholder 숨김
        if (placeholder) placeholder.style.display = 'none';
      }
    }
  };

  // 4. 초기화 및 이벤트 등록
  calcDimensions();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    calcDimensions();
    handleScroll();
  });
}

// ----------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------
function updateActive(target: HTMLElement, ul: HTMLElement) {
  const triggers = ul.querySelectorAll<HTMLElement>('a, button');
  triggers.forEach((el) => {
    el.classList.remove('is-active');
    el.removeAttribute('aria-current');
  });

  target.classList.add('is-active');
  target.setAttribute('aria-current', 'location');
}

function alignLeft(target: HTMLElement, ul: HTMLElement) {
  const li = target.closest('li');
  if (!li) return;

  const currentScroll = ul.scrollLeft;
  const liRect = li.getBoundingClientRect();
  const ulRect = ul.getBoundingClientRect();
  
  const ulStyle = window.getComputedStyle(ul);
  const ulPaddingLeft = parseInt(ulStyle.paddingLeft, 10) || 0;

  const targetLeft = currentScroll + (liRect.left - ulRect.left) - ulPaddingLeft;

  ul.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: 'smooth',
  });
}

function getScrollOffset(anchorWrap: HTMLElement): number {
  const header = document.querySelector<HTMLElement>('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const anchorHeight = anchorWrap.offsetHeight || 0;

  return headerHeight + anchorHeight;
}

function smoothScrollTo(targetY: number, duration = 500) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start: number | null = null;

  const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const step = (time: number) => {
    if (!start) start = time;
    const progress = Math.min((time - start) / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
    else window.scrollTo(0, targetY);
  };

  requestAnimationFrame(step);
}