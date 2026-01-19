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
    tabInit();
    toggleInit();
    dropInit();
    accodiInit();
    // stickyInit();
    scrollEvent();
    scrollAction();
    // scrollAnimated();
    fileInit();
    fileAttach();
    popoverInit();
    popupInit();
    // toastPopInit();
    progressInit();
    includeLayout();
    // headerPercent();
    // datepickerInit();
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

                // 1. 그룹 active 클래스 제어
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

                // 2. 버튼 노출 제어 (조건부 생성 포함)
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
	## Tab
-------------------------------------------------------------------*/
function tabInit() {
    $(document).on('click', '[class^="tab"] .tab-nav button', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const $li = $btn.parent();
        const targetId = $btn.attr('aria-controls');
        const $targetPanel = $('#' + targetId);

        $li.addClass('is-active').siblings('li').removeClass('is-active').find('button').attr('aria-selected', 'false');
        $btn.attr('aria-selected', 'true');
        $targetPanel.addClass('is-active').attr('aria-hidden', 'false').show().siblings('.tab-cont').removeClass('is-active').attr('aria-hidden', 'true').hide();
    });
}

/*-------------------------------------------------------------------
	## Toggle (drop menu, contents toggle)
-------------------------------------------------------------------*/
function toggleInit() {
    $(document).on('click', '.btn-toggle', function (e) {
        e.stopPropagation(); // 버튼 클릭 시 document 클릭 이벤트로 퍼지는 것 방지
        const $ele = $(this).closest('.dropdown');
        toggleAction($ele);
    });

    // 바닥(외부) 클릭 시 닫기
    toggleClose();
}

function toggleAction($ele) {
    const $body = $ele.find('.item-body');
    const $btn = $ele.find('.btn-toggle');
    const $list = $ele.find('.drop-list');

    if ($ele.hasClass('is-active')) {
        // 닫기
        $ele.removeClass('is-active');
        $btn.attr('aria-expanded', 'false');
        $list.attr('aria-hidden', 'true');
        $body.stop().slideUp(200);
    } else {
        // 다른 열려있는 드롭다운 닫기
        $('.dropdown.is-active').each(function () {
            const $other = $(this);
            $other.removeClass('is-active');
            $other.find('.btn-toggle').attr('aria-expanded', 'false');
            $other.find('.item-body').stop().slideUp(200);
        });

        // 현재 드롭다운 열기
        $ele.addClass('is-active');
        $btn.attr('aria-expanded', 'true');
        $list.attr('aria-hidden', 'false');
        $body.stop().slideDown(200);
    }
}

function toggleClose() {
    // 바닥(외부) 클릭 시 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown.is-active').each(function () {
                toggleAction($(this));
            });
        }
    });

    // 스크롤 시 닫기 (요소가 있는 경우에만)
    $('.main, window').on('scroll', function () {
        if ($('.dropdown.is-active').length) {
            $('.dropdown.is-active').each(function () {
                toggleAction($(this));
            });
        }
    });
}

