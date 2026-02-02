type LoadingCallback = () => void;

export const Loading = {
  html: `
    <div class="loading-wrap" role="status" aria-busy="true">
        <div class="loading-spinner"></div>
    </div>
  `,

  /**
   * 로딩 보여주기
   */
  show(callback?: LoadingCallback): void {
    let loadingEl = document.querySelector('.loading-wrap');

    if (!loadingEl) {
      document.body.insertAdjacentHTML('beforeend', this.html);
      loadingEl = document.querySelector('.loading-wrap');
    }

    if (loadingEl) {
      loadingEl.classList.add('is-active');
      // [추가] 스크롤 잠금 (body 스크롤 막기)
      document.body.style.overflow = 'hidden';
    }

    if (callback && typeof callback === 'function') {
      setTimeout(() => callback(), 10);
    }
  },

  /**
   * 로딩 숨기기
   */
  hide(callback?: LoadingCallback): void {
    const loadingEl = document.querySelector('.loading-wrap');

    if (loadingEl) {
      loadingEl.classList.remove('is-active');
      // [추가] 스크롤 잠금 해제 (원상복구)
      document.body.style.removeProperty('overflow');
    }

    if (callback && typeof callback === 'function') {
      callback();
    }
  }
};