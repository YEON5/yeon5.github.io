var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

$(function () {
    uiInit();
});

//호출 방식
function uiInit() {
    // gnbInit();
    // snbInit();
    // lnbInit();
    formInit();
    fileInit();
    tabInit();
    toggleInit();
    dropInit();
    accodiInit();
    SelectUiInit();
    stickyInit();
    AnchorInit();
    // scrollSpy();
    scrollCheck();
    // scrollAnimated();
    popoverInit();
    popupInit();
    progressInit();
    includeLayout();
    // headerPercent();
}

/*-------------------------------------------------------------------
	## Gnb / Snb (aside) / Lnb
-------------------------------------------------------------------*/
//Gnb
function gnbInit() {
    //pc gnb 전체 메뉴 열기
    const $header = $('.header');
    const $gnbDep = $('.gnb .depth2');
    const $gnbBg = $('.gnb-bg');

    $('.gnb').on('mouseenter focusin', function () {
        $header.addClass('is-active');
        $gnbDep.stop().slideDown('fast');
        $gnbBg.stop().slideDown('fast');
        $(this).attr('aria-expanded', 'true');
    });
    $('.gnb').on('mouseleave focusout', function () {
        $header.removeClass('is-active');
        $gnbDep.stop().slideUp('fast');
        $gnbBg.stop().slideUp('fast');
        $(this).attr('aria-expanded', 'false');
    });
}
//Snb
function snbInit() {
    //Aside - sidebar snb
    $(document).on('click', '.snb ul > li > a.has-expand', function (e) {
        e.preventDefault();
        if ($(this).parent().hasClass('is-active')) {
            $(this).parent().removeClass('is-active');
            $(this).parent().find('.depth2').stop().slideUp('fast');
        } else {
            $(this).parent().siblings().find('.depth2').stop().slideUp('fast');
            $(this).parent().siblings().removeClass('is-current is-active');
            $(this).parent().addClass('is-current is-active');
            $(this).parent().find('.depth2').stop().slideDown('fast');
        }
        //$(this).find('.ico-snb-fold.dep1')
    });

    //Aside - sidebar slide
    $(document).on('click', '.side-menu .menu-trigger', function (e) {
        const $ele = $('.wrapper').hasClass('side-closed');
        const $trigger = $('.menu-trigger').hasClass('is-active');
        const $wrapper = $('.wrapper');
        const $aside = $('.sidebar');
        if (!$ele && !$trigger) {
            $wrapper.addClass('side-closed');
            $aside.attr('aria-hidden', 'false');
            $(this).addClass('is-active').attr('aria-expanded', 'true');
        } else {
            $wrapper.removeClass('side-closed');
            $aside.attr('aria-hidden', 'true');
            $(this).removeClass('is-active').attr('aria-expanded', 'false');
        }
    });
}
//Lnb
function lnbInit() {
    $(document).on('click', '.lnb > ul > li', function (e) {
        const cls = $(this).hasClass('is-active');
        if (cls) {
            $(this).removeClass('is-active');
            $(this).find('.lnb-depth2').stop().slideUp(300);
            $(this).find('a').attr('aria-expanded', 'false');
        } else {
            $(this).siblings().find('.lnb-depth2').stop().slideUp(300);
            $(this).siblings().find('a').attr('aria-expanded', 'false');
            $(this).siblings().removeClass('is-active');
            $(this).addClass('is-active');
            $(this).find('.lnb-depth2').stop().slideDown(300);
            $(this).find('a').attr('aria-expanded', 'true');
        }
    });

    //focus 이동
    $(document).on('focusin', function (e) {
        //console.log(e.target);
        const $depth2 = $('.lnb-depth2');
        if (!$(e.target).parents().is('.lnb-depth2')) {
            $depth2.stop().slideUp(300);
            $depth2.parent().find('a').attr('aria-expanded', 'false');
            $depth2.parent().removeClass('is-active');
        }
    });

    //클릭 시
    //$(document).on('click', function(e){
    //	if ($('.lnb').has(e.target).length === 0){
    //		$(this).children().find('li').removeClass('is-active');
    //		$(this).children().find('.lnb-depth2').stop().slideUp(300);
    //		$(this).children().find('a').attr('aria-expanded', 'false');
    //	}
    //});
}

/*-------------------------------------------------------------------
	## Form
-------------------------------------------------------------------*/
function formInit() {
    textField();
    formOpionChange();
}

// input text value clear
function textField() {
    $('.form-field').each(function () {
        const $group = $(this);
        const $formInput = $group.find('.form-input');

        $formInput.each(function () {
            const $item = $(this);
            const $input = $item.find('input');

            // input이 없으면 패스
            if ($input.length === 0) return;

            // 삭제 버튼 생성 (필요할 때만 호출됨)
            const createClearBtn = function () {
                let $onRight = $item.find('.on-right');

                // .on-right가 없으면 생성
                if ($onRight.length === 0) {
                    $onRight = $('<div class="on-right"></div>');
                    $item.append($onRight);
                }

                // 버튼 및 내부 span 생성
                const $btn = $('<button type="button" class="btn-input-clear"><span>삭제</span></button>');

                // 생성된 버튼에 이벤트 바인딩
                $btn.on('focus', updateState);
                $btn.on('blur', handleBlur);
                $btn.on('click', function (e) {
                    e.preventDefault();
                    $input.val(''); // 값 비우기
                    updateState(); // 상태 갱신
                    $input.trigger('focus'); // 포커스 복구
                });

                $onRight.prepend($btn);
                return $btn;
            };

            // 버튼 유무 확인
            const updateState = function () {
                let $clearBtn = $item.find('.btn-input-clear');

                // 포커스 확인
                const isInputFocused = $input.is(':focus');
                // 버튼 및 포커스 상태 체크
                const isBtnFocused = $clearBtn.length > 0 && $clearBtn.is(':focus');
                const hasValue = $.trim($input.val()) !== '';

                const isReadOnly = $input.prop('readonly');
                const isDisabled = $input.prop('disabled');

                // 그룹 active 클래스 제어
                if (hasValue || isInputFocused || isBtnFocused) {
                    $group.addClass('active');
                } else {
                    // 그룹 내 다른 input들도 확인
                    let anyActive = false;
                    $group.find('input').each(function () {
                        if ($.trim($(this).val()) !== '' || $(this).is(':focus')) {
                            anyActive = true;
                            return false;
                        }
                    });

                    if (!anyActive) $group.removeClass('active');
                }

                // 버튼 노출 제어 (조건부 생성 포함)
                const btnShow = hasValue && (isInputFocused || isBtnFocused) && !isReadOnly && !isDisabled;

                if (btnShow) {
                    // 버튼 없는 경우 생성
                    if ($clearBtn.length === 0) {
                        $clearBtn = createClearBtn();
                    }
                    $clearBtn.css('display', 'inline-block');
                } else {
                    // 버튼 있으면 숨김
                    if ($clearBtn.length > 0) {
                        $clearBtn.hide();
                    }
                }
            };

            // 지연 실행
            const handleBlur = function () {
                setTimeout(updateState, 150);
            };

            // 초기 이벤트 바인딩
            $input.on('input focus', updateState);
            $input.on('blur', handleBlur);

            // 초기 상태 실행
            updateState();
        });
    });
}