function dropInit() {
    $(document).on('click', '.btn-select', function () {
        const $ele = $(this).closest('.dropdowns');

        if (!$ele.hasClass('is-active')) {
            $ele.addClass('is-active');
            $ele.find('.btn-select').attr('aria-expanded', 'true');
            $ele.find('.drop-body').attr('aria-hidden', 'false');
        } else {
            $ele.removeClass('is-active');
            $ele.find('.btn-select').attr('aria-expanded', 'false');
            $ele.find('.drop-body').attr('aria-hidden', 'true');
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
            e.stopPropagation();
            const $currentItem = $(this).closest('.accordion');
            accodiAction($currentItem);
        });
}

function accodiAction($accodi) {
    const $head = $accodi.children('.item-head');
    const $body = $accodi.children('.item-body');
    const $btn = $head.find('.btn-expand');

    if ($accodi.hasClass('is-active')) {
        // 닫기
        $accodi.removeClass('is-active');
        $btn.attr('aria-expanded', 'false');
        $body.stop().slideUp(350);
    } else {
        // 열기
        // 개별 동작해야 하는 경우 주석 처리
        // const $siblings = $accodi.siblings('.accordion');
        // $siblings.removeClass('is-active');
        // $siblings.children('.item-body').stop().slideUp(350);
        // $siblings.children('.item-head').find('.btn-expand').attr('aria-expanded', 'false');
        // 개별 동작해야 하는 경우 주석 처리

        $accodi.addClass('is-active');
        $btn.attr('aria-expanded', 'true');
        $body.stop().slideDown(350);
    }
}

/*-------------------------------------------------------------------
	## Sticky
-------------------------------------------------------------------*/
function stickyInit() {
    $(window).on('scroll', function (e) {
        //funcHeadFixed();
        lnbSticky();
        e.preventDefault();
    });

    //Header fixed sticky : 서브페이지에만 적용시
    //if(!$('.wrapper').hasClass('page-main')) {
    //	//console.log('page load-scrollY : '+scrollY);
    //	funcHeadFixed();

    //	$(document).on('scroll', function(e){
    //		funcHeadFixed();
    //		e.preventDefault;
    //	});
    //}

    //Header fixed sticky
    function funcHeadFixed() {
        const scrTop = $(window).scrollTop();
        if (scrTop > 0 && !$('.header').hasClass('fixed')) {
            //console.log('scrTop > 0 : '+scrTop);
            $('.header').addClass('fixed');
        } else if (scrTop == 0 && $('.header').hasClass('fixed')) {
            //console.log('scrTop == 0 : '+scrTop);
            $('.header').removeClass('fixed');
        }
        //console.log(scrTop);
    }

    //Lnb fixed sticky
    if ($('.lnb').length) {
        const lnbPos = $('.lnb').offset().top;
    }
    function lnbSticky() {
        const scrTop = $(this).scrollTop();
        const $lnb = $('.lnb');
        if (lnbPos <= scrTop) {
            $lnb.addClass('fixed');
        } else {
            $lnb.removeClass('fixed');
        }
    }
}

/*-------------------------------------------------------------------
	## Scroll Action
-------------------------------------------------------------------*/
function scrollAction() {
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

    //Header border on scroll
    $(document).on('scroll', function () {
        const scrollY = $(document).scrollTop();
        //step scroll border top
        if ($('#stepWrap').length > 0) {
            if (scrollY < 100 && !$('.header').hasClass('bor-none')) {
                $('.header').addClass('bor-none');
            } else if (scrollY >= 100 && $('.header').hasClass('bor-none')) {
                $('.header').removeClass('bor-none');
            }
        }
    });
}

/*-------------------------------------------------------------------
	## Scroll Event : Scroll Up/Down Custom Event (스크롤 상태 및 위치 확인)
-------------------------------------------------------------------*/
function scrollEvent() {
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
	## File Functions
-------------------------------------------------------------------*/
// Input - file : upload input 제어 (행 추가)
function fileInit() {
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

    setTimeout(function () {
        $popWrap.find('.popup').attr('tabindex', '0').focus();
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

    // 스크롤 잠금 해제
    if ($('.popup-wrap.is-active').length === 0) scrollOff();

    // 포커스 복귀
    const $opener = $popWrap.data('opener');
    if ($opener && $opener.length > 0) $opener.focus();

    $popWrap.off('keydown.popupFocus');
}

// focus 이탈 막기 (접근성)
function handleFocusTrap(e, $popWrap) {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    if (!isTabPressed) return;

    const $focusableEls = $popWrap.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]');
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

// scroll on/off
function scrollOn() {
    const $body = $('body');
    const $wrapper = $('.wrapper');

    savedScrollTop = $(window).scrollTop();

    $body.css('top', -savedScrollTop + 'px').addClass('scrollOff');
    if ($wrapper.length) $wrapper.attr('aria-hidden', 'true');
}

function scrollOff() {
    const $body = $('body');
    const $wrapper = $('.wrapper');

    $body.removeClass('scrollOff').css('top', '');
    $(window).scrollTop(savedScrollTop);

    if ($wrapper.length) $wrapper.removeAttr('aria-hidden');
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

        // 각 load 작업을 Promise로 감싸서 배열에 저장
        const loadJob = new Promise((resolve, reject) => {
            $this.load(url, function (response, status) {
                if (status === 'error') {
                    console.error('Failed to load:', url);
                    // 에러가 나도 다른 로딩은 진행되도록 resolve 처리 (혹은 reject 처리 후 catch)
                    resolve();
                } else {
                    $this.removeAttr('data-include');
                    resolve();
                }
            });
        });

        loadPromises.push(loadJob);
    });

    // 모든 include 로딩이 끝난 시점에 단 한 번 실행
    // Promise.all(loadPromises).then(() => {
    //     if (typeof gnbInit === 'function') {
    //         gnbInit();
    //     }
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

/* Datepicker */
function datepickerInit() {
    $('.ui-datepicker-div').each(function () {
        var id = $(this).attr('id');
        datepickerSet(id);
    });
}
function datepickerSet(id) {
    var $ele = $('#' + id);
    $ele.datepicker({
        prevText: '이전달',
        nextText: '다음달',
        monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        weekHeader: 'Wk',
        dateFormat: 'yy-mm-dd',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '.',
        changeMonth: false,
        changeYear: false,
        beforeShow: function (input) {
            $('.ui-datepicker-div').attr('tabindex', '0');
            setTimeout(function () {
                $('.ui-datepicker-div').focus();

                // 년도 버튼 추가
                var preYearBtn = $("<button class='ui-datepicker-prev-year' title='이전년도'><span class='blind'>이전 년도</span></button>");
                preYearBtn.unbind('click').bind('click', function () {
                    $.datepicker._adjustDate($(input), -1, 'Y');
                });
                var nextYearBtn = $("<button class='ui-datepicker-next-year' title='다음년도'><span class='blind'>다음 년도</span></button>");
                nextYearBtn.unbind('click').bind('click', function () {
                    $.datepicker._adjustDate($(input), +1, 'Y');
                });

                $('.ui-datepicker-header .ui-datepicker-prev').before(preYearBtn);
                $('.ui-datepicker-header .ui-datepicker-next').after(nextYearBtn);
                // $('.ui-datepicker-header').append(nextYearBtn, preYearBtn);
            }, 100);
        },
        onChangeMonthYear: function (year, month, inst) {
            setTimeout(function () {
                var preYearBtn = $("<button class='ui-datepicker-prev-year' title='이전년도'><span class='blind'>이전 년도</span></button>");
                preYearBtn.unbind('click').bind('click', function () {
                    $.datepicker._adjustDate($(inst.input), -1, 'Y');
                });
                var nextYearBtn = $("<button class='ui-datepicker-next-year' title='다음년도'><span class='blind'>다음 년도</span></button>");
                nextYearBtn.unbind('click').bind('click', function () {
                    $.datepicker._adjustDate($(inst.input), +1, 'Y');
                });

                $('.ui-datepicker-header .ui-datepicker-prev').before(preYearBtn);
                $('.ui-datepicker-header .ui-datepicker-next').after(nextYearBtn);
                // $(".ui-datepicker-header").append(nextYearBtn, preYearBtn);
            }, 100);
        },
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

/* 버튼효과 */
// function waveEffectEvent() {
//     var events = null;
//     $(document)
//         .off('mousedown.waveEffectEvent touchstart.waveEffectEvent')
//         .on('mousedown.waveEffectEvent touchstart.waveEffectEvent', '.btn, .tab-nav a', function (e) {
//             events = 'mousedown';
//             var self = $(this),
//                 wave = '.effect-wave',
//                 btnWidth = self.outerWidth();
//             if (e.type == 'mousedown') {
//                 var x = e.offsetX,
//                     y = e.offsetY;
//             }
//             if (e.type == 'touchstart') {
//                 var x = e.touches[0].pageX - self.offset().left,
//                     y = e.touches[0].pageY - self.offset().top;
//             }
//             if (self.find(wave).length == 0) {
//                 self.prepend('<span class="effect-wave"></span>');
//                 $(wave)
//                     .css({ top: y, left: x })
//                     .stop()
//                     .animate({ width: btnWidth * 3, height: btnWidth * 3 }, 400, function () {
//                         $(this).addClass('is-complete');
//                         if (events == 'mouseup') {
//                             $(this)
//                                 .stop()
//                                 .animate({ opacity: '0' }, 200, function () {
//                                     $(this).remove();
//                                 });
//                         }
//                     });
//             }
//         });
//     $(document)
//         .off('mouseup.waveEffectEvent touchend.waveEffectEvent')
//         .on('mouseup.waveEffectEvent touchend.waveEffectEvent', '.btn, .tab-nav a', function (e) {
//             events = 'mouseup';
//             var self = $(this),
//                 wave = '.effect-wave';
//             if (self.find(wave).hasClass('is-complete')) {
//                 $(wave)
//                     .stop()
//                     .animate({ opacity: '0' }, 200, function () {
//                         $(this).remove();
//                     });
//             }
//         });
//     $(document)
//         .off('click.waveEffectEvent focusin.waveEffectEvent')
//         .on('click.waveEffectEvent focusin.waveEffectEvent', function (e) {
//             if ($(e.target).is('.btn, .tab-nav a') == false && $('.effect-wave').length) {
//                 $('.effect-wave')
//                     .stop()
//                     .animate({ opacity: '0' }, 200, function () {
//                         $(this).remove();
//                     });
//             }
//         });
// }
