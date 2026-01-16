export const initTab = () => {
  // Standard Tab
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const tabBtn = target.closest('.tab-nav li > button');
    
    if (tabBtn) {
      e.preventDefault();
      const li = tabBtn.parentElement;
      if (li && !li.classList.contains('is-active')) {
        const id = tabBtn.getAttribute('aria-controls');
        if (id) {
            activateTab(li, id);
        }
      }
    }
  });

  // Tab Round (Separate implementation in original, but logic is similar)
  // Original `tabEvent` handled `.tab-round .tab-nav li > button` separately?
  // It seems `tabInit` handled general tabs and `tabEvent` handled `.tab-round` specifically with `tabAction`.
  // The logic is almost identical: show ID, hide siblings.
  // We can merge or keep separate if markup differs significantly.
  // In `tabInit`: adds `is-active`, updates `aria-hidden` etc.
  // In `tabEvent` (`tabAction`): just `show()`/`hide()`.
  
  // Let's combine them for robustness.
};

const activateTab = (activeLi: HTMLElement, contentId: string) => {
  // Deactivate siblings
  const ul = activeLi.parentElement;
  if (ul) {
      Array.from(ul.children).forEach(li => {
          if (li !== activeLi) {
              li.classList.remove('is-active');
              const btn = li.querySelector('button');
              btn?.setAttribute('aria-selected', 'false');
          }
      });
  }
  
  // Activate current
  activeLi.classList.add('is-active');
  const activeBtn = activeLi.querySelector('button');
  activeBtn?.setAttribute('aria-selected', 'true');

  // Show Content
  const content = document.getElementById(contentId);
  if (content) {
      content.classList.add('is-active');
      content.setAttribute('aria-hidden', 'false');
      // Hide sibling contents
      const parent = content.parentElement;
      if (parent) {
          Array.from(parent.children).forEach(child => {
              if (child !== content && child.classList.contains('tab-cont')) {
                  child.classList.remove('is-active');
                  child.setAttribute('aria-hidden', 'true');
                  (child as HTMLElement).style.display = 'none'; // Ensure hidden if using show/hide logic
              }
          });
      }
      content.style.display = 'block'; // Ensure shown
  }
};
