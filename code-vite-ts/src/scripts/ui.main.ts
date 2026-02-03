import '../styles/ui.style.scss';

import { initLayout } from './components/layout';
import { initFormField } from './components/form-field';
import { initFormOption } from './components/form-option';
import { initAccordion } from './components/accordion';
import { initDropdown } from './components/dropdown';
import { initTab } from './components/tab';
import { initSelect } from './components/select';
import { initPopup } from './components/popup';
import { initPopover } from './components/popover';
import { initSticky } from './components/sticky';
import { initAnchor } from './components/anchor';
import { initScrollSpy } from './components/scrollspy';
import { initScrollCheck } from './components/scroll-check';
import { Toast } from './components/toast';
import { Loading } from './components/loading';


declare global {
  interface Window {
    Loading: typeof Loading;
    Toast: typeof Toast;
  }
}

document.addEventListener('DOMContentLoaded', () => {
    window.Loading = Loading;
    window.Toast = Toast;

    initLayout();
    initFormField();
    initFormOption();
    initAccordion();
    initDropdown();
    initTab();
    initSelect();
    initPopup();
    initPopover();
    initSticky();
    initAnchor();
    initScrollSpy();
    initScrollCheck();

    initGlobalEvents();
});


// 전역 이벤트
function initGlobalEvents() {
  document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Toast
      const toastBtn = target.closest('[data-toast]');
      if (toastBtn) {
          const msg = toastBtn.getAttribute('data-toast');
          const time = toastBtn.getAttribute('data-toast-time');
          if (msg) {
              Toast.show({
                  message: msg,
                  duration: time ? Number(time) : 3000
              });
          }
      }
  
      // Loading
      const loadingBtn = target.closest('[data-loading]');
      if (loadingBtn) {
          // 1. 기본형
          // Loading.show();
  
          // 2. 텍스트 롤링
          Loading.show({
            type: 'texted',
            text: ['준비중입니다', '데이터 처리중', '완료되었습니다'],
          });
  
          // 3. Lottie + 텍스트
          // Loading.show({
          //     type: 'lottie',
          //     lottiePath: '/assets/lottie_loading.json',
          //     text: ['안전한 결제 환경을 점검중입니다.', '결제 승인 요청 중...']
          // });

          // Loading.hide 필요시
          // setTimeout(() => Loading.hide(), 3000);
      }
  });
};