// checkbox, radio 선택 시 컨텐츠 노출
function formOpionChange() {
    // checkbox, radio 상태 변경 이벤트 감시
    $(document).on('change', 'input[type="checkbox"], input[type="radio"]', function () {
        const $target = $(this);

        // aria-controls 속성이 있는 경우만 실행
        if ($target.attr('aria-controls')) {
            if ($target.is(':checkbox')) {
                toggleCheckboxContent($target);
            } else if ($target.is(':radio')) {
                toggleRadioContent($target);
            }
        }
    });
}

// 체크박스 로직
function toggleCheckboxContent($checkbox) {
    const targetIds = $checkbox.attr('aria-controls');
    if (!targetIds) return;

    // 공백으로 구분된 ID들을 배열로 만듦
    const ids = targetIds.split(' ');

    ids.forEach(targetId => {
        const $targetEl = $('#' + targetId);
        if ($checkbox.is(':checked')) {
            $targetEl.addClass('is-active');
        } else {
            $targetEl.removeClass('is-active');
        }
    });
}

// 라디오 로직
function toggleRadioContent($radio) {
    const name = $radio.attr('name');
    if (!name) return;

    $(`input[type="radio"][name="${name}"]`).each(function () {
        const $rdi = $(this);
        const targetId = $rdi.attr('aria-controls');

        if (targetId) {
            const $targetEl = $('#' + targetId);
            if ($rdi.is(':checked')) {
                $targetEl.addClass('is-active');
            } else {
                $targetEl.removeClass('is-active');
            }
        }
    });
}

/*-------------------------------------------------------------------
	## File Functions
-------------------------------------------------------------------*/
function fileInit() {
    fileField();
    fileAttach();
}

// Input - file : upload input 제어 (행 추가)
function fileField() {
    // 파일 선택 시 파일명 삽입 (동적 생성된 요소에도 대응)
    $(document).on('change', '.upload-hidden', function () {
        const filename = '';
        if (window.FileReader) {
            filename = $(this)[0].files.length > 0 ? $(this)[0].files[0].name : '선택된 파일 없음';
        } else {
            filename = $(this).val().split('/').pop().split('\\').pop();
        }
        $(this).siblings('.upload-name').val(filename);
    });

    // 파일 필드 추가
    $('.file-plus').on('click', function (e) {
        const $group = $('.file-group');
        const fileIndex = new Date().getTime(); // 중복 방지를 위한 고유 ID 생성 (타임스탬프)
        const fileHtml = '<div class="form-file">' + '<input type="text" class="inp upload-name" title="선택된 파일명" value="선택된 파일 없음" readonly>' + '<input type="file" name="exFileName_' + fileIndex + '" id="exFileName_' + fileIndex + '" class="upload-hidden">' + '<label for="exFileName_' + fileIndex + '" class="upload-btn">파일찾기</label>' + '<button type="button" class="btn btn-file file-minus" aria-label="파일 첨부 행 삭제">' + '<span class="sr-only">삭제</span>' + '</button>' + '</div>';
        $group.append(fileHtml);
    });

    // 삭제 버튼 이벤트 (동적 생성 대응)
    $(document).on('click', '.file-minus', function () {
        $(this).closest('.form-file').remove();
    });
}

// Input - file : 파일명 하단 리스트 추가
function fileAttach() {
    $(document).on('change', '.upload-file', function () {
        const filename = '';
        if (window.FileReader) {
            filename = $(this)[0].files.length > 0 ? $(this)[0].files[0].name : '';
        } else {
            filename = $(this).val().split('/').pop().split('\\').pop();
        }

        if (filename !== '') {
            // 상단 input에 파일명 표시
            $(this).siblings('.upload-name').val(filename);

            // 하단 리스트에 추가 (삭제 버튼에 파일명 label 추가하여 접근성 향상)
            const listHtml = '<li>' + '<span>' + filename + '</span>' + '<button type="button" class="file-del" aria-label="' + filename + ' 파일 삭제">' + '<span class="sr-only">삭제</span>' + '</button>' + '</li>';

            $('.file-list').append(listHtml);
        }
    });

    // 리스트 삭제 버튼 이벤트
    $(document).on('click', '.file-del', function () {
        $(this).closest('li').remove();
    });
}

