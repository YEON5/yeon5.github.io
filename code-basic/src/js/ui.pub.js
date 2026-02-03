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
    selectUiInit();
    stickyInit();
    AnchorInit();
    scrollSpy();
    scrollCheck();
    // scrollAnimated();
    popoverInit();
    popupInit();
    progressInit();
    includeLayout();
    // headerPercent();
    initGlobalEvents(); // loading, toast
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
function selectUiInit() {
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
// ScrollSpy 초기화 함수
function scrollSpy() {
  // data-scrollspy="true" 속성이 있는 앵커 랩을 찾음
  $('.anchor-wrap[data-scrollspy="true"]').each(function () {
    const $wrap = $(this);
    const $nav = $wrap.find('.anchor-nav');
    // a 태그와 button 태그 모두 지원
    const $links = $nav.find('a[href^="#"], button[data-target]');
    
    // 타겟 정보를 저장할 객체
    let targets = {}; 
    let scrollTimeout = null;
    let isManualScroll = false; // 클릭 이동 중 감지 방지용 플래그

    // 링크가 없으면 중단
    if ($links.length === 0) return;

    // ----------------------------------------------------
    // [함수] 범위 계산 (핵심 로직)
    // ----------------------------------------------------
    function calcRanges() {
      targets = {}; // 초기화
      const offset = getOffset();

      $links.each(function () {
        const $link = $(this);
        const rawId = $link.attr('href') || $link.data('target');
        
        if (!rawId || rawId.substring(0, 1) !== '#') return;

        const id = rawId.substring(1);
        
        // 1. 메인 타겟 (ID로 찾기)
        const $mainTarget = $('#' + id);
        
        // 2. 그룹 타겟들 (data-spy-group="ID"로 찾기)
        const $groupTargets = $('[data-spy-group="' + id + '"]');
        
        // jQuery .add()로 두 집합을 합침 (null 체크 불필요, 없으면 length 0)
        const $allElements = $mainTarget.add($groupTargets);

        if ($allElements.length === 0) return;

        // 3. 그룹 전체의 범위(Start ~ End) 계산
        let minTop = Infinity;
        let maxBottom = -Infinity;

        $allElements.each(function () {
          const $el = $(this);
          // jQuery의 .offset().top은 문서 기준 절대 위치 (window.scrollY 포함됨)
          const top = $el.offset().top; 
          const bottom = top + $el.outerHeight();

          if (top < minTop) minTop = top;
          if (bottom > maxBottom) maxBottom = bottom;
        });

        // 맵(객체)에 저장 (오차 보정 -1 포함)
        targets[rawId] = {
          top: minTop - offset - 1,
          bottom: maxBottom - offset - 1,
          $link: $link
        };
      });
    }

    // ----------------------------------------------------
    // [함수] 오프셋 계산 (헤더 높이 + 앵커 네비 높이)
    // ----------------------------------------------------
    function getOffset() {
      const headerHeight = $('.header').outerHeight() || 0;
      const wrapHeight = $wrap.outerHeight() || 0;
      return headerHeight + wrapHeight;
    }

    // ----------------------------------------------------
    // [함수] 스크롤 핸들러
    // ----------------------------------------------------
    function onScroll() {
      if (isManualScroll) return;

      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);

      scrollTimeout = requestAnimationFrame(function () {
        const scrollTop = $(window).scrollTop();
        // 감지 기준점 (화면 상단 + 5px 여유)
        const triggerPoint = scrollTop + 5;
        let activeId = null;

        // 저장된 타겟들 순회
        $.each(targets, function (id, range) {
          if (triggerPoint >= range.top && triggerPoint < range.bottom) {
            activeId = id;
            // 겹치는 구간이 있을 경우 뒤에 정의된 것을 우선하려면 break 안 함
          }
        });

        // 활성화 상태 업데이트
        if (activeId) {
          updateActive(targets[activeId].$link);
        }
      });
    }

    // ----------------------------------------------------
    // [함수] 활성화 상태 업데이트 & 가로 정렬
    // ----------------------------------------------------
    function updateActive($targetLink) {
      // 이미 활성화 상태면 무시
      if ($targetLink.hasClass('is-active')) return;

      // 전체 해제
      $links.removeClass('is-active').removeAttr('aria-current');

      // 타겟 활성화
      $targetLink.addClass('is-active').attr('aria-current', 'location');

      // 가로 스크롤 정렬
      alignTab($targetLink);
    }

    // ----------------------------------------------------
    // [함수] 탭 가로 스크롤 정렬
    // ----------------------------------------------------
    function alignTab($target) {
      const $ul = $nav.find('ul');
      const $li = $target.closest('li');

      if (!$ul.length || !$li.length) return;

      // 현재 스크롤 위치 감안하여 계산
      const currentScrollLeft = $ul.scrollLeft();
      const liPositionLeft = $li.position().left; // ul 기준 상대 위치
      
      let targetLeft = currentScrollLeft + liPositionLeft;

      // 첫 번째 아이템은 0으로 강제 (padding/margin 오차 방지)
      if ($li.is(':first-child')) {
        targetLeft = 0;
      }

      // 부드럽게 이동
      $ul.stop().animate({ scrollLeft: targetLeft }, 300);
    }

    // ----------------------------------------------------
    // [초기화] 이벤트 바인딩 및 실행
    // ----------------------------------------------------
    
    // 1. 초기 범위 계산
    calcRanges();

    // 2. 윈도우 스크롤 이벤트
    $(window).on('scroll', onScroll);

    // 3. 리사이즈 이벤트 (범위 재계산)
    $(window).on('resize', function () {
      calcRanges();
      onScroll();
    });

    // 4. 링크 클릭 시 수동 스크롤 플래그 설정
    $links.on('click', function () {
      isManualScroll = true;
      // 1초 뒤 자동 감지 재개
      setTimeout(function () {
        isManualScroll = false;
      }, 1000);
    });
  });
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


function initGlobalEvents() {
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // Toast
    const toastBtn = target.closest('[data-toast]');
    if (toastBtn) {
      const msg = toastBtn.getAttribute('data-toast');
      const time = toastBtn.getAttribute('data-toast-time');

      if (msg) {
        // Toast 객체 호출
        Toast.show({
            message: msg,
            duration: time ? Number(time) : 3000,
        });
      }
    }

    // Loading
    const loadingBtn = target.closest('[data-loading]');
    if (loadingBtn) {

        // Case 1: 기본형 (아이콘만)
        Loading.show({
            type: 'default'
        });
        
        // Case 2: 텍스트 롤링 (현재 코드)
        Loading.show({
            type: 'texted',
            text: ['준비중입니다', '데이터 처리중', '완료되었습니다'],
            textInterval: 2000, // 교체 속도 조절
        });

        // Case C: Lottie + 텍스트
        // Loading.show({
        //     type: 'lottie',
        //     lottiePath: './assets/lottie/loading.json', // 경로 확인
        //     text: ['보안 환경 점검 중...', '결제 승인 요청 중...']
        // });
    

        // 3초 뒤에 자동으로 닫기
        //   setTimeout(() => {
        //     Loading.hide();
        //   }, 3000);
        }
    });
}
// 페이지 로드 시 이벤트 초기화 실행
// document.addEventListener('DOMContentLoaded', initGlobalEvents);

