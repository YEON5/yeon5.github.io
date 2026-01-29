export function initScrollSpy() {
  // data-scrollspy="true" 속성이 있는 앵커 랩만 찾아서 적용
  const spyWraps = document.querySelectorAll<HTMLElement>('.anchor-wrap[data-scrollspy="true"]');

  spyWraps.forEach((wrap) => {
    new ScrollSpyInstance(wrap);
  });
}

class ScrollSpyInstance {
  private wrap: HTMLElement;
  private nav: HTMLElement;
  private links: NodeListOf<HTMLElement>;
  private targets: Map<string, { top: number; bottom: number; link: HTMLElement }>;
  private scrollTimeout?: number;
  private isManualScroll: boolean = false; // 클릭 이동 중 감지 방지용 (필요시 연동)

  constructor(wrap: HTMLElement) {
    this.wrap = wrap;
    this.nav = wrap.querySelector('.anchor-nav') as HTMLElement;
    
    // a태그, button태그 모두 지원
    this.links = this.nav.querySelectorAll<HTMLElement>('a[href^="#"], button[data-target]');
    this.targets = new Map();

    if (this.links.length > 0) {
      this.init();
    }
  }

  private init() {
    this.calcRanges();
    
    // 이벤트 등록
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('resize', () => {
      this.calcRanges();
      this.onScroll();
    });

    // 만약 anchor.ts에서 클릭 시 is-active를 강제로 바꾸더라도,
    // 스크롤이 멈추면 Spy가 다시 정확한 위치를 잡아야 하므로 별도 통신은 안 해도 됨.
    // 단, 클릭 순간 튀는걸 막으려면 anchor.ts와 전역 변수 등으로 소통하거나
    // 아래와 같이 클릭 이벤트를 감지해 잠시 멈출 수 있음.
    this.links.forEach(link => {
        link.addEventListener('click', () => {
            this.isManualScroll = true;
            setTimeout(() => this.isManualScroll = false, 1000);
        });
    });
  }

  // 핵심: 타겟들의 위치 범위 계산 (그룹핑 로직 포함)
  private calcRanges() {
    this.targets.clear();
    const offset = this.getOffset();

    this.links.forEach((link) => {
      const rawId = link.getAttribute('href') || link.getAttribute('data-target');
      if (!rawId || !rawId.startsWith('#')) return;

      const id = rawId.substring(1);
      
      // 1. 메인 타겟 (ID로 찾기)
      const mainTarget = document.getElementById(id);
      
      // 2. 그룹 타겟들 (data-spy-group="ID"로 찾기) -> 섹션+섹션+섹션 지원
      const groupTargets = document.querySelectorAll<HTMLElement>(`[data-spy-group="${id}"]`);
      
      const allElements = [mainTarget, ...Array.from(groupTargets)].filter((el): el is HTMLElement => el !== null);

      if (allElements.length === 0) return;

      // 3. 그룹 전체의 범위(Start ~ End) 계산
      // 여러 섹션 중 가장 위쪽 top과 가장 아래쪽 bottom을 찾음
      let minTop = Infinity;
      let maxBottom = -Infinity;

      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const absoluteBottom = absoluteTop + el.offsetHeight;

        if (absoluteTop < minTop) minTop = absoluteTop;
        if (absoluteBottom > maxBottom) maxBottom = absoluteBottom;
      });

      // 맵에 저장 (오차 보정 포함)
      this.targets.set(rawId, {
        top: minTop - offset - 1, 
        bottom: maxBottom - offset - 1,
        link: link
      });
    });
  }

  private onScroll() {
    if (this.isManualScroll) return;

    if (this.scrollTimeout) cancelAnimationFrame(this.scrollTimeout);

    this.scrollTimeout = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      // 감지 기준점 (화면 상단 + 오프셋 + 여유분)
      // 조금 더 안쪽으로 들어와야 인식하게 하려면 값을 늘림
      const triggerPoint = scrollTop + 5; 

      let activeId: string | null = null;

      // 현재 스크롤 위치가 어느 범위에 있는지 확인
      for (const [id, range] of this.targets) {
        if (triggerPoint >= range.top && triggerPoint < range.bottom) {
          activeId = id;
          // 겹치는 구간이 있을 경우, 더 좁은 범위나 뒤에 정의된 것을 우선하려면 여기서 break 하지 않고 계속 루프
        }
      }

      // 활성화 상태 업데이트
      if (activeId) {
        const targetData = this.targets.get(activeId);
        if (targetData) {
            this.updateActive(targetData.link);
        }
      } else {
        // (선택사항) 범위 밖이면 모든 active 해제? 
        // 보통은 마지막 상태 유지 혹은 맨 위일 때 첫번째 유지 등을 처리함
      }
    });
  }

  private updateActive(targetLink: HTMLElement) {
    // 이미 활성화 상태면 무시 (성능 최적화)
    if (targetLink.classList.contains('is-active')) return;

    // 전체 해제
    this.links.forEach(el => {
        el.classList.remove('is-active');
        el.removeAttribute('aria-current');
    });

    // 타겟 활성화
    targetLink.classList.add('is-active');
    targetLink.setAttribute('aria-current', 'location');

    // 가로 스크롤 정렬 (anchor.ts의 로직 재사용하거나 여기서 직접 구현)
    this.alignTab(targetLink);
  }

  private alignTab(target: HTMLElement) {
    const ul = this.nav.querySelector('ul') as HTMLElement;
    const li = target.closest('li');
    if (!ul || !li) return;

    const ulStyle = window.getComputedStyle(ul);
    const paddingLeft = parseInt(ulStyle.paddingLeft, 10) || 0;
    
    // 왼쪽 정렬 계산
    let leftPos = li.offsetLeft;
    if (li === ul.firstElementChild) leftPos = 0; // 첫번째는 0

    ul.scrollTo({
        left: leftPos,
        behavior: 'smooth'
    });
  }

  private getOffset(): number {
    const header = document.querySelector<HTMLElement>('.header');
    return (header?.offsetHeight || 0) + this.wrap.offsetHeight;
  }
}