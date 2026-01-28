export function initFormOption() {
  initOptionToggle();
  initFileField();
}

// =================================================================
// Checkbox & Radio Toggle
function initOptionToggle() {
  const inputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');

  inputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      const target = e.currentTarget as HTMLInputElement;

      // aria-controls 속성이 있는 경우만 실행
      if (!target.getAttribute('aria-controls')) return;

      if (target.type === 'checkbox') {
        toggleCheckboxContent(target);
      } else if (target.type === 'radio') {
        toggleRadioContent(target);
      }
    });
  });
}

function toggleCheckboxContent(checkbox: HTMLInputElement) {
  const targetIds = checkbox.getAttribute('aria-controls');
  if (!targetIds) return;

  const ids = targetIds.split(' ');
  ids.forEach((id) => {
    const targetEl = document.getElementById(id);
    if (targetEl) {
      if (checkbox.checked) {
        targetEl.classList.add('is-active');
      } else {
        targetEl.classList.remove('is-active');
      }
    }
  });
}

function toggleRadioContent(radio: HTMLInputElement) {
  const name = radio.name;
  if (!name) return;

  // 같은 name을 가진 모든 라디오 버튼 순회
  const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
  radios.forEach((r) => {
    const rdi = r as HTMLInputElement;
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
}

// =================================================================
// File Input Logic
function initFileField() {
  // 이벤트 위임(Delegation)을 사용하여 동적으로 생성된 요소도 처리

  // [A] 파일 선택 시 파일명 표시 (공통)
  document.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    
    // .upload-hidden 또는 .upload-file 인 경우
    if (target.matches('.upload-hidden, .upload-file')) {
      let filename = '';
      if (target.files && target.files.length > 0) {
        filename = target.files[0].name;
      } else {
        // 파일 선택 취소 시 등
        filename = '선택된 파일 없음'; 
      }

      // 형제 요소 중 .upload-name 찾기
      const nameInput = target.parentElement?.querySelector('.upload-name') as HTMLInputElement;
      if (nameInput) {
        nameInput.value = filename;
      }

      // 파일 리스트 추가 로직 (.upload-file 인 경우만)
      if (target.classList.contains('upload-file') && target.files && target.files.length > 0) {
        addFileListItem(target.files[0].name);
      }
    }
  });

  // [B] 파일 필드 행 추가 (.file-plus 클릭)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const plusBtn = target.closest('.file-plus');

    if (plusBtn) {
      const fileGroup = document.querySelector('.file-group');
      if (fileGroup) {
        const fileIndex = new Date().getTime(); // Unique ID
        const html = `
          <div class="form-file">
            <input type="text" class="inp upload-name" title="선택된 파일명" value="선택된 파일 없음" readonly>
            <input type="file" name="exFileName_${fileIndex}" id="exFileName_${fileIndex}" class="upload-hidden">
            <label for="exFileName_${fileIndex}" class="upload-btn">파일찾기</label>
            <button type="button" class="btn btn-file file-minus" aria-label="파일 첨부 행 삭제">
              <span class="sr-only">삭제</span>
            </button>
          </div>
        `;
        fileGroup.insertAdjacentHTML('beforeend', html);
      }
    }
  });

  // [C] 파일 필드 행 삭제 (.file-minus 클릭)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const minusBtn = target.closest('.file-minus');

    if (minusBtn) {
      const formFile = minusBtn.closest('.form-file');
      formFile?.remove();
    }
  });

  // [D] 파일 리스트 아이템 삭제 (.file-del 클릭)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const delBtn = target.closest('.file-del');

    if (delBtn) {
      const listItem = delBtn.closest('li');
      listItem?.remove();
    }
  });
}

function addFileListItem(filename: string) {
  const fileList = document.querySelector('.file-list');
  if (fileList) {
    const html = `
      <li>
        <span>${filename}</span>
        <button type="button" class="file-del" aria-label="${filename} 파일 삭제">
          <span class="sr-only">삭제</span>
        </button>
      </li>
    `;
    fileList.insertAdjacentHTML('beforeend', html);
  }
}