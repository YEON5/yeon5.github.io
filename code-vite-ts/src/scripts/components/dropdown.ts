import { slideToggle } from './utils';

export const initDropdown = () => {
  // Toggle (Dropdown with slide)
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const toggleBtn = target.closest('.btn-toggle');

    if (toggleBtn) {
      const dropdown = toggleBtn.closest('.dropdown');
      if (dropdown) {
        handleToggle(dropdown as HTMLElement);
      }
    }
  });

  // Dropdown Select (Simple class toggle)
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const selectBtn = target.closest('.btn-dropdown');

    if (selectBtn) {
      const dropdowns = selectBtn.closest('.dropdowns');
      if (dropdowns) {
        handleDropdownSelect(dropdowns as HTMLElement);
      }
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    const target = e.target as Node;

    // For .dropdown
    if (document.querySelectorAll('.dropdown.is-active').length > 0) {
      if (!document.querySelector('.dropdown')?.contains(target)) {
        document.querySelectorAll('.dropdown.is-active').forEach(el => handleToggle(el as HTMLElement));
      }
    }

    // For .dropdowns
    // (Optional: Implement if needed, original code commented out global click handler for lnb but `toggleClose` existed)
  });
};

const handleToggle = (element: HTMLElement) => {
  const isActive = element.classList.contains('is-active');
  const body = element.querySelector('.item-body') as HTMLElement;
  const btn = element.querySelector('.btn-toggle');
  const list = element.querySelector('.drop-list');

  // Close others
  if (!isActive) {
    document.querySelectorAll('.dropdown.is-active').forEach(el => {
      if (el !== element) {
        el.classList.remove('is-active');
        const otherBody = el.querySelector('.item-body') as HTMLElement;
        if (otherBody) slideToggle(otherBody, 200);
      }
    });
  }

  // Toggle current
  if (isActive) {
    element.classList.remove('is-active');
    btn?.setAttribute('aria-expanded', 'false');
    list?.setAttribute('aria-hidden', 'true');
  } else {
    element.classList.add('is-active');
    btn?.setAttribute('aria-expanded', 'true');
    list?.setAttribute('aria-hidden', 'false');
  }

  if (body) slideToggle(body, 200);
};

const handleDropdownSelect = (element: HTMLElement) => {
  const isActive = element.classList.contains('is-active');
  const btn = element.querySelector('.btn-dropdown');
  const body = element.querySelector('.drop-body');

  if (isActive) {
    element.classList.remove('is-active');
    btn?.setAttribute('aria-expanded', 'false');
    body?.setAttribute('aria-hidden', 'true');
  } else {
    element.classList.add('is-active');
    btn?.setAttribute('aria-expanded', 'true');
    body?.setAttribute('aria-hidden', 'false');
  }
};
