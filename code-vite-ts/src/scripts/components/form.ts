export const initForm = () => {
  // checkbox, radio option check view
  document.addEventListener('change', e => {
    const target = e.target as HTMLInputElement;

    // Checkbox logic
    if (target.type === 'checkbox' && target.hasAttribute('aria-controls')) {
      toggleCheckboxContent(target);
    }

    // Radio logic
    if (target.type === 'radio' && target.hasAttribute('aria-controls')) {
      toggleRadioContent(target);
    }
  });
};

const toggleCheckboxContent = (checkbox: HTMLInputElement) => {
  const targetIds = checkbox.getAttribute('aria-controls');
  if (!targetIds) return;

  targetIds.split(' ').forEach(targetId => {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      if (checkbox.checked) {
        targetEl.classList.add('is-active');
      } else {
        targetEl.classList.remove('is-active');
      }
    }
  });
};

const toggleRadioContent = (radio: HTMLInputElement) => {
  const name = radio.name;
  if (!name) return;

  const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
  radios.forEach(radioGroup => {
    const rdi = radioGroup as HTMLInputElement;
    const targetId = rdi.getAttribute('aria-controls');
    if (targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (rdi.checked) {
          targetEl.classList.add('is-active');
        } else {
          targetEl.classList.remove('is-active');
        }
      }
    }
  });
};
