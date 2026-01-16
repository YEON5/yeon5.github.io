import headerHtml from '../../components/layout/header.html?raw';

export const initLayout = () => {
    const headerInclude = document.getElementById('header-include');
    if (headerInclude) {
        headerInclude.outerHTML = headerHtml;
    }
};
