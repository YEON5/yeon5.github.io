// input text
const uiFormfield = {
    init() {
        const fieldGroups = document.querySelectorAll('.form-field');

        fieldGroups.forEach(group => {
            const inputs = group.querySelectorAll('.form-input');

            inputs.forEach(item => {
                const input = item.querySelector('input');
                if (!input) return;

                // [수정 포인트 1] 초기화 시점에는 버튼 변수만 선언하고, DOM 생성은 하지 않음
                let clearBtn = item.querySelector('.btn-input-clear');

                // 버튼 생성 및 이벤트 바인딩 함수 (필요할 때 호출)
                const createClearBtn = () => {
                    let onRightDiv = item.querySelector('.on-right');
                    if (!onRightDiv) {
                        onRightDiv = document.createElement('div');
                        onRightDiv.className = 'on-right';
                        item.appendChild(onRightDiv);
                    }

                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'btn-input-clear';

                    const btnSpan = document.createElement('span');
                    btnSpan.textContent = '삭제';
                    btn.appendChild(btnSpan);

                    // 생성 시점에 이벤트 바인딩
                    btn.addEventListener('focus', updateState);
                    btn.addEventListener('blur', handleBlur);
                    btn.addEventListener('click', e => {
                        e.preventDefault();
                        input.value = '';
                        updateState(); // 삭제 후 상태 업데이트 (버튼 숨김 등)
                        input.focus();
                    });

                    onRightDiv.prepend(btn);
                    return btn;
                };

                const updateState = () => {
                    // 버튼이 아직 없으면 null, 있으면 요소
                    clearBtn = item.querySelector('.btn-input-clear');

                    const isInputFocused = document.activeElement === input;
                    // 버튼이 없으면 포커스도 없음
                    const isBtnFocused = clearBtn ? document.activeElement === clearBtn : false;
                    const hasValue = input.value && input.value.trim() !== '';

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

                    // [수정 포인트 2] 버튼 노출 조건 확인
                    const shouldShow = hasValue && (isInputFocused || isBtnFocused) && !isReadOnly && !isDisabled;

                    if (shouldShow) {
                        // 보여줘야 하는데 버튼이 아직 없다면 -> 지금 생성!
                        if (!clearBtn) {
                            clearBtn = createClearBtn();
                        }
                        clearBtn.style.display = 'inline-block';
                    } else {
                        // 숨겨야 하는데 버튼이 있다면 -> 숨김
                        if (clearBtn) {
                            clearBtn.style.display = 'none';
                        }
                    }
                };

                // 블러 핸들러 (버튼 클릭과 충돌 방지용 지연)
                const handleBlur = () => {
                    setTimeout(updateState, 150);
                };

                // 초기 이벤트 바인딩 (인풋 대상)
                input.addEventListener('input', updateState);
                input.addEventListener('focus', updateState);
                input.addEventListener('blur', handleBlur);

                // 최초 실행 (값이 미리 채워져 있는 경우 등을 대비)
                updateState();
            });
        });
    },
};

// init
document.addEventListener('DOMContentLoaded', () => {
    uiFormfield.init();
});
