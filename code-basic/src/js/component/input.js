// input text
const uiFormfield = {
    init() {
        const fieldGroups = document.querySelectorAll('.form-field');

        fieldGroups.forEach(group => {
            const inputs = group.querySelectorAll('.form-input');

            inputs.forEach(item => {
                const input = item.querySelector('input');
                if (!input) return;

                let clearBtn = item.querySelector('.btn-input-clear');
                if (!clearBtn) {
                    let onRightDiv = item.querySelector('.on-right');
                    if (!onRightDiv) {
                        onRightDiv = document.createElement('div');
                        onRightDiv.className = 'on-right';
                        item.appendChild(onRightDiv);
                    }

                    clearBtn = document.createElement('button');
                    clearBtn.type = 'button';
                    clearBtn.className = 'btn-input-clear';
                    clearBtn.textContent = '삭제';
                    clearBtn.style.display = 'none';
                    onRightDiv.prepend(clearBtn);
                }

                const updateState = () => {
                    const isInputFocused = document.activeElement === input;
                    const isBtnFocused = document.activeElement === clearBtn;
                    const hasValue = input.value && input.value.trim() !== '';

                    // 읽기 전용이거나 비활성화 상태인지 확인
                    const isReadOnly = input.readOnly;
                    const isDisabled = input.disabled;

                    // 그룹 active 클래스 제어
                    if (hasValue || isInputFocused || isBtnFocused) {
                        group.classList.add('active');
                    } else {
                        const allInputs = group.querySelectorAll('input');
                        const anyActive = Array.from(allInputs).some(inp => inp.value.trim() !== '' || document.activeElement === inp);
                        if (!anyActive) group.classList.remove('active');
                    }

                    // 버튼 노출 제어
                    if (hasValue && (isInputFocused || isBtnFocused) && !isReadOnly && !isDisabled) {
                        clearBtn.style.display = 'inline-block';
                    } else {
                        clearBtn.style.display = 'none';
                    }
                };

                input.addEventListener('input', updateState);
                input.addEventListener('focus', updateState);
                clearBtn.addEventListener('focus', updateState);

                const handleBlur = () => {
                    setTimeout(updateState, 150);
                };

                input.addEventListener('blur', handleBlur);
                clearBtn.addEventListener('blur', handleBlur);

                clearBtn.addEventListener('click', e => {
                    e.preventDefault();
                    input.value = '';
                    updateState();
                    input.focus();
                });

                updateState();
            });
        });
    },
};

// init
document.addEventListener('DOMContentLoaded', () => {
    uiFormfield.init();
    uiRadiotab.init();
});

// document.addEventListener('DOMContentLoaded', () => {
//     // 탭 그룹 이름(input name)만 넘겨주면 초기화됨
//     initRadioTabs('myTab');
// });