/*-------------------------------------------------------------------
	## Tab
-------------------------------------------------------------------*/
function tabInit() {
    $(document).on('click', '[class^="tab"] .tab-nav button', function (e) {
        e.preventDefault();
        const $selectedBtn = $(this);
        const $selectedLi = $selectedBtn.parent('li');
        
        if ($selectedLi.hasClass('is-active')) return;
        const targetId = $selectedBtn.attr('aria-controls');
        const $targetPanel = $('#' + targetId);

        // tab nav
        $selectedLi.addClass('is-active').siblings().removeClass('is-active');
        // 접근성
        $selectedBtn.attr('aria-selected', 'true');
        $selectedLi.siblings().find('button').attr('aria-selected', 'false');

        // tab content
        $targetPanel.addClass('is-active')
            .siblings('.tab-cont').removeClass('is-active');
        // 접근성
        $targetPanel.attr('aria-hidden', 'false')
            .siblings('.tab-cont').attr('aria-hidden', 'true');

        // 정렬 함수 호출 
        if (typeof moveScrollToLeft === 'function') {
            moveScrollToLeft($selectedLi);
        }

        // Sticky 탭 전환 시 스크롤 위치 보정
        scrollCorrection($selectedBtn);
    });
}
// tab 좌측 정렬 이동
function moveScrollToLeft($targetLi) {
    const $ul = $targetLi.parent();
    
    // 여백 설정 (inner 패딩값 확인)
    const offset = 20; 
    const newScrollPos = $ul.scrollLeft() + $targetLi.position().left - offset;
    $ul.stop().animate({ scrollLeft: newScrollPos }, 200);
}
// tab 가운데 정렬 이동
function moveScrollToCenter($targetLi) {
    const $ul = $targetLi.parent();
    const ulWidth = $ul.outerWidth();
    const liWidth = $targetLi.outerWidth();
    const currentScroll = $ul.scrollLeft();
    const liOffsetLeft = $targetLi.position().left;
    const newScrollPos = currentScroll + liOffsetLeft - (ulWidth / 2) + (liWidth / 2);

    $ul.stop().animate({ scrollLeft: newScrollPos }, 200);
}

// tab-nav 고정일때 탭전환 시 스크롤 top
function scrollCorrection($btn) {
    const $tabWrap = $btn.closest('.tab'); 
    const $stickyNav = $btn.closest('.tab-nav');
    
    // 탭 컨텐츠 시작 위치 (문서 전체 기준)
    const contentStartTop = $tabWrap.offset().top; 
    
    // 고정 헤더 높이 계산 (SCSS의 top: 값을 가져옴)
    const cssTop = parseFloat($stickyNav.css('top')) || 0; 
    
    // 네비게이션 자체 높이
    const navHeight = $stickyNav.outerHeight();

    // 스크롤 위치 (navHeight 유무 확인)
    const targetScroll = contentStartTop - cssTop - navHeight;

    // 현재 스크롤 위치
    const currentScroll = $(window).scrollTop();
    
    // 디버깅용
    // console.log('탭 위치:', contentStartTop, 'CSS Top:', cssTop, 'Nav높이:', navHeight, '목표:', targetScroll);

    // 스크롤이 목표 지점보다 더 내려가 있을 때만 끌어올림 (약간의 오차범위 5px 허용)
    if (currentScroll > targetScroll + 5) {
        window.scrollTo({
            top: targetScroll,
            behavior: 'auto' 
        });
    }
}

/*-------------------------------------------------------------------
	## Toggle (drop menu, contents toggle)
-------------------------------------------------------------------*/
function toggleInit() {
    $(document).on('click', '.btn-toggle', function (e) {
        e.preventDefault();
        const $currentDropdown = $(this).closest('.dropdown');
        
        // 현재 눌린 것이 활성화 상태인지 확인
        if ($currentDropdown.hasClass('is-active')) {
            closeToggle($currentDropdown);
        } else {
            closeAllToggles();
            openToggle($currentDropdown);
        }
    });

    // 외부 클릭 및 스크롤 이벤트 바인딩
    bindGlobalEvents();
}

// 토글 열기
function openToggle($ele) {
    $ele.addClass('is-active');
    $ele.find('.btn-toggle').attr('aria-expanded', 'true');
    $ele.find('.drop-list').attr('aria-hidden', 'false');
    $ele.find('.item-body').stop().slideDown(200);
}

// 토글 닫기
function closeToggle($ele) {
    $ele.removeClass('is-active');
    $ele.find('.btn-toggle').attr('aria-expanded', 'false');
    $ele.find('.drop-list').attr('aria-hidden', 'true');
    $ele.find('.item-body').stop().slideUp(200);
}

// 모든 활성화된 토글 닫기
function closeAllToggles() {
    $('.dropdown.is-active').each(function () {
        closeToggle($(this));
    });
}

// 외부 클릭 & 스크롤 시 닫기
function bindGlobalEvents() {
    // 외부 클릭 시 닫기
    $(document).on('click', function (e) {
        // 클릭된 요소가 .dropdown 내부가 아니라면 닫기
        if (!$(e.target).closest('.dropdown').length) {
            closeAllToggles();
        }
    });

    // 스크롤 시 닫기
    $(window).add('.main').on('scroll', function () {
        if ($('.dropdown.is-active').length) {
            closeAllToggles();
        }
    });
}


function dropInit() {
    $(document).on('click', '.btn-dropdown', function (e) {
        e.preventDefault();
        const $ele = $(this).closest('.dropdowns');
        const isActive = $ele.hasClass('is-active');

        // 상태 토글 (현재 활성이면 닫고, 아니면 열기)
        if (isActive) {
            $ele.removeClass('is-active');
            $ele.find('.btn-dropdown').attr('aria-expanded', 'false');
            $ele.find('.drop-body').attr('aria-hidden', 'true');
        } else {
            $ele.addClass('is-active');
            $ele.find('.btn-dropdown').attr('aria-expanded', 'true');
            $ele.find('.drop-body').attr('aria-hidden', 'false');
        }
    });
}

/*-------------------------------------------------------------------
	## Accodion
-------------------------------------------------------------------*/
function accodiInit() {
    $(document)
        .off('click', '.btn-expand')
        .on('click', '.btn-expand', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $btn = $(this);
            const $currentItem = $btn.closest('.accordion');
            const $wrapper = $currentItem.closest('.accordion-wrap, .inner-accordion'); 

            // data-accordion="single" 속성이 있으면 하나만 열기 모드
            const isSingleOpen = $wrapper.data('accordion') === 'single';

            if ($currentItem.hasClass('is-active')) {
                closeItem($currentItem);
            } else {
                if (isSingleOpen) {
                    // 열린 것만 찾아서 닫기
                    $currentItem.siblings('.accordion.is-active').each(function() {
                        closeItem($(this));
                    });
                }
                openItem($currentItem);
            }
        });
}

