export type LoadingType = 'default' | 'texted' | 'lottie';

export interface LoadingOptions {
  type?: LoadingType;       // 'default' | 'texted' | 'lottie'
  text?: string | string[]; // 문구
  textInterval?: number;    // 문구 교체 속도 (기본 2000ms)
  lottiePath?: string;      // Lottie JSON 경로
}

export class LoadingController {
  private static instance: LoadingController;
  
  // 상태 변수
  private lottieAnim: any = null;
  private msgInterval: number | null = null;
  private $wrap: HTMLElement | null = null;

  // 타입 클래스 목록 (초기화용)
  private readonly typeClasses = ['type-default', 'type-texted', 'type-lottie'];

  // HTML 템플릿
  private readonly template = 
  `
    <div class="loading-wrap type-default" role="status">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-lottie"></div>
            <p class="loading-text"></p>
        </div>
    </div>
  `;

  public static getInstance(): LoadingController {
    if (!LoadingController.instance) {
      LoadingController.instance = new LoadingController();
    }
    return LoadingController.instance;
  }

  private constructor() {}

  private initDOM() {
    if (document.querySelector('.loading-wrap')) {
        this.$wrap = document.querySelector('.loading-wrap');
        return;
    }
    document.body.insertAdjacentHTML('beforeend', this.template);
    this.$wrap = document.querySelector('.loading-wrap');
  }

  /**
   * 로딩 노출
   */
  public show(options: LoadingOptions = {}) {
    this.initDOM();
    if (!this.$wrap) return;

    const $spinner = this.$wrap.querySelector('.loading-spinner') as HTMLElement;
    const $lottie = this.$wrap.querySelector('.loading-lottie') as HTMLElement;
    const $text = this.$wrap.querySelector('.loading-text') as HTMLElement;

    // 1. 타입 설정 (기본값: default)
    const currentType = options.type || 'default';
    
    // 기존 타입 클래스 제거 후 새 타입 추가
    this.$wrap.classList.remove(...this.typeClasses);
    this.$wrap.classList.add(`type-${currentType}`);

    // 2. 요소별 노출 제어 로직

    // [Lottie 제어] type이 'lottie'일 때만 노출
    if (currentType === 'lottie' && options.lottiePath && window.lottie) {
      $spinner.style.display = 'none'; // 스피너 숨김
      $lottie.style.display = 'block'; // 로티 노출
      this.playLottie($lottie, options.lottiePath);
    } else {
      $lottie.style.display = 'none';
      this.stopLottie();
      
      // 'lottie' 타입이 아니면 무조건 스피너 노출
      $spinner.style.display = 'block';
    }

    // [텍스트 제어] type이 'default'가 아닐 때만 노출 ('texted', 'lottie')
    if (currentType !== 'default' && options.text) {
      this.handleText($text, options.text, options.textInterval);
    } else {
      // default 타입이거나 텍스트가 없으면 숨김
      $text.classList.remove('is-show');
      this.stopTextInterval();
    }

    // 3. 화면 표시 및 스크롤 잠금
    this.$wrap.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * 로딩 숨김
   */
  public hide() {
    if (!this.$wrap) return;

    this.$wrap.classList.remove('is-active');
    document.body.style.removeProperty('overflow');

    this.stopTextInterval();
    this.stopLottie();
  }

  // --- 내부 로직 (이전과 동일) ---

  private handleText(el: HTMLElement, text: string | string[], interval: number = 2000) {
    this.stopTextInterval();

    // 배열 처리
    if (Array.isArray(text)) {
      if (text.length === 0) return;
      let idx = 0;
      this.updateTextWithAnimation(el, text[0]);

      if (text.length > 1) {
        this.msgInterval = window.setInterval(() => {
          idx = (idx + 1) % text.length;
          this.updateTextWithAnimation(el, text[idx]);
        }, interval);
      }
    } else {
      // 문자열 처리
      this.updateTextWithAnimation(el, text);
    }
  }

  private updateTextWithAnimation(el: HTMLElement, newText: string) {
    el.classList.remove('is-show');
    void el.offsetWidth; // Reflow
    el.innerText = newText;
    el.classList.add('is-show');
  }

  private stopTextInterval() {
    if (this.msgInterval) {
      clearInterval(this.msgInterval);
      this.msgInterval = null;
    }
  }

  private playLottie(container: HTMLElement, path: string) {
    if (this.lottieAnim) {
        this.lottieAnim.play();
        return;
    }
    this.lottieAnim = window.lottie.loadAnimation({
      container: container, renderer: 'svg', loop: true, autoplay: true, path: path
    });
  }

  private stopLottie() {
    if (this.lottieAnim) {
      this.lottieAnim.destroy();
      this.lottieAnim = null;
    }
  }
}

export const Loading = LoadingController.getInstance();

declare global {
  interface Window {
    Loading: LoadingController;
    lottie: any;
  }
}