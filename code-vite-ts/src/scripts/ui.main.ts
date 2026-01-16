import '../styles/ui.style.scss';

import { initLayout } from './components/layout';
import { initAccordion } from './components/accordion';
import { initDropdown } from './components/dropdown';
import { initTab } from './components/tab';
import { initPopup } from './components/popup';
import { initForm } from './components/form';
import scrollEvent from './components/scroll';

document.addEventListener('DOMContentLoaded', () => {
    console.log('UI Scripts Initialized');
    initLayout();
    initAccordion();
    initDropdown();
    initTab();
    initPopup();
    initForm();
    scrollEvent();
});