// 아코디언 열기
function openItem($item) {
    const $btn = $item.children('.item-head').find('.btn-expand');
    const $body = $item.children('.item-body');

    $item.addClass('is-active');
    $btn.attr('aria-expanded', 'true');
    $body.stop().slideDown(350);
}
// 아코디언 닫기
function closeItem($item) {
    const $btn = $item.children('.item-head').find('.btn-expand');
    const $body = $item.children('.item-body');

    $item.removeClass('is-active');
    $btn.attr('aria-expanded', 'false');
    $body.stop().slideUp(350);
}

/*-------------------------------------------------------------------
	## Select box (dropdown/bottom)
-------------------------------------------------------------------*/
function SelectUiInit() {
    const $body = $('body');
    const MOBILE_BREAKPOINT = 768;

    // 초기화 tabindex
    $('.select-layer').attr('tabindex', '-1');

    // select trigger
    $(document).on('click', '[data-select-trigger]', function () {
        const $thisBox = $(this).closest('[data-select]');
        const isActive = $thisBox.hasClass('is-active');

        $('[data-select]').not($thisBox).removeClass('is-active')
            .find('[data-select-trigger]').attr('aria-expanded', 'false');

        if (isActive) {
            closeSelect($thisBox);
        } else {
            openSelect($thisBox);
        }
    });

    // 선택 목록
    $(document).on('click', '.select-layer .option', function () {
        const $btn = $(this);
        const $box = $btn.closest('[data-select]');
        const $textTarget = $box.find('.select-value');
        const $hiddenInput = $box.find('.select-hidden-input'); // 히든 인풋 찾기

        const showText = $btn.text();       // 화면에 보여줄 텍스트
        const realValue = $btn.data('value'); // 서버로 보낼 실제 값

        // 1. 화면 텍스트 업데이트
        $textTarget.text(showText);
        $textTarget.addClass('is-selected'); // (옵션) 색상 변경 등을 위한 클래스

        // 2. 히든 인풋 값 업데이트 (폼 전송용)
        // 값이 변경되었음을 알리기 위해 change 트리거도 발생시킴 (유효성 검사 등 연동)
        $hiddenInput.val(realValue).trigger('change');

        // 3. 활성화 스타일 업데이트
        $btn.closest('.select-list').find('.option').removeClass('current').attr('aria-selected', 'false');
        $btn.addClass('current').attr('aria-selected', 'true');

        closeSelect($box);
        $box.find('[data-select-trigger]').focus();
    });

    // [Close]
    $(document).on('click', '[data-select-close]', function () {
        const $box = $(this).closest('[data-select]');
        closeSelect($box);
        $box.find('[data-select-trigger]').focus();
    });

    // [Outside & Dim Click]
    $(document).on('click', function (e) {
        const $target = $(e.target);

        if (!$target.closest('[data-select]').length) {
            $('[data-select].is-active').each(function () {
                closeSelect($(this));
            });
        }
        if ($target.hasClass('select-layer')) {
            closeSelect($target.closest('[data-select]'));
        }
    });

    // ====================================================
    // 2. 접근성 (키보드)
    // ====================================================
    $(document).on('keydown', function (e) {
        const $openBox = $('[data-select].is-active');
        if (!$openBox.length) return;

        if (e.keyCode === 27) { // ESC
            closeSelect($openBox);
            $openBox.find('[data-select-trigger]').focus();
            return;
        }

        if (e.keyCode === 9) { // TAB
            if (window.innerWidth > MOBILE_BREAKPOINT) return;

            const $layer = $openBox.find('.select-layer');
            const $focusables = $layer.find('button, a, input, [tabindex]:not([tabindex="-1"])');

            if (!$focusables.length) return;

            const $first = $focusables.first();
            const $last = $focusables.last();
            const $target = $(e.target);

            // 레이어 자체 -> 첫 요소
            if ($target.is($layer)) {
                e.preventDefault();
                if (e.shiftKey) $last.focus();
                else $first.focus();
                return;
            }
            // 이탈 -> 복귀
            if ($target.closest('.select-layer').length === 0) {
                e.preventDefault();
                $layer.focus();
                return;
            }
            // 순환
            if (e.shiftKey) {
                if ($target.is($first)) {
                    e.preventDefault();
                    $last.focus();
                }
            } else {
                if ($target.is($last)) {
                    e.preventDefault();
                    $first.focus();
                }
            }
        }
    });

    // ====================================================
    // 3. 제어 함수
    // ====================================================
    function openSelect($box) {
        $box.addClass('is-active');
        $box.find('[data-select-trigger]').attr('aria-expanded', 'true');

        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            $body.css('overflow', 'hidden');
            setTimeout(function() {
                // 스크립트로 tabindex를 넣었으므로 focus가 잘 먹힘
                $box.find('.select-layer').focus(); 
            }, 350);
        }
    }

    function closeSelect($box) {
        $box.removeClass('is-active');
        $box.find('[data-select-trigger]').attr('aria-expanded', 'false');
        $body.css('overflow', '');
    }
}


/*-------------------------------------------------------------------
	## Sticky
-------------------------------------------------------------------*/
function stickyInit() {
    //Click scroll top button
    $(window).on('scroll', function (e) {
        const $btnScroll = $('.btn-scrollTop');
        if ($(this).scrollTop() > 0) {
            $btnScroll.addClass('is-active');
        } else {
            $btnScroll.removeClass('is-active');
        }
    });
    $(document).on('click', '.btn-scrollTop', function (e) {
        e.preventDefault();
        $('html').animate(
            {
                scrollTop: 0,
            },
            300,
        );
    });
}

