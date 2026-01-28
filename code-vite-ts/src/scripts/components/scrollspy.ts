export function initScrollSpy() {
  const anchorWrap = document.querySelector('.anchor-wrap') as HTMLElement;
  if (!anchorWrap) return;

  const nav = anchorWrap.querySelector('.anchor-nav') as HTMLElement;
  const ul = nav.querySelector('ul') as HTMLElement;
  const links = nav.querySelectorAll('a');
  // 실제 컨텐츠 섹션들 (ID가 있는 요소만)
  const sections = document.querySelectorAll('.section[id]'); 

  if (sections.length === 0 || links.length === 0) return;

  // 1. 링크 클릭 핸들러
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;
      
      const targetSection = document.querySelector(targetId) as HTMLElement;
      
      if (targetSection) {
        // 헤더 및 앵커 높이 계산
        const headerHeight = getHeaderHeight();
        const anchorHeight = anchorWrap.offsetHeight || 0;
        const offset = headerHeight + anchorHeight;
        
        // 부드러운 스크롤 이동
        const targetTop = targetSection.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: targetTop - offset + 2, // +2는 오차 보정
          behavior: 'smooth'
        });

        updateActiveState(link, ul);
      }
    });
  });

  // 2. 스크롤 감지 핸들러
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    // 계산용 변수 업데이트
    const headerHeight = getHeaderHeight();
    const anchorHeight = anchorWrap.offsetHeight || 0;
    
    // 체크 포인트 (헤더+앵커바 높이만큼 아래 지점을 기준으로 인식)
    const checkPoint = scrollTop + headerHeight + anchorHeight + 10;

    sections.forEach((section) => {
      const el = section as HTMLElement;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const bottom = top + el.offsetHeight;

      // 현재 스크롤이 섹션 영역 안에 들어왔는지 체크
      if (checkPoint >= top && checkPoint < bottom) {
        const targetId = '#' + el.id;
        
        // 해당 ID를 가진 링크 찾기
        // NodeList는 filter가 없으므로 Array로 변환하여 찾음
        const activeLink = Array.from(links).find(
          (link) => link.getAttribute('href') === targetId
        );

        if (activeLink) {
          // 이미 활성화 상태가 아닐 때만 업데이트 (성능 최적화)
          if (!activeLink.classList.contains('is-active')) {
            updateActiveState(activeLink, ul);
          }
        }
      }
    });
  }, { passive: true }); // passive 옵션으로 스크롤 성능 향상
}

// Helper: 헤더 높이 구하기
function getHeaderHeight(): number {
  const header = document.querySelector('.header') as HTMLElement;
  return header ? header.offsetHeight : 0;
}

// 활성화 상태 업데이트 & 가로 스크롤 자동 이동
function updateActiveState(targetLink: HTMLAnchorElement, ul: HTMLElement) {
  // 모든 링크 비활성화
  const allLinks = ul.querySelectorAll('a');
  allLinks.forEach((link) => {
    link.classList.remove('is-active');
    link.removeAttribute('aria-current');
  });

  // 타겟 링크 활성화
  targetLink.classList.add('is-active');
  targetLink.setAttribute('aria-current', 'location');

  // 탭 가로 정렬 (왼쪽 기준)
  alignActiveTabLeft(targetLink, ul);
}

// 가로 스크롤 맨 왼쪽 정렬
function alignActiveTabLeft(targetLink: HTMLAnchorElement, ul: HTMLElement) {
  const li = targetLink.parentElement as HTMLElement;
  if (!li) return;

  // offsetLeft는 부모(ul) 기준 왼쪽에서의 거리입니다.
  // 첫 번째 요소면 0, 아니면 해당 위치로 스크롤
  let targetScrollLeft = li.offsetLeft;
  
  // 첫 번째 요소는 무조건 0으로 (여백 문제 방지)
  if (li === ul.firstElementChild) {
    targetScrollLeft = 0;
  }

  // 부드럽게 가로 스크롤 이동
  ul.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  });
}

// 가로 스크롤 중앙 정렬 - 필요 시 교체해서 사용하세요
/*
function centerActiveTab(targetLink: HTMLAnchorElement, ul: HTMLElement) {
  const li = targetLink.parentElement as HTMLElement;
  if (!li) return;

  const containerWidth = ul.offsetWidth;
  const targetLeft = li.offsetLeft; // ul 내부에서의 위치
  const targetWidth = li.offsetWidth;

  // 중앙 위치 계산: (요소위치) - (컨테이너절반) + (요소절반)
  const centerPosition = targetLeft - (containerWidth / 2) + (targetWidth / 2);

  ul.scrollTo({
    left: centerPosition,
    behavior: 'smooth'
  });
}
*/