/*-------------------------------------------------------------------
	## Toast
-------------------------------------------------------------------*/
/**
 * 토스트 컨트롤러 (Singleton)
 */
const ToastController = (function () {
  let instance = null;

  class Controller {
    constructor() {
      this.container = null;
    }

    /**
     * 컨테이너 초기화 (내부 사용)
     * - DOM에 .toast-container가 없으면 생성하여 body에 추가
     */
    _initContainer() {
      if (document.querySelector('.toast-container')) {
        this.container = document.querySelector('.toast-container');
      } else {
        const div = document.createElement('div');
        div.className = 'toast-container';
        div.setAttribute('role', 'status');
        document.body.appendChild(div);
        this.container = div;
      }
    }

    /**
     * 토스트 메시지 노출
     * @param {string|Object} messageOrOptions - 메시지 문자열 또는 옵션 객체
     * @param {string} messageOrOptions.message - 메시지 내용
     * @param {number} [messageOrOptions.duration=3000] - 지속 시간 (ms)
     */
    show(messageOrOptions) {
      this._initContainer();
      if (!this.container) return;

      // 1. 옵션 정규화 (문자열로 오면 객체로 변환)
      const options =
        typeof messageOrOptions === 'string'
          ? { message: messageOrOptions }
          : messageOrOptions;

      // duration이 없으면 기본 3000, 0이면 무한(자동 삭제 안 함)
      const duration = options.duration !== undefined ? options.duration : 3000;

      // 2. 토스트 요소 생성
      const toastEl = document.createElement('div');
      toastEl.className = 'toast-item';

      // 텍스트 (보안을 위해 innerHTML 대신 textContent 사용)
      const textSpan = document.createElement('span');
      textSpan.textContent = options.message;
      toastEl.appendChild(textSpan);

      // 컨테이너에 추가
      this.container.appendChild(toastEl);

      // 3. 타이머 로직 (클로저 활용)
      let timer = null;

      // 삭제 함수 (애니메이션 후 제거)
      const remove = () => {
        if (toastEl.isConnected) {
          toastEl.classList.add('is-hiding');
          // CSS animation이 끝나는 시점에 DOM 제거
          toastEl.addEventListener('animationend', () => toastEl.remove(), {
            once: true,
          });
        }
      };

      // 타이머 시작
      const startTimer = () => {
        if (!timer && duration > 0) {
          timer = window.setTimeout(remove, duration);
        }
      };

      // 타이머 일시 정지
      const pauseTimer = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };

      // 4. 실행 및 이벤트 바인딩
      startTimer();

      // [접근성] 사용자가 내용을 확인하려 할 때(마우스 호버, 포커스) 사라지지 않게 멈춤
      toastEl.addEventListener('mouseenter', pauseTimer);
      toastEl.addEventListener('mouseleave', startTimer);
      toastEl.addEventListener('focusin', pauseTimer);
      toastEl.addEventListener('focusout', startTimer);
    }
  }

  // 싱글톤 인스턴스 반환 로직
  return {
    getInstance: function () {
      if (!instance) {
        instance = new Controller();
      }
      return instance;
    },
  };
})();