/*-------------------------------------------------------------------
	## AnchorNav
-------------------------------------------------------------------*/
function AnchorInit() {
    const $anchorWrap = $('.anchor-wrap');
    if (!$anchorWrap.length) return;

    const $ul = $anchorWrap.find('.anchor-nav > ul');
    const $triggers = $ul.find('a, button');
    if (!$triggers.length) return;

    $triggers.on('click', function (e) {
        const $target = $(this);
        const rawId = $target.attr('href') || $target.data('target');

        const isAnchor =
            rawId &&
            rawId.startsWith('#') &&
            rawId.length > 1 &&
            rawId !== '#!';

        if (isAnchor) {
            const $section = $(rawId);
            if (!$section.length) return;

            e.preventDefault();

            const offset = getScrollOffset($anchorWrap);
            const y = $section.offset().top - offset + 1;

            $('html, body').stop().animate({ scrollTop: y }, 500);
        }

        updateActive($target, $ul);
        alignLeft($target, $ul, $anchorWrap);
    });

    // 앵커 컨텐츠 관계 없이 fixed 필요시 호출
    // StickyAnchor();
}

// active 처리 (a / button 공통)
function updateActive($target, $ul) {
    $ul.find('a, button').removeClass('is-active').removeAttr('aria-current');
    $target.addClass('is-active').attr('aria-current', 'location');
}

// 모바일 가로 스크롤 왼쪽 정렬
function alignLeft($target, $ul) {
    const $li = $target.closest('li');
    if (!$li.length) return;

    const ulEl = $ul[0];
    const liEl = $li[0];

    const currentScroll = ulEl.scrollLeft;

    // viewport 기준 위치
    const liRect = liEl.getBoundingClientRect();
    const ulRect = ulEl.getBoundingClientRect();

    // ul padding-left 값
    const ulPaddingLeft = parseInt(
        window.getComputedStyle(ulEl).paddingLeft,
        10
    ) || 0;

    // ul content 시작점 기준 계산
    const targetLeft =
        currentScroll +
        (liRect.left - ulRect.left) -
        ulPaddingLeft;

    ulEl.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
    });
}

// offset
function getScrollOffset($anchorWrap) {
    const headerHeight = $('.header').outerHeight() || 0;
    const anchorHeight = $anchorWrap.outerHeight() || 0;
    return headerHeight + anchorHeight;
}

// --------------------------------------------------------
// anchor tab (anchor-wrap fixed 처리)
function StickyAnchor() {
    const $window = $(window);
    const $anchorWrap = $('.anchor-wrap');

    // 앵커가 없으면 실행 중지
    if (!$anchorWrap.length) return;

    // 앵커 초기 위치
    const anchorInitialTop = $anchorWrap.offset().top;

    // 상단 헤더 높이
    const headerHeight = $('.header').outerHeight() || 0;

    $window.on('scroll', function () {
        const scrollTop = $window.scrollTop();

        if (scrollTop >= anchorInitialTop - headerHeight) {
            if (!$anchorWrap.hasClass('is-fixed')) {
                $anchorWrap.addClass('is-fixed');
            }
        } else {
            if ($anchorWrap.hasClass('is-fixed')) {
                $anchorWrap.removeClass('is-fixed');
            }
        }
    });
}

/*-------------------------------------------------------------------
	## Scrollspy
-------------------------------------------------------------------*/
function scrollSpy() {
    const $anchorWrap = $('.anchor-wrap');
    const $nav = $anchorWrap.find('.anchor-nav');
    const $links = $nav.find('a, button');
    
    // 2. 링크들과 매칭되는 실제 섹션들을 동적으로 수집
    let $sections = $(); 

    $links.each(function() {
        const targetId = $(this).attr('href') || $(this).data('target');
        
        // [수정 1] 유효성 검사 강화
        // - 값이 없거나, '#'만 있거나, '#!'로 시작하는 등 잘못된 선택자 제외
        if (!targetId || targetId === '#' || targetId.indexOf('#!') > -1 || !targetId.startsWith('#')) {
            return; // 건너뛰기
        }

        // [수정 2] 문법 에러 방지를 위한 try-catch 추가
        try {
            const $target = $(targetId);
            if ($target.length) {
                $sections = $sections.add($target);
            }
        } catch (error) {
            // #123, #! 등 jQuery 선택자로 쓸 수 없는 문자열은 조용히 무시
            // console.warn('유효하지 않은 선택자:', targetId); 
        }
    });

    // --------------------------------------------------------
    // 클릭 이벤트 핸들러
    // --------------------------------------------------------
    $links.on('click', function(e) {
        e.preventDefault();
        
        const targetId = $(this).attr('href') || $(this).data('target');

        // [수정 3] 클릭 시에도 안전장치 추가
        if (!targetId || targetId === '#' || targetId.indexOf('#!') > -1 || !targetId.startsWith('#')) {
            return;
        }

        try {
            const $target = $(targetId);
            
            // 오프셋 계산
            const headerHeight = $('.header').outerHeight() || 0;
            const anchorHeight = $anchorWrap.outerHeight() || 0;
            const offset = headerHeight + anchorHeight; 

            if ($target.length) {
                $('html, body').stop().animate({
                    scrollTop: $target.offset().top - offset + 2
                }, 500);
                
                updateActiveState($(this));
            }
        } catch (error) {
            console.log('이동할 수 없는 타겟입니다:', targetId);
        }
    });

    // --------------------------------------------------------
    // 스크롤 감지 핸들러
    // --------------------------------------------------------
    $(window).on('scroll', function() {
        if (!$sections.length) return;

        const scrollTop = $(window).scrollTop();
        const headerHeight = $('.header').outerHeight() || 0;
        const anchorHeight = $anchorWrap.outerHeight() || 0;
        const checkPoint = scrollTop + headerHeight + anchorHeight + 10; 

        $sections.each(function() {
            const $this = $(this);
            const top = $this.offset().top;
            const bottom = top + $this.outerHeight();

            if (checkPoint >= top && checkPoint < bottom) {
                const currentId = '#' + $this.attr('id');
                
                const $activeLink = $links.filter(function() {
                    const linkTarget = $(this).attr('href') || $(this).data('target');
                    return linkTarget === currentId;
                });
                
                if (!$activeLink.hasClass('is-active')) {
                    updateActiveState($activeLink);
                }
            }
        });
    });

    // 공통 함수 (기존 유지)
    function updateActiveState($targetLink) {
        $links.removeClass('is-active').removeAttr('aria-current');
        $targetLink.addClass('is-active').attr('aria-current', 'location');
        alignActiveTabLeft($targetLink);
    }

    function alignActiveTabLeft($target) {
        if (!$target.length) return;
        
        const $ul = $nav.find('ul, div'); 
        const $li = $target.parent(); 
        
        // [설정] 왼쪽에서 띄우고 싶은 간격 (px)
        const paddingLeft = 20; 

        if ($ul.length) {
            const scrollLeft = $ul.scrollLeft();
            const eleOffsetLeft = $li.position().left; 
            
            // 기본 위치 계산 (현재 스크롤 + 화면 내 요소 위치)
            // 여기서 paddingLeft만큼 빼주면 그만큼 덜 가서 멈춤
            let targetScrollLeft = scrollLeft + eleOffsetLeft - paddingLeft; 

            // 1. 첫 번째 아이템은 무조건 0으로 (맨 앞 여백이 CSS에 있다면 0이 깔끔함)
            if ($li.is(':first-child')) {
                targetScrollLeft = 0;
            }
            // 2. 계산 결과가 0보다 작으면 0으로 고정 (음수 방지)
            else if (targetScrollLeft < 0) {
                targetScrollLeft = 0;
            }

            $ul.stop().animate({ scrollLeft: targetScrollLeft }, 300);
        }
    }
}

