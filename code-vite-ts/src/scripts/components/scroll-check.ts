// 리스너가 중복으로 등록되는 것을 방지하기 위해 핸들러를 모듈 스코프(함수 밖)에 선언합니다.
let scrollHandler: (() => void) | null = null;
let resizeHandler: (() => void) | null = null;

export function initScrollCheck(): void {
  // 1. 기존 리스너가 있다면 제거 (중복 실행 방지)
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }

  let oldScrTop: number = window.scrollY;
  let scrollEndTime: number | undefined;
  let resizeEndTime: number | undefined;

  // 스크롤 위치 상태 체크 (소수점 오차 해결 로직 포함)
  const checkScrollPosition = (val: number): void => {
    const body = document.body;
    
    // 최상단 체크 (First)
    if (val <= 0) {
      body.classList.add('is-scrollFirst');
    } else {
      body.classList.remove('is-scrollFirst');
    }

    // 최하단 체크 (Last) - Math.ceil로 소수점 오차 보정
    // (val + window.innerHeight)가 scrollHeight보다 크거나 같으면 끝으로 간주
    if (Math.ceil(val + window.innerHeight) >= document.documentElement.scrollHeight) {
      body.classList.add('is-scrollLast');
    } else {
      body.classList.remove('is-scrollLast');
    }
  };

  // 2. 스크롤 핸들러 정의
  scrollHandler = (): void => {
    const curScrTop: number = window.scrollY;
    const body = document.body;

    // 스크롤 방향 감지 (DOM 조작 최소화)
    if (oldScrTop < curScrTop) {
      // Down
      if (!body.classList.contains('is-scrollDown')) {
        window.dispatchEvent(new CustomEvent('scrollDown'));
        body.classList.add('is-scrollDown');
        body.classList.remove('is-scrollUp');
      }
    } else if (oldScrTop > curScrTop) {
      // Up
      if (!body.classList.contains('is-scrollUp')) {
        window.dispatchEvent(new CustomEvent('scrollUp'));
        body.classList.add('is-scrollUp');
        body.classList.remove('is-scrollDown');
      }
    }
    oldScrTop = curScrTop;

    // 위치 상태 업데이트
    checkScrollPosition(curScrTop);

    // 스크롤 종료 감지 (Debounce)
    if (scrollEndTime) clearTimeout(scrollEndTime);
    scrollEndTime = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('scrollEnd'));
    }, 100);
  };

  // 3. 리사이즈 핸들러 정의
  resizeHandler = (): void => {
    if (resizeEndTime) clearTimeout(resizeEndTime);
    resizeEndTime = window.setTimeout(() => {
      // 리사이즈 시 전체 높이가 달라지므로 위치 상태 재계산 필수
      checkScrollPosition(window.scrollY);
      window.dispatchEvent(new CustomEvent('resizeEnd'));
    }, 100);
  };

  // 4. 초기 상태 실행
  checkScrollPosition(oldScrTop);

  // 5. 이벤트 등록 (passive: true로 스크롤 성능 최적화)
  window.addEventListener('scroll', scrollHandler, { passive: true });
  window.addEventListener('resize', resizeHandler);
}