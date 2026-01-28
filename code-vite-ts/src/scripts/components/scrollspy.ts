export function initScrollSpy() {
  const anchorWrap = document.querySelector<HTMLElement>('.anchor-wrap');
  if (!anchorWrap) return;

  const ul = anchorWrap.querySelector<HTMLElement>('.anchor-nav ul');
  if (!ul) return;

  // [수정 1] a 태그와 button 태그 모두 선택
  const triggers = ul.querySelectorAll<HTMLElement>('a, button');
  if (!triggers.length) return;

  // 타겟 매핑
  const sections = new Map<HTMLElement, HTMLElement>();

  triggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      // [수정 2] ID 추출: href가 없으면 data-target 확인
      const rawId = trigger.getAttribute('href') || trigger.getAttribute('data-target');
      
      // 유효성 검사 (#으로 시작하고 길이가 2 이상인 경우만)
      if (!rawId || !rawId.startsWith('#') || rawId.length < 2) return;

      const target = document.getElementById(rawId.slice(1));
      if (!target) return;

      e.preventDefault();

      updateActiveTab(trigger, ul);
      alignTabLeft(trigger, ul);

      const offset = getScrollOffset(anchorWrap);
      
      // [보정] 정확한 위치 계산
      const y = target.getBoundingClientRect().top + window.scrollY - offset + 1;

      smoothScrollTo(y, 500);
    });
  });

  // 스크롤 감지 필요시 주석 해지
  // initScrollObserver(sections, ul, anchorWrap);
}

// --------------------------------------------------
// offset 계산
// --------------------------------------------------
function getScrollOffset(anchorWrap: HTMLElement): number {
  const header = document.querySelector<HTMLElement>('.header');
  return (header?.offsetHeight || 0) + anchorWrap.offsetHeight;
}

// --------------------------------------------------
// active 처리
// --------------------------------------------------
function updateActiveTab(target: HTMLElement, ul: HTMLElement) {
  // [수정 3] a와 button 모두에서 active 클래스 제거
  ul.querySelectorAll('a, button').forEach(el => {
    el.classList.remove('is-active');
    el.removeAttribute('aria-current');
  });

  target.classList.add('is-active');
  target.setAttribute('aria-current', 'location');
}

// --------------------------------------------------
// 탭 가로 스크롤 정렬
// --------------------------------------------------
function alignTabLeft(target: HTMLElement, ul: HTMLElement) {
  const li = target.parentElement as HTMLElement;
  if (!li) return;

  // li의 offsetLeft 위치로 스크롤 이동 (왼쪽 정렬)
  // 첫 번째 요소면 0으로 강제 (패딩 오차 방지)
  const leftPos = (li === ul.firstElementChild) ? 0 : li.offsetLeft;

  ul.scrollTo({
    left: leftPos,
    behavior: 'smooth'
  });
}

// --------------------------------------------------
// smooth scroll
// --------------------------------------------------
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
  };

  requestAnimationFrame(step);
}


// --------------------------------------------------
// 스크롤 감지
// --------------------------------------------------
function initScrollObserver(
  sectionMap: Map<HTMLElement, HTMLElement>,
  ul: HTMLElement,
  anchorWrap: HTMLElement
) {
  const offset = getScrollOffset(anchorWrap);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const trigger = sectionMap.get(entry.target as HTMLElement);
        if (!trigger) return;

        updateActiveTab(trigger, ul);
        alignTabLeft(trigger, ul);
      });
    },
    {
      root: null,
      rootMargin: `-${offset}px 0px -70% 0px`,
      threshold: 0
    }
  );

  sectionMap.forEach((_, section) => {
    observer.observe(section);
  });
}