/*-------------------------------------------------------------------
	## Scroll Check : Scroll Up/Down Custom Event (스크롤 상태 및 위치 확인)
-------------------------------------------------------------------*/
function scrollCheck() {
    const $window = $(window);
    const $body = $('body');
    const $document = $(document);

    let oldScrTop = $window.scrollTop();
    let scrollTimer;
    let resizeTimer;

    // 스크롤 상태 업데이트 함수 (처음/마지막 체크)
    const updateScrollStatus = currentTop => {
        const winHeight = $window.outerHeight();
        const docHeight = $document.height();

        // 최상단 체크
        const isFirst = currentTop <= 0;
        $body.toggleClass('is-scrollFirst', isFirst);

        // 최하단 체크
        const isLast = currentTop + winHeight >= docHeight - 1;
        $body.toggleClass('is-scrollLast', isLast);
    };

    // 초기 실행
    updateScrollStatus(oldScrTop);

    // scroll Event
    $window.off('scroll.customEvent').on('scroll.customEvent', function () {
        const curScrTop = $window.scrollTop();

        // 방향 감지
        if (curScrTop > oldScrTop) {
            // scroll down
            if (!$body.hasClass('is-scrollDown')) {
                $body.addClass('is-scrollDown').removeClass('is-scrollUp');
                $window.trigger('scrollDown');
            }
        } else if (curScrTop < oldScrTop) {
            // scroll up
            if (!$body.hasClass('is-scrollUp')) {
                $body.addClass('is-scrollUp').removeClass('is-scrollDown');
                $window.trigger('scrollUp');
            }
        }

        // 상태 업데이트 (처음/마지막)
        updateScrollStatus(curScrTop);

        // 스크롤 종료 감지
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            $window.trigger('scrollEnd');
            // 방향 클래스 유지 여부에 따라 아래 코드 추가/삭제 가능
            // $body.removeClass('is-scrollUp is-scrollDown');
        }, 150);

        oldScrTop = curScrTop;
    });

    // resize
    $window.off('resize.customEvent').on('resize.customEvent', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateScrollStatus($window.scrollTop()); // 리사이즈 상태 재체크
            $window.trigger('resizeEnd');
        }, 150);
    });
}

$(window).on('scrollEnd', function () {
    console.log('스크롤이 멈췄습니다.');
});

$(window).on('scrollDown', function () {
    $('.header').addClass('hide'); // 스크롤 내릴 때 헤더 숨기기 (css 추가 시)
});

/*-------------------------------------------------------------------
	## Scroll animate
-------------------------------------------------------------------*/
function scrollAnimated() {
    //Scroll animate
    var $eleAnimateSec = $('.ui-animate');
    var clsAnimate = 'animated';
    var percent = 0.3;
    var time = null;
    var winHOld = -1;
    var direction;

    function action() {
        var winH = $(window).scrollTop() + $(window).outerHeight();
        var winH2 = $(window).scrollTop();
        if (winHOld > winH2) {
            direction = 'up';
        }
        if (winHOld < winH2) {
            direction = 'down';
        }
        winHOld = winH2;
        $eleAnimateSec.each(function () {
            var $this = $(this);
            var objH = $this.offset().top + $this.outerHeight() * percent;
            var objH2 = $this.offset().top;
            //console.log(direction, winH2, objH2);

            //내릴때 실행
            if (winH > objH && direction == 'down') {
                $this.addClass(clsAnimate).addClass($this.attr('data-animate'));
                $this.find('.to-animate').each(function () {
                    $(this).addClass(clsAnimate).addClass($(this).attr('data-duration')).addClass($(this).attr('data-animate'));
                });
            }
            //올릴때 실행
            if (winH2 < objH2 && direction == 'up') {
                $this.addClass(clsAnimate).addClass($this.attr('data-animate'));
                $this.find('.to-animate').each(function () {
                    $(this).addClass(clsAnimate).addClass($(this).attr('data-duration')).addClass($(this).attr('data-animate'));
                });
            }
            //올렸을때 초기화
            if (winH < objH2) {
                $this.removeClass(clsAnimate).removeClass($this.attr('data-animate'));
                $this.find('.to-animate').each(function () {
                    $(this).removeClass(clsAnimate).removeClass($(this).attr('data-duration')).removeClass($(this).attr('data-animate'));
                });
            }
            //내렸을때 초기화
            if (winH2 > objH2 + $this.outerHeight() * 1) {
                $this.removeClass(clsAnimate).removeClass($this.attr('data-animate'));
                $this.find('.to-animate').each(function () {
                    $(this).removeClass(clsAnimate).removeClass($(this).attr('data-duration')).removeClass($(this).attr('data-animate'));
                });
            }
        });
    }
    $(window).on('scroll', function () {
        clearTimeout(time);
        time = setTimeout(function () {
            action();
        });
    });
    action();
}

