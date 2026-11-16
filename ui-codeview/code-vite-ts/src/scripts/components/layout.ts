import headerHtml from '../../components/layout/header.html?raw';
import footerHtml from '../../components/layout/footer.html?raw';

export const initLayout = () => {
    // 1. 헤더 로드
    const headerInclude = document.getElementById('header-include');
    if (headerInclude) {
        headerInclude.outerHTML = headerHtml;
    }

    // 2. 푸터 로드
    const footerInclude = document.getElementById('footer-include');
    if (footerInclude) {
        footerInclude.outerHTML = footerHtml;
    }

    // 3. (옵션) 레이아웃 로드 완료 이벤트 발생
    // 헤더/푸터가 비동기가 아닌 동기적으로 삽입되지만,
    // 만약 이후에 GNB나 다른 UI 스크립트가 DOM을 찾아야 한다면
    // 명시적으로 "레이아웃 렌더링 끝났다"고 알려주는 것이 좋습니다.
    
    // 하지만 현재 구조(ui.main.ts에서 순차 실행)에서는 
    // initLayout() 다음에 initGnb() 등을 호출하면 문제없이 동작합니다.
};