// 전역 객체 등록
window.Toast = ToastController.getInstance();


/*-------------------------------------------------------------------
	## Loading - Loading.show(), Loading.hide();
-------------------------------------------------------------------*/
/**
 * 로딩 컨트롤러 (Singleton)
 * - type: 'default' | 'texted' | 'lottie'
 */
const LoadingController = (function () {
  let instance = null;

  class Controller {
    constructor() {
      // 상태 변수
      this.lottieAnim = null;
      this.msgInterval = null;
      this.$wrap = null;

      // 타입 클래스 목록 (초기화용)
      this.typeClasses = ['type-default', 'type-texted', 'type-lottie'];

      // HTML 템플릿
      this.template = 
      `
        <div class="loading-wrap type-default" role="status">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-lottie"></div>
                <p class="loading-text"></p>
            </div>
        </div>
      `;
    }

    /**
     * DOM 초기화 (내부 사용)
     */
    _initDOM() {
      if (document.querySelector('.loading-wrap')) {
        this.$wrap = document.querySelector('.loading-wrap');
        return;
      }
      document.body.insertAdjacentHTML('beforeend', this.template);
      this.$wrap = document.querySelector('.loading-wrap');
    }

    /**
     * 로딩 노출
     * @param {Object} options
     * @param {string} [options.type='default'] - 'default' | 'texted' | 'lottie'
     * @param {string|string[]} [options.text] - 노출 문구
     * @param {number} [options.textInterval=2000] - 문구 교체 속도
     * @param {string} [options.lottiePath] - Lottie JSON 파일 경로
     */
    show(options = {}) {
      this._initDOM();
      if (!this.$wrap) return;

      const $spinner = this.$wrap.querySelector('.loading-spinner');
      const $lottie = this.$wrap.querySelector('.loading-lottie');
      const $text = this.$wrap.querySelector('.loading-text');

      // 1. 타입 설정 (기본값: default)
      const currentType = options.type || 'default';

      // 기존 타입 클래스 제거 후 새 타입 추가
      this.$wrap.classList.remove(...this.typeClasses);
      this.$wrap.classList.add(`type-${currentType}`);

      // 2. 요소별 노출 제어 로직

      // [Lottie 제어] type이 'lottie'일 때만 노출
      // (전역 객체 window.lottie가 존재해야 함)
      if (currentType === 'lottie' && options.lottiePath && window.lottie) {
        $spinner.style.display = 'none'; // 스피너 숨김
        $lottie.style.display = 'block'; // 로티 노출
        this._playLottie($lottie, options.lottiePath);
      } else {
        $lottie.style.display = 'none';
        this._stopLottie();

        // 'lottie' 타입이 아니면 무조건 스피너 노출
        $spinner.style.display = 'block';
      }

      // [텍스트 제어] type이 'default'가 아닐 때만 노출 ('texted', 'lottie')
      if (currentType !== 'default' && options.text) {
        this._handleText($text, options.text, options.textInterval);
      } else {
        // default 타입이거나 텍스트가 없으면 숨김
        $text.classList.remove('is-show');
        this._stopTextInterval();
      }

      // 3. 화면 표시 및 스크롤 잠금
      this.$wrap.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    /**
     * 로딩 숨김
     */
    hide() {
      if (!this.$wrap) return;

      this.$wrap.classList.remove('is-active');
      document.body.style.removeProperty('overflow');

      this._stopTextInterval();
      this._stopLottie();
    }

    // ============================================================
    //  ▼ Private Methods (관례적으로 _ 사용)
    // ============================================================

    _handleText(el, text, interval = 2000) {
      this._stopTextInterval();

      // 배열 처리
      if (Array.isArray(text)) {
        if (text.length === 0) return;
        let idx = 0;
        this._updateTextWithAnimation(el, text[0]);

        if (text.length > 1) {
          this.msgInterval = window.setInterval(() => {
            idx = (idx + 1) % text.length;
            this._updateTextWithAnimation(el, text[idx]);
          }, interval);
        }
      } else {
        // 문자열 처리
        this._updateTextWithAnimation(el, text);
      }
    }

    _updateTextWithAnimation(el, newText) {
      el.classList.remove('is-show');
      void el.offsetWidth; // Reflow 강제 발생 (애니메이션 리셋용)
      el.innerText = newText;
      el.classList.add('is-show');
    }

    _stopTextInterval() {
      if (this.msgInterval) {
        clearInterval(this.msgInterval);
        this.msgInterval = null;
      }
    }

    _playLottie(container, path) {
      // 이미 로드된 애니메이션이 있으면 재생만
      if (this.lottieAnim) {
        this.lottieAnim.play();
        return;
      }
      // 없으면 새로 로드
      this.lottieAnim = window.lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: path,
      });
    }

    _stopLottie() {
      if (this.lottieAnim) {
        this.lottieAnim.destroy(); // 메모리 해제
        this.lottieAnim = null;
      }
    }
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = new Controller();
      }
      return instance;
    },
  };
})();

// 전역 객체 등록
window.Loading = LoadingController.getInstance();


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
    // Promise.all(loadPromises).then(() => {
        
    //     // 1. 헤더 관련 기능들 실행
    //     if (typeof gnbInit === 'function') gnbInit();   // GNB 메뉴
    //     if (typeof utilInit === 'function') utilInit(); // 로그인/회원가입 버튼 등

    //     // 2. 푸터 관련 기능 실행 (예: 패밀리 사이트 셀렉트박스)
    //     if (typeof footerInit === 'function') footerInit();

    //     // 2. (옵션) 페이지별로 따로 해야 할 작업이 있다면 이벤트를 날려줌
    //     // 예: 메인 페이지 슬라이드는 헤더가 로드된 뒤에 계산해야 한다면?
    //     $(document).trigger('layout-loaded');
    // });
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