/*-------------------------------------------------------------------
	## Popover
-------------------------------------------------------------------*/
function popoverInit() {
    // data-popover-trigger 열기
    $(document).on('click', '[data-popover-trigger]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        const targetId = $btn.attr('aria-controls');
        const $popover = $(`#${targetId}`);
        const isExpanded = $btn.attr('aria-expanded') === 'true';

        if (isExpanded) {
            closePopover($popover);
        } else {
            closeAllPopovers();
            openPopover($btn, $popover);
        }
    });

    // 버튼 닫기
    $(document).on('click', '[data-popover-close]', function (e) {
        e.preventDefault();
        const $popover = $(this).closest('.popover-inner');
        closePopover($popover);
    });

    // 외부 영역(바닥) 닫기
    $(document).on('click', function (e) {
        const $target = $(e.target);
        // 팝오버 내부도 아니고, 트리거 버튼도 아닐 때
        if (!$target.closest('.popover-inner').length && !$target.closest('[data-popover-trigger]').length) {
            closeAllPopovers();
        }
    });

    // 스크롤 시 닫기
    $(window)
        .add('.container')
        .on('scroll', function () {
            if ($('.popover-inner:visible').length) {
                closeAllPopovers();
            }
        });
}
// 팝오버 열기
function openPopover($btn, $popover) {
    $btn.attr('aria-expanded', 'true');
    $btn.closest('.popover').addClass('is-active');
    $popover.stop().fadeIn(300).attr('aria-hidden', 'false');
}
// 팝오버 닫기
function closePopover($popover) {
    const id = $popover.attr('id');
    const $btn = $(`[aria-controls="${id}"]`);

    $btn.attr('aria-expanded', 'false');
    $btn.closest('.popover').removeClass('is-active');
    $popover.stop().fadeOut(300).attr('aria-hidden', 'true');

    // 닫힌 후 버튼으로 포커스 이동
    $btn.focus();
}
// 팝오버 전체 닫기
function closeAllPopovers() {
    $('.popover-inner:visible').each(function () {
        closePopover($(this));
    });
}

/*-------------------------------------------------------------------
	## Popup 
-------------------------------------------------------------------*/
// 스크롤 위치 저장용 변수
let savedScrollTop = 0;

function popupInit() {
    // popup open
    $(document).on('click', '[data-popup-trigger]', function () {
        const targetId = $(this).data('popup-trigger');
        const $opener = $(this);
        popupOpen(targetId, $opener);
    });


    // ============================================================
    // 외부 팝업 동적 로드 (AJAX)
    $(document).on('click', '[data-popup-load]', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const url = $btn.data('popup-load'); // 파일 경로

        // AJAX 통신
        $.ajax({
            url: url,
            dataType: 'html',
            success: function (htmlData) {
                const $popupElement = $(htmlData);
                
                // 외부 팝업임을 표시하기 위해 속성 추가 (닫을 때 삭제하기 위함)
                $popupElement.attr('data-dynamic', 'true');

                // body에 추가
                $('body').append($popupElement);

                // 팝업 id 가져옴
                const targetId = $popupElement.attr('id');

                setTimeout(function() {
                    popupOpen(targetId, $btn);
                }, 50);
            },
            error: function () {
                alert('팝업 파일을 불러오는데 실패했습니다.');
            }
        });
    });
    // ============================================================

    // popup close (버튼)
    $(document).on('click', '[data-popup-close]', function () {
        const $popWrap = $(this).closest('.popup-wrap');
        popupClose($popWrap.attr('id'));
    });

    // popup open (dim)
    $(document).on('click', '.popup-wrap', function (e) {
        if ($(e.target).is('.popup-wrap')) {
            popupClose($(this).attr('id'));
        }
    });

    // popup open (esc key)
    $(document).on('keydown', function (e) {
        if (e.which === 27) {
            const $topPopup = $('.popup-wrap.is-active').last();
            if ($topPopup.length > 0) {
                popupClose($topPopup.attr('id'));
            }
        }
    });
}

// popup open
function popupOpen(id, $opener) {
    const $popWrap = $('#' + id);
    if ($popWrap.length === 0) return;

    // 포커스 복귀 지점
    const $trigger = $opener || $(document.activeElement);
    $popWrap.data('opener', $trigger);

    // 활성화
    $popWrap.addClass('is-active').attr('aria-hidden', 'false');

    // Z-Index
    const baseZIndex = 1002;
    const activeCount = $('.popup-wrap.is-active').length;
    $popWrap.css('z-index', baseZIndex + activeCount);

    // 스크롤 잠금
    if (activeCount === 1) scrollOn();

    // 포커스 이동 (브라우저 렌더링 시간 고려하여 약간 지연)
    setTimeout(function () {
        $popWrap.find('.popup').attr('tabindex', '-1').focus();
    }, 50);

    // 접근성
    $popWrap.off('keydown.popupFocus').on('keydown.popupFocus', function (e) {
        handleFocusTrap(e, $popWrap);
    });
}

// popup close
function popupClose(id) {
    const $popWrap = $('#' + id);
    if ($popWrap.length === 0) return;

    // 비활성화
    $popWrap.removeClass('is-active').attr('aria-hidden', 'true').removeAttr('style');

    // 스크롤 잠금 해제 (남은 팝업이 없을 때만)
    if ($('.popup-wrap.is-active').length === 0) scrollOff();

    // 포커스 복귀
    const $opener = $popWrap.data('opener');
    if ($opener && $opener.length > 0) $opener.focus();

    $popWrap.off('keydown.popupFocus');


    // ============================================================
    // 동적으로 불러온 팝업이면 DOM에서 완전히 삭제
    if ($popWrap.attr('data-dynamic') === 'true') {
        // CSS transition 시간(예: 0.3s) 후 삭제
        setTimeout(function() {
            $popWrap.remove();
        }, 300); 
    }
    // ============================================================
}

// focus 이탈 막기 (접근성)
function handleFocusTrap(e, $popWrap) {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    if (!isTabPressed) return;

    const $focusableEls = $popWrap.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="-1"], [contenteditable]');
    const $firstEl = $focusableEls.first();
    const $lastEl = $focusableEls.last();

    if (e.shiftKey) {
        if ($(document.activeElement).is($firstEl) || $(document.activeElement).is($popWrap.find('.popup'))) {
            e.preventDefault();
            $lastEl.focus();
        }
    } else {
        if ($(document.activeElement).is($lastEl)) {
            e.preventDefault();
            $firstEl.focus();
        }
    }
}

