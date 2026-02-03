// src/scripts/components/toast.ts

export interface ToastOptions {
  message: string;
  duration?: number; // 기본 3000ms
}

export class ToastController {
  private static instance: ToastController;
  private container: HTMLElement | null = null;

  public static getInstance(): ToastController {
    if (!ToastController.instance) ToastController.instance = new ToastController();
    return ToastController.instance;
  }

  private initContainer() {
    if (document.querySelector('.toast-container')) {
      this.container = document.querySelector('.toast-container');
    } else {
      const div = document.createElement('div');
      div.className = 'toast-container';
      div.setAttribute('role', 'status');
      document.body.appendChild(div);
      this.container = div;
    }
  }

  public show(messageOrOptions: string | ToastOptions) {
    this.initContainer();
    if (!this.container) return;

    const options = typeof messageOrOptions === 'string' 
      ? { message: messageOrOptions } 
      : messageOrOptions;
    
    const duration = options.duration ?? 3000;

    // 토스트 생성
    const toastEl = document.createElement('div');
    toastEl.className = 'toast-item';
    
    // 텍스트 (보안 위해 textContent 사용)
    const textSpan = document.createElement('span');
    textSpan.textContent = options.message;
    toastEl.appendChild(textSpan);

    // 컨테이너 추가
    this.container.appendChild(toastEl);

    // --- 타이머 로직 (접근성 반영) ---
    let timer: number | null = null;

    const remove = () => {
      if (toastEl.isConnected) {
        toastEl.classList.add('is-hiding');
        toastEl.addEventListener('animationend', () => toastEl.remove(), { once: true });
      }
    };

    const startTimer = () => {
      if (!timer && duration > 0) {
        timer = window.setTimeout(remove, duration);
      }
    };

    const pauseTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // 1. 시작
    startTimer();

    // 2. [접근성] 사용자가 보려고 하면(마우스, 포커스) 멈춤
    // 닫기 버튼은 없지만, 읽고 싶어서 마우스를 올리거나 탭으로 이동했을 때 사라지지 않게 함
    toastEl.addEventListener('mouseenter', pauseTimer);
    toastEl.addEventListener('mouseleave', startTimer);
    toastEl.addEventListener('focusin', pauseTimer);
    toastEl.addEventListener('focusout', startTimer);
  }
}

export const Toast = ToastController.getInstance();

declare global {
  interface Window { Toast: ToastController; }
}