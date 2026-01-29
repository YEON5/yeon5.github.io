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

document.addEventListener('DOMContentLoaded', () => {
    console.log('UI Scripts Initialized');
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
});