// scroll on
function scrollOn() {
    savedScrollTop = window.scrollY || $(window).scrollTop();

    $('body').css('top', -savedScrollTop + 'px').addClass('scrollOff');

    // 접근성
    const $wrapper = $('.wrapper');
    if ($wrapper.length) $wrapper.attr('aria-hidden', 'true');
}

// scroll off 
function scrollOff() {
    const $body = $('body');
    const $html = $('html, body');

    $html.css('scroll-behavior', 'auto');
    $body.removeClass('scrollOff').css('top', '');
    window.scrollTo(0, savedScrollTop);

    // 접근성
    const $wrapper = $('.wrapper');
    if ($wrapper.length) $wrapper.removeAttr('aria-hidden');

    // scroll-behavior 속성 복구
    setTimeout(function () {
        $html.css('scroll-behavior', '');
    }, 10);
}
// scroll on,off
// function scrollOn() {
//     const $body = $('body');
//     const $wrapper = $('.wrapper');
//     setTimeout(function () {
//         $body.addClass('scrollOff');
//         $wrapper.attr('aria-hidden', 'true');
//     }, 50);
// }
// function scrollOff() {
//     const $body = $('body');
//     const $wrapper = $('.wrapper');
//     setTimeout(function () {
//         $body.removeClass('scrollOff');
//         $wrapper.removeAttr('aria-hidden');
//     }, 50);
// }

/*-------------------------------------------------------------------
	## Loading - 호출예시: 로딩실행 loading('open'); / 로딩닫기 loading('close');
-------------------------------------------------------------------*/
function loading(action, callback) {
    const $body = $('body');
    const $eleModule = $('.loading-wrap');
    //실행
    if (action == 'open') {
        $eleModule.removeAttr('hidden');
        setTimeout(function () {
            $eleModule.addClass('is-active');
        });
        $eleModule.one('transitionend', function () {
            if ($eleModule.hasClass('is-active')) {
                if (callback) {
                    callback;
                }
            }
        });
        setTimeout(function () {
            //$dim.removeClass('is-active');
            $body.addClass('scrollOff');
        }, 50);
    }
    //닫기
    else if (action == 'close') {
        $eleModule.removeClass('is-active');
        $eleModule.one('transitionend', function () {
            if (!$(this).hasClass('is-active')) {
                $eleModule.attr('hidden', 'hidden');
                if (callback) {
                    callback;
                }
            }
        });
        setTimeout(function () {
            //$dim.removeClass('is-active');
            $body.removeClass('scrollOff');
        }, 50);
    }
}

/*-------------------------------------------------------------------
	## Include HTML
-------------------------------------------------------------------*/
function includeLayout() {
    const $includeTargets = $('[data-include]');
    const loadPromises = [];

    $includeTargets.each(function () {
        const $this = $(this);
        const url = $this.data('include');

        const loadJob = new Promise((resolve) => {
            $this.load(url, function (response, status) {
                if (status === 'error') {
                    // 에러 처리
                } else {
                    $this.removeAttr('data-include');
                }
                resolve();
            });
        });
        loadPromises.push(loadJob);
    });

    // 공통 함수 호출 시!!
    Promise.all(loadPromises).then(() => {
        
        // 1. 헤더 관련 기능들 실행
        if (typeof gnbInit === 'function') gnbInit();   // GNB 메뉴
        if (typeof utilInit === 'function') utilInit(); // 로그인/회원가입 버튼 등

        // 2. 푸터 관련 기능 실행 (예: 패밀리 사이트 셀렉트박스)
        if (typeof footerInit === 'function') footerInit();

        // 2. (옵션) 페이지별로 따로 해야 할 작업이 있다면 이벤트를 날려줌
        // 예: 메인 페이지 슬라이드는 헤더가 로드된 뒤에 계산해야 한다면?
        $(document).trigger('layout-loaded');
    });
}

/*-------------------------------------------------------------------
	## Progress bar
-------------------------------------------------------------------*/
function progressInit() {
    progress();
    range();
}
function progress() {
    const $progress = $('.progress-bar > span');
    $progress.each(function () {
        $(this).animate({ width: $(this).attr('data-count') + '%' }, 1000);
        $(this).text($(this).attr('data-count') + '%');
    });
}

function range() {
    $('.range').each(function () {
        const $bars = $(this).find('> .bars > span'),
            $countTo = $bars.attr('data-count'),
            $countBox = $(this).find('> span'),
            $countText = $(this).find('> span em');

        $bars.animate({ width: $countTo + '%' }, 2000);
        $countBox.animate({ left: $countTo + '%' }, 2000);

        $({ countNum: $countText.text() }).animate(
            {
                countNum: $countTo,
                // countNum: $this.text() = 0, countNum: countTo = 50, 75, 30
                // 0에서 countNum이 된다
            },
            {
                duration: 2000, // 애니메이션이 완료될때까지 걸리는 시간
                easing: 'linear', // 애니메이션 효과 방식
                step: function () {
                    // 움직임 각 스텝별로 실행될 함수
                    $countText.text(Math.floor(this.countNum));
                    // Math.floor -> this.countNum의 값을 정수로 만들어준다
                },
                complete: function () {
                    // 움직임이 멈춘 후 실행될 함수
                    $countText.text(this.countNum);
                    // this.countNum이 $this의 text값이 된다
                    //alert('finished');
                },
            },
        );
    });
}


/*-------------------------------------------------------------------
	## Header scroll Percent
-------------------------------------------------------------------*/
function headerPercent() {
    const scrollPercent = (100 * $(window).scrollTop()) / ($(document).height() - $(window).height());
    $('.header-line').css('width', scrollPercent + '%');
    $(window).scroll(function () {
        const scrollPercent = (100 * $(window).scrollTop()) / ($(document).height() - $(window).height());
        $('.header-line').css('width', scrollPercent + '%');
    });
}

