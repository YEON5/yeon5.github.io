export function initFormField() {
  const fields = document.querySelectorAll('.form-field');

  fields.forEach((group) => {
    const formInputs = group.querySelectorAll('.form-input');

    formInputs.forEach((item) => {
      const input = item.querySelector('input') as HTMLInputElement;
      if (!input) return;

      // 1. 삭제 버튼 생성 (Lazy Creation)
      const createClearBtn = (): HTMLButtonElement => {
        let onRight = item.querySelector('.on-right') as HTMLElement;

        // .on-right 없으면 생성
        if (!onRight) {
          onRight = document.createElement('div');
          onRight.className = 'on-right';
          item.appendChild(onRight);
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-input-clear';
        btn.innerHTML = '<span>삭제</span>';

        // 이벤트 바인딩
        btn.addEventListener('focus', updateState);
        btn.addEventListener('blur', handleBlur);
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          input.value = '';
          updateState();
          input.focus();
        });

        onRight.prepend(btn);
        return btn;
      };

      // 2. 상태 업데이트
      const updateState = () => {
        let clearBtn = item.querySelector('.btn-input-clear') as HTMLElement;

        const isInputFocused = document.activeElement === input;
        const isBtnFocused = clearBtn ? document.activeElement === clearBtn : false;
        const hasValue = input.value && input.value.trim() !== '';

        const isReadOnly = input.readOnly;
        const isDisabled = input.disabled;

        // 그룹 Active 클래스 토글
        if (hasValue || isInputFocused || isBtnFocused) {
          group.classList.add('active');
        } else {
          // 그룹 내 다른 input들도 확인 (Multi inputs case)
          const allInputs = group.querySelectorAll('input');
          const anyActive = Array.from(allInputs).some(
            (inp) => inp.value.trim() !== '' || document.activeElement === inp
          );
          if (!anyActive) group.classList.remove('active');
        }

        // 버튼 노출 제어
        const showBtn = hasValue && (isInputFocused || isBtnFocused) && !isReadOnly && !isDisabled;

        if (showBtn) {
          if (!clearBtn) {
            clearBtn = createClearBtn();
          }
          clearBtn.style.display = 'inline-block';
        } else {
          if (clearBtn) {
            clearBtn.style.display = 'none';
          }
        }
      };

      // 3. Blur 지연 처리
      const handleBlur = () => {
        setTimeout(updateState, 150);
      };

      // 4. 초기 이벤트 연결
      input.addEventListener('input', updateState);
      input.addEventListener('focus', updateState);
      input.addEventListener('blur', handleBlur);

      // 초기 실행
      updateState();
    });
  });
}