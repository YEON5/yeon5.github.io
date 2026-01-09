var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

$(function () {
    uiInit();
});

//호출 방식
function uiInit() {
    // userAgent();
    eleFocus();
    //gnbInit();
    snbInit();
    lnbInit();
    formInit();
    tabInit();
    tabEvent();
    toggleInit();
    dropInit();
    accodiInit();
    stickyInit();
    scrollEvent();
    scrollAction();
    scrollAnimated();
    fileInit();
    fileAttach();
    toastPopInit();
    subSlideMenu();
    includeLayout();
    headerPercent();
    progressInit();
    datepickerInit();
    // waveEffectEvent();
}

/*-------------------------------------------------------------------
	## Gnb / Snb (aside) / Lnb
-------------------------------------------------------------------*/
//Gnb
function gnbInit() {
    //pc gnb 전체 메뉴 열기
    var $header = $('.header');
    var $gnbDep = $('.gnb .depth2');
    var $gnbBg = $('.gnb-bg');

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
        var $ele = $('.wrapper').hasClass('side-closed');
        var $trigger = $('.menu-trigger').hasClass('is-active');
        var $wrapper = $('.wrapper');
        var $aside = $('.sidebar');
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
        var cls = $(this).hasClass('is-active');
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
        var $depth2 = $('.lnb-depth2');
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
    // inputFocus();
    // inputDelete();
    radioTab();
    selectorText();
    allChk();

    //Select Email input add
    $(document).on('change', function () {
        var $email = $('#emailSelect option:selected').val();
        if ($email == 'selectEtc') {
            $('.input-add').show();
        } else {
            $('.input-add').hide();
        }
    });
}

function allChk() {
    var $wrapper = $('.form-check');
    $wrapper.each(function () {
        var trigger = $('#allCheck input[type=checkbox]');
        trigger.on('click', function () {
            $('.terms-cont input[type=checkbox]').prop('checked', this.checked);
        });
    });
}

//Radio Tab (이전버전)
// $(document).on('click', '.radio-nav label', function(){
// 	var i = $(this).parents('.radio2').index();
// 	var tit = $(this).text();
// 	$('[id^="radio-cont"]').hide();
// 	$('[id^="radio-cont'+i+'"]').show();
// });

function radioTab() {
    var $wrapper = $('.radio-tab');
    $wrapper.each(function () {
        var trigger = $(this).find('.radio-nav label');
        trigger.on('click', function () {
            var id = $(this).closest('.radio-btn').data('id');
            var $tabId = $('#' + id);
            $tabId.show().siblings().hide();

            console.log(id);
        });
    });
}

function radioTab2() {
    $(document).on('change', '.radio-nav .radio-btn input', function () {
        $('.radio-nav .radio-btn input').each(function () {
            var id = $(this).closest('.radio-btn').data('id');
            var $radioId = $('#' + id);
            var checked = $(this).prop('checked');
            if (checked) {
                $radioId.show();
            } else {
                $radioId.hide();
            }
        });
    });
}

function inputFocus() {
    $('.form-wrap input').on('focusin', function () {
        $(this).closest('.input-group').addClass('is-focus');
        $(this).parent().addClass('has-delBtn');
    });
    $('.form-wrap input').on('focusout', function () {
        $(this).closest('.input-group').removeClass('is-focus');
        $(this).parent().removeClass('has-delBtn');
        if ($(this).val() != '') {
            //값이 존재하면
            $(this).closest('.input-group').addClass('is-focus');
            $(this).parent().addClass('has-delBtn');
        }
    });

    // focus
    // $(document).on('click', '.input-group .label-txt', function(){
    // 	$(this).next('input').focus();
    // });
}

function inputDelete() {
    $(document).on('focusin input paste', function (e) {
        if ($(e.target).parents().is('.has-delBtn') && !$(e.target).is('[readonly]')) {
            $('.has-delBtn button.input-del').hide();
            $this = $(e.target).parents('.has-delBtn').find('input');
            if ($this.val() != '') {
                //값이 존재하면
                if ($this.siblings('button.input-del').length == 0) {
                    //삭제버튼이 없으면
                    $this.after('<button type="button" class="input-del"><span class="sr-only">내용지우기</span></button>');
                    $this.next('button.input-del').show();
                } else {
                    $this.next('button.input-del').show();
                }
            }
        } else {
            $('.has-delBtn button.input-del').hide();
        }
    });
    $(document).on('click', '.input-group .label-txt', function () {
        $(this).next('input').focus();
    });
    $(document).on('touchstart click', function (e) {
        if (!$(e.target).parents().is('.has-delBtn')) {
            $('.has-delBtn button.input-del').hide();
        }
    });
    $(document).on('click', '.has-delBtn button.input-del', function () {
        $(this).prev('input').val('').focus();
        $(this).remove();
    });
}

// function selectEmail(ele){
// 	var $ele = $(ele);
// 	var $email2 = $('input[name=email2]');  //'1'인 경우 직접입력
// 	if($ele.val() == "1"){
// 		$email2.attr('readonly', false);
// 		$email2.val('');
// 	} else {
// 		$email2.attr('readonly', true);
// 		$email2.val($ele.val());
// 	}
// }

// selector text change tab
function selectorText() {
    var $selector = $('.btn-selector');
    var hasCls = $selector.parent().hasClass('selected');
    $selector.on('click', function () {
        if (hasCls) {
            $(this).parent().removeClass('selected');
        } else {
            $(this).parent().siblings().removeClass('selected').attr('aria-selected', 'false');
            $(this).parent().addClass('selected').attr('aria-selected', 'true');
        }
        setTimeout(function () {
            selectorChage();
            console.log('hi');
        });
    });
    selectorTab();
}
function selectorChage() {
    var selectStr = $('.selector-wrap').find('.selected span').text();
    $('.desc-wrap').find('.txt-blind').text(selectStr);
}
function selectorTab() {
    var $wrapper = $('.selector-wrap');
    $wrapper.each(function () {
        var trigger = $(this).find('.btn-selector');
        trigger.on('click', function () {
            var id = $(this).closest('li').data('id');
            var $tabId = $('#' + id);
            $tabId.show().siblings().hide();
            console.log(id);
        });
    });
}

/*-------------------------------------------------------------------
	## Tab
-------------------------------------------------------------------*/
function tabInit() {
    $(document).on('click', '.tab-nav li > button', function (e) {
        e.preventDefault();
        var id = $(this).attr('aria-controls');
        var $tabId = $('#' + id);
        $(this).parent().addClass('is-active').siblings('li').removeClass('is-active').find('button').attr('aria-selected', 'false');
        $tabId.addClass('is-active').attr('aria-hidden', 'false').siblings('.tab-cont').removeClass('is-active').attr('aria-hidden', 'true');

        //aria
        if ($(this).parent().hasClass('is-active')) {
            $(this).attr('aria-selected', 'true');
        }
    });
}

//tab a:href = id
function tabEvent() {
    $(document).on('click', '.tab-round .tab-nav li > button', function (e) {
        e.preventDefault();
        var id = $(this).attr('aria-controls');
        tabAction(id);
    });
}
function tabAction(id) {
    var $id = $(id);
    $id.show().siblings().hide();
}

/*-------------------------------------------------------------------
	## Swiper tab slide 
-------------------------------------------------------------------*/
function tabSlide() {
    //tab slide
    $(document).on('click', '.tab-slide .swiper-wrapper .swiper-slide', function (e) {
        var index = $(this).index();
        $(this).addClass('is-active').siblings('li').removeClass('is-active');
        $('.tab-slide .tab-body > .tab-cont').eq(index).addClass('is-active').siblings('.tab-cont').removeClass('is-active');
        $('.tab-slide .swiper-wrapper > li a').removeAttr('title'); //접근성일때
        $('.tab-slide .swiper-wrapper > li.is-active a').attr('title', '현재탭'); //접근성일때
    });

    //tab slide
    $('.tab-slide').each(function () {
        var tabSlide = undefined;
        var $this = $(this);
        var minWidth = 140;
        var lens = $this.find('li').length;
        var action = function () {
            if ($(window).width() < lens * minWidth) {
                $this.addClass('is-responsive');
            } else {
                $this.removeClass('is-responsive');
            }
            function initSwiper() {
                var screenWidth = $(window).width();
                if (screenWidth < 1024 && tabSlide == undefined) {
                    setTimeout(function () {
                        tabSlide = new Swiper('.tab-slide > .swiper-container', {
                            slidesPerView: 'auto',
                            spaceBetween: 0,
                            freeMode: true,
                            pagination: false,
                            slideToClickedSlide: true,
                            resistanceRatio: 0, //좌우 움직임 저항 조정
                        });
                        if ($('.tab-slide').size() != 0) {
                            tabSlide.slideTo($('.tab-slide > .swiper-container .swiper-wrapper .swiper-slide.is-active').index(), 0, true);
                        }
                    }, 0);
                } else if (screenWidth > 1024 && tabSlide != undefined) {
                    //1024px 이전엔 silde 작동 안함
                    tabSlide.destroy();
                    tabSlide = undefined;
                    jQuery('.tab-slide > .swiper-container .swiper-wrapper').removeAttr('style');
                    jQuery('.tab-slide > .swiper-container .swiper-wrapper .swiper-slide').removeAttr('style');
                }
            }
            initSwiper();
        };
        action();
        var indicatorSetTime;
        $(window).on('resize', function () {
            clearTimeout(indicatorSetTime);
            indicatorSetTime = setTimeout(function () {
                action();
            }, 0);
        });
    });
}

/*-------------------------------------------------------------------
	## Toggle (drop menu, contents toggle)
-------------------------------------------------------------------*/
function toggleInit() {
    $(document).on('click', '.btn-toggle', function () {
        var $ele = $(this).closest('.dropdown');
        toggleAction($ele);

        // aria
        if ($ele.hasClass('is-active')) {
            $ele.find('button').attr('aria-expanded', 'true');
            $ele.find('.drop-list').attr('aria-hidden', 'false');
        } else {
            $ele.find('button').attr('aria-expanded', 'false');
            $ele.find('.drop-list').attr('aria-hidden', 'true');
        }
    });
    // toggleClose();
}
function toggleAction($ele) {
    $ele.toggleClass('is-active', function () {
        $ele.find('.item-body').stop().slideToggle(200);
    });
    $('.dropdown.is-active')
        .not($ele)
        .each(function () {
            $(this).removeClass('is-active');
            $(this).find('.item-body').stop().slideToggle(200);
        });
}
function toggleClose() {
    //toggle 바닥 클릭시 닫기
    $(document).on('click', function (e) {
        if ($('.dropdown.is-active').length && $('.dropdown').has(e.target).length === 0) {
            $('.dropdown.is-active').each(function () {
                toggleAction($(this));
            });
        }
    });
    //toggle 스크롤시 닫기
    $('.main').on('scroll', function (e) {
        if ($('.dropdown.is-active').length) {
            $('.dropdown.is-active').each(function () {
                toggleAction($(this));
            });
        }
    });
}

function dropInit() {
    $(document).on('click', '.btn-select', function () {
        var $ele = $(this).closest('.dropdowns');

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
    $(document).on('click', '.accordion .item-head', function () {
        var id = $(this).parent().attr('id');
        accodiAction(id);

        if ($(this).parent().hasClass('is-active')) {
            $(this).find('.btn-expand').attr('aria-expanded', 'true');
        }
    });
}
//열고 닫힘
function accodiAction(id) {
    var $accodi = $('#' + id);
    if ($accodi.hasClass('is-active')) {
        $accodi.removeClass('is-active');
        $accodi.find('.item-body').stop().slideUp(350);
    } else {
        $accodi.addClass('is-active');
        $accodi.find('.item-body').stop().slideDown(350);
        $accodi.siblings().find('.item-body').stop().slideUp(350); //개별로 펼칠 경우 주석해지
        $accodi.siblings().removeClass('is-active'); //개별로 펼칠 경우 주석해지
        $accodi.siblings().find('.btn-expand').attr('aria-expanded', 'false');
    }
}
//아코디언 안에 아코디언
// function accodiAction(id){
// 	var $accodi = $('#' + id);
// 	if ($accodi.hasClass('is-active')){
// 		$accodi.removeClass('is-active');
// 		$accodi.children().next('.item-body').stop().slideUp(350);
// 	}else{
// 		$accodi.addClass('is-active');
// 		$accodi.children().next('.item-body').stop().slideDown(350);
// 	}
// }

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
        var scrTop = $(window).scrollTop();
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
        var lnbPos = $('.lnb').offset().top;
    }
    function lnbSticky() {
        var scrTop = $(this).scrollTop();
        var $lnb = $('.lnb');
        if (lnbPos <= scrTop) {
            $lnb.addClass('fixed');
        } else {
            $lnb.removeClass('fixed');
        }
    }
}

/*-------------------------------------------------------------------
	## Scroll Event : Scroll Up/Down Custom Event (스크롤 상태 및 위치 확인)
-------------------------------------------------------------------*/
function scrollEvent() {
    var scrTop = null, //스크롤 현재위치
        scrTopStart = null, //스크롤 시작위치
        scrTopEnd = null, //스크롤 종료위치
        isScrFirst = null, //스크롤 처음인 경우
        isScrLast = null, //스크롤 끝인 경우
        //Init
        scrTop = (scrTopStart = $(window).scrollTop());
    var scrPosition = function (val) {
        //스크롤 처음확인
        if (val == 0) {
            isScrFirst = true;
            $('body').addClass('is-scrollFirst');
        } else {
            isScrFirst = false;
            $('body').removeClass('is-scrollFirst');
        }
        //스크롤 마지막확인
        if (val + $(window).outerHeight() == $(document).height()) {
            isScrLast = true;
            $('body').addClass('is-scrollLast');
        } else {
            isScrLast = false;
            $('body').removeClass('is-scrollLast');
        }
    };
    scrPosition(scrTop);

    //Scrolled
    var scrollEndTime;
    var isScrolled = false;
    var oldScrTop = scrTop;
    $(window)
        .off('scroll.customEvent')
        .on('scroll.customEvent', function () {
            var curScrTop = $(window).scrollTop();

            //스크롤 방향
            if (oldScrTop > curScrTop) {
                $(window).trigger('scrollUp');
                $('body').addClass('is-scrollUp').removeClass('is-scrollDown');
            } else if (oldScrTop < curScrTop) {
                $(window).trigger('scrollDown');
                $('body').addClass('is-scrollDown').removeClass('is-scrollUp');
            }
            oldScrTop = curScrTop;

            //스크롤 종료
            clearTimeout(scrollEndTime);
            scrollEndTime = setTimeout(function () {
                isScrolled = false;
                scrTop = scrTopEnd = curScrTop;
                $(window).trigger('scrollEnd');
            }, 100);

            scrPosition(curScrTop);
        });

    //Resized
    var resizeEndTime;
    $(window)
        .off('resize.customEvent')
        .on('resize.customEvent', function () {
            clearTimeout(resizeEndTime);
            resizeEndTime = setTimeout(function () {
                $(window).trigger('resizeEnd');
            }, 100);
        });
}

/*-------------------------------------------------------------------
	## Scroll Action
-------------------------------------------------------------------*/
function scrollAction() {
    //Click scroll top button
    $(window).on('scroll', function (e) {
        var $btnScroll = $('.btn-scrollTop');
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

    // 앵커 태그 클릭 시 해당 위치로 이동
    $(document).on('click', '.header .gnb .node1 > a', function (e) {
        e.preventDefault();
        var scrollPos = $($(this).attr('href'));
        var scrollPosTop = scrollPos.offset().top - 150;
        $('html, body').animate(
            {
                scrollTop: scrollPosTop,
            },
            400,
        );
    });

    // 클릭 시 해당 위치로 이동
    var trigger = $('.lnb .scroll-pos');
    trigger.on('click', function () {
        var scrTop = $(this).scrollTop();
        var selecterPos = $('.tab').offset().top - 250;
        var scrHeight = $(document).scrollTop(); // 스크롤 위치 높이 좌표값
        $('html, body').animate(
            {
                scrollTop: selecterPos,
            },
            400,
        );
        console.log(scrHeight);
    });

    //Header border on scroll
    $(document).on('scroll', function () {
        var scrollY = $(document).scrollTop();
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

function scrollSpy() {
    var gnbLink = $('.gnb .node1 > a');
    gnbLink.on('click', function (e) {
        var target = $($(this).attr('href'));
        var topH = $('.header').height();
        $('html, body').animate(
            {
                scrollTop: target.offset().top - topH - 20,
            },
            100,
        );
        // $(this).addClass('is-active');
        e.preventDefault();
    });
}
function scrollCurrent() {
    $(window).on('scroll', function (e) {
        // findPosition();
    });
}
function findPosition() {
    var gnbLink = $('.gnb .node1 > a');
    $('.section').each(function () {
        if ($(this).offset().top - $(window).scrollTop() < 20) {
            gnbLink.removeClass('is-active');
            $('.gnb')
                .find('[data-scroll="' + $(this).attr('id') + '"]')
                .addClass('is-active');
        }
    });
}

/*-------------------------------------------------------------------
	## Scroll animate
-------------------------------------------------------------------*/
//made by sin script
function scrollAnimate() {
    var objGroup = $('.ui-animate');
    var objList = $('.to-animate');
    var dataAnimate = objGroup.attr('data-animate');

    var action = function () {
        objGroup.each(function () {
            $(this)
                .find(objList)
                .not('animated')
                .each(function () {
                    var winTop = $(window).scrollTop();
                    var $this = $(this);

                    if ($(this).offset().top - winTop < 500) {
                        setTimeout(function () {
                            $this.addClass('animated').addClass(dataAnimate);
                        });
                    }
                });
        });
    };

    var setTime = null;
    $(window).scroll(function () {
        clearTimeout(setTime);
        setTime = setTimeout(function () {
            action();
        }, 50);
    });
}

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
            // //올릴때 실행
            //if (winH2 < objH2 && direction == 'up'){
            //	$this.addClass(clsAnimate).addClass($this.attr('data-animate'));
            //	$this.find('.to-animate').each(function(){
            //		$(this).addClass(clsAnimate).addClass($(this).attr('data-duration')).addClass($(this).attr('data-animate'));
            //	})
            //}
            // //올렸을때 초기화
            //if (winH < objH2){
            //	$this.removeClass(clsAnimate).removeClass($this.attr('data-animate'));
            //	$this.find('.to-animate').each(function(){
            //		$(this).removeClass(clsAnimate).removeClass($(this).attr('data-duration')).removeClass($(this).attr('data-animate'));
            //	})
            //}
            // //내렸을때 초기화
            //if (winH2 > (objH2  + ($this.outerHeight() * 1))){
            //	$this.removeClass(clsAnimate).removeClass($this.attr('data-animate'));
            //	$this.find('.to-animate').each(function(){
            //		$(this).removeClass(clsAnimate).removeClass($(this).attr('data-duration')).removeClass($(this).attr('data-animate'));
            //	})
            //}
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
//Input - file : upload input 추가
function fileInit() {
    var fileTarget = $('.form-file .upload-hidden');
    fileTarget.on('change', function (e) {
        if (window.FileReader) {
            var filename = $(this)[0].files[0].name;
        } else {
            var filename = $(this).val().split('/').pop().split('\\').pop(); //파일명 추출
        }
        //파일명 삽입
        $(this).siblings('.form-file .upload-name').val(filename);
    });
    //file field type 추가삭제
    $('.file-plus').on('click', function (e) {
        var fileIndex = $('.file-group').children().length;
        $('.file-group').append('<div class="form-file">' + '<input type="text" name="exFileName' + fileIndex + '" class="upload-name" title="첨부된 파일명" value="" disabled="disabled">' + '<input type="file" name="exFileName' + fileIndex + '" id="exFileName' + fileIndex + '" class="upload-hidden"> <label for="exFileName' + fileIndex + '" class="upload-btn">파일찾기</label>' + '<button type="button" class="btn btn-file file-minus" title="파일첨부 삭제" onclick="javascript:removeFile(this);"></button>' + '</div>');
    });
}

//Input: file upload 삭제 호출
function removeFile(minus) {
    var $minus = $(minus);
    $minus.parent().remove();
}

//Input - file : 파일명 하단 리스트 추가 type1
function fileAttach() {
    var uploadFile = $('.file-box .upload-file');
    uploadFile.on('change', function () {
        if (window.FileReader) {
            var filename = $(this)[0].files[0].name;
        } else {
            var filename = $(this).val().split('/').pop().split('\\').pop();
        }
        $(this).siblings('.upload-name').val(filename);
        $('.file-list').append('<li><span>' + filename + '</span><button type="button" name="" id="" class="file-del" onclick="removeFile(this)"><span class="sr-only">첨부파일삭제</span></button></li>');
    });
}

//Input - file : 파일명 리스트로 추가 type2
//function fileAttach(obj) {
//	if (window.FileReader) {
//		var filename = $(obj)[0].files[0].name;
//	} else {
//		var filename = $(obj).val().split('/').pop().split('\\').pop();
//	}
//	var fileIndex = $('.file-box').children().length;
//	$(obj).siblings('.upload-file').val(filename);
//	 //$(obj).closest('.file-wrap').find('.form-file').prepend(
//	 //	'<div class="file-box">' +
//	 //	'<input type="text" name="exFileName2" class="upload-name" title="첨부된 파일명" value="" disabled="disabled">' +
//	 //	'<input type="file" name="exFileName2" id="exFileName2' + fileIndex + '" class="upload-file" onchange="fileAttach(this)">' +
//	 //	'<label for="exFileName2' + fileIndex + '" role="button">파일찾기</label>' +
//	 //	'</div>'
//	 //);

//	$(obj).closest('.file-wrap').find('.file-list').append(
//		'<div class="file-name">' +
//		'<span class="item">' + filename + '<button type="button" class="file-del" onclick="removeFile(this)"><span>첨부파일삭제</span></button></span>' +
//		'</div>'
//	);
//}

/*-------------------------------------------------------------------
	## Utility Functions
-------------------------------------------------------------------*/
//Device check
function userAgent() {
    var $eleBody = $('body');
    $eleBody.addClass('dv-' + browser.name + ' dv-' + browser.name + browser.version + ' dv-' + browser.os + ' dv-' + browser.os + browser.osVersion);
}

//focus
function eleFocus() {
    $(document)
        .off('focusin.eleEvent click.eleEvent')
        .on('focusin.eleEvent click.eleEvent', function (e) {
            $activeFocus = $(e.target);
        });
}

// scroll on,off
function scrollOn() {
    var $body = $('body');
    var $wrapper = $('.wrapper');
    setTimeout(function () {
        $body.addClass('scrollOff');
        $wrapper.attr('aria-hidden', 'true');
    }, 50);
}
function scrollOff() {
    var $body = $('body');
    var $wrapper = $('.wrapper');
    setTimeout(function () {
        $body.removeClass('scrollOff');
        $wrapper.removeAttr('aria-hidden');
    }, 50);
}

// function scrollOn() {
//     const body = document.body;
//     const wrapper = document.querySelector('.wrapper');
//     setTimeout(() => {
//         body.classList.add('scrollOff');
//         wrapper.setAttribute('aria-hidden', 'true');
//     }, 50);
// }
// function scrollOff() {
//     const body = document.body;
//     const wrapper = document.querySelector('.wrapper');
//     setTimeout(() => {
//         body.classList.remove('scrollOff');
//         wrapper.removeAttribute('aria-hidden');
//     }, 50);
// }

//Sidebar snbset
function snbSet(n1, n2) {
    var $snb = $('.snb');
    var $n1, $n2;

    if (typeof n1 == 'number') {
        $n1 = $snb.find('ul > .node1').eq(n1);
        $n1.addClass('is-current is-active');
    }
    if (typeof n2 == 'number') {
        $n2 = $n1.find('.depth2 > ul > .node2').eq(n2);
        $n2.addClass('is-current is-active');
    }
}

//툴팁 포커스아웃 및 바닥 클릭시 닫기
//$document.off('focusin.tooltipDocument click.tooltipDocument').on('focusin.tooltipDocument click.tooltipDocument', function(e){
//	$('div.tooltip.is-active').each(function(){
//		var id = $(this).attr('id');
//		if ($('div.tooltip').has(e.target).length === 0 && !$(e.target).hasClass('tooltip-opener')){
//			self.close(id);
//		}
//	})
//});

/*-------------------------------------------------------------------
	## Popover - onClick ID 처리 : onclick="popover('popover')"
-------------------------------------------------------------------*/
function popoverOpen(id) {
    var $popover = $('#' + id);
    //$popover.stop().toggle('fade', 300); //
    $popover.stop().fadeIn(300).attr('aria-hidden', 'false');
    $popover.parent().addClass('is-active').find('.popover-open').attr('aria-expanded', 'true');

    //popover each
    $('.popover-inner:visible')
        .not('#' + id)
        .each(function () {
            $(this).parent().removeClass('is-active');
            $(this).stop().fadeOut(300);
        });

    //위치조정
    var popEle = $('#' + id);
    var popPos = $('.popover-open').position(); //버튼 위치에 띄우고자 할 경우, 위치 정보 가져옴
    popEle.css('top', popPos.top + 'px'); //위치 지정
    popEle.css('left', popPos.left + 'px');
    popoverClose();
}

function popoverClose() {
    //popover close 버튼 클릭시 닫기
    $(document).on('click', '.popover .popover-inner .popover-close', function (e) {
        var $isActive = $(this).parents().hasClass('is-active');
        if ($isActive) {
            $(this).parents().removeClass('is-active');
            $(this).parents().find('.popover-open').attr('aria-expanded', 'false');
            $(this).closest('.popover-inner').stop().fadeOut(300).attr('aria-hidden', 'true');
        }
    });
    //popover 바닥 클릭시 닫기
    $(document).on('click', function (e) {
        if ($('.popover-inner:visible').length && $('.popover').has(e.target).length === 0) {
            $('.popover-inner:visible').each(function () {
                //var id = $(this).attr('id');
                //popover(id);
                $(this).parent().removeClass('is-active');
                $(this).parent().find('.popover-open').attr('aria-expanded', 'false');
                $(this).stop().fadeOut(300);
            });
        }
    });
    //popover 스크롤시 닫기
    $('.container').on('scroll', function (e) {
        if ($('.popover:visible').length) {
            $('.popover:visible').each(function () {
                //var id = $(this).attr('id');
                //popover(id);
                $(this).parent().removeClass('is-active');
                $(this).stop().fadeOut(300);
            });
        }
    });
}

/*-------------------------------------------------------------------
	## Popup - onClick ID 처리 : 열기 onclick="popupOpen('popupBasic', this);"  /  닫기 onclick="popupClose('popupBasic', this)"
-------------------------------------------------------------------*/
var popupOptions = {
    $popArr: [],
    zIndexUnit: 1001,
};
function popupOpen(id, focus) {
    var $popWrap = $('#' + id);
    var $focus = $popWrap.find('.popup');
    var $lastFocus = $focus.find('button').last();
    // var target = $focus
    $popWrap.data('opener', $activeFocus).addClass('is-active').attr('aria-hidden', 'false');
    // $popWrap.addClass('is-active').attr('aria-hidden', 'false');
    $popWrap.one('transitionend', function () {
        if ($(this).hasClass('is-active')) {
            $focus.attr('tabindex', '0').focus();
            $lastFocus.after('<div class="popup-focus" tabindex="0"></div>');
            // popupFocus(target);
        }
    });
    scrollOn();
    changeZindex(id);

    // focus
    $lastFocus.off().on('focusout', function () {
        $focus.focus();
    });
}
function popupClose(id) {
    var $wrapper = $('html');
    var $popWrap = $('#' + id);
    var $focus = $popWrap.data('opener') || $wrapper.find('a:first');
    var $lastFocus = $popWrap.find('button').last();
    $lastFocus.next().remove('.popup-focus');
    $popWrap.removeClass('is-active').attr('aria-hidden', 'true').removeAttr('style');
    $popWrap.one('transitionend', function () {
        if (!$(this).hasClass('is-active')) {
            $focus.focus();
        }
    });
    scrollOff();
}
function changeZindex(id) {
    var zIndex = 1002;
    var $popWrap = $('#' + id);
    var $popCurrent = $('.popup-wrap.is-active').length;
    var zIndexUnit = zIndex + $popCurrent;
    $popWrap.each(function () {
        $(this).css({ 'z-index': zIndexUnit });
    });
}

//////////////// 팝업 포커스 이전 소스 /////////////////////////////
function popupFocus(target, id) {
    if (target == '' || target == undefined) var $popup = $('#' + id);
    else var $popup = $(target);
    $popup.focus();

    $(document).on('focusin click', function (e) {
        if (!$(e.target).parents().is($popup)) {
            // 부모에 팝업이 없으면 팝업으로 되돌리기
            if ($popup.attr('tabindex', '0')) {
                $popup.focus();
            }
            if ($popup.find('.btn-popup').length > 0 && $popup.find('.btn-close').length > 0) {
                $popup.find('button').first().focus();
            } else {
                $popup.find('a').first().focus();
            }
        }
    });
}
////////////////////////////////////////////////////////////////

function selectPopup(id, target, focus) {
    var html = '<div id="selectPopup" class="popup-wrap popup-bottom" role="dialog" aria-modal="modal" aria-hidden="true">';
    html += '	<div class="popup">';
    html += '		<div class="popup-head">';
    html += '			<h2></h2>';
    html += '		</div>';
    html += '		<div class="popup-body">';
    html += '			<div id="' + seletOptionID + '" class="popup-content">';
    html += '			</div>';
    html += '		</div>';
    html += '		<div class="popup-close">';
    html += '			<button type="button" class="btn btn-close" onclick="popupClose(\'selectPopup\')"><span>팝업닫기</span></button>';
    html += '		</div>';
    html += '	</div>';
    html += '</div>';
    $('.select-bottom').append(html);

    var $popWrap = $('#' + id);
    var $focus = $popWrap.find('.popup');
    var target = $focus;
    var seletOptionID = $popWrap.siblings('.select-cont').attr('id');

    $popWrap.data('opener', $activeFocus).addClass('is-active');
    $popWrap.addClass('is-active').attr('aria-hidden', 'false');
    if ($popWrap.hasClass('is-active')) {
        focus != true && $focus.attr('tabindex', '0').focus();
        popupFocus(target);
        scrollOn();
    }

    // select content
    $(document)
        .off('click.selectPop', '.btn-select')
        .on('click.selectPop', '.btn-select', function () {
            var $this = $(this);
            var selTitle = $this.parent().prev('.label-txt').html(); //팝업 타이틀
            var seletOption = $this.parent().siblings('.select-cont').html(); //팝업 내용

            $('#selectPopup .popup-head h2').html(selTitle);
            $('#selectPopup .popup-content').html(seletOption);
            $('#selectPopup li').each(function () {
                var selOption = $(this).html();
                $(this).html('<button type="button"><span>' + selOption + '</span></button>');
            });
        });

    // select val
    $(document)
        .off('click.selectPop', '#selectPopup li button')
        .on('click.selectPop', '#selectPopup li button', function () {
            var userTxt = $(this).parents('li').data('text');

            if ($(this).parents('li').is('[data-text]')) {
                $(this).parents('.select-cont').prev('input').val(userTxt);
                $(this).parents().find('button.btn-select > span').text(userTxt).attr('data-value', userTxt);
            }
            console.log(userTxt);
        });

    // select close
    $(document)
        .off('click.selectPop', '#selectPopup button')
        .on('click.selectPop', '#selectPopup button', function () {
            $('#selectPopup').remove();
            scrollOff();
            popupFocus();
        });
}

//Mobile(ios,android) popup 스크롤막기
function scrollDisable() {
    $('body')
        .addClass('scrollOff')
        .on('scroll touchmove mousewheel', function (e) {
            e.preventDefault();
        });
}
function scrollEnable() {
    $('body').removeClass('scrollOff').off('scroll touchmove mousewheel');
}

/*-------------------------------------------------------------------
    ## Toast Alert Popup
-------------------------------------------------------------------*/
function toastPopInit() {
    $('.toast-popup').each(function () {
        toastEvent();
    });
}
function toastEvent() {
    $('.btn-toast')
        .off('click')
        .on('click', function () {
            var id = $(this).data('id');
            var $target = $('#' + id);

            if (!$(this).hasClass('is-active')) {
                $(this).removeClass('is-active').addClass('is-active').attr('title', '저장함');
                $target.find('p').text('저장되었습니다.');
            } else {
                $(this).removeClass('is-active').attr('title', '');
                $target.find('p').text('취소되었습니다.');
            }
            toastAction($target);
        });
}
function toastAction($target, speed, duration) {
    console.log(speed);

    //css animate 경우
    //$target.animate({'opacity': 1}, 2000, function(){
    //	$target.animate({'opacity': 0});
    //});

    //스크립트로 처리 경우
    $target.fadeIn(speed ? speed : 500, function () {
        setTimeout(
            function () {
                $target.fadeOut(speed ? speed : 500);
            },
            duration ? duration : 1000,
        );
    });
}

/*-------------------------------------------------------------------
    ## Window Popup
-------------------------------------------------------------------*/
function windowPopup(url, name, width, height) {
    var windowWidth = window.screenX < 0 ? window.screenX : document.body.offsetWidth;
    var windowHeight = window.screen.height;

    var popWidth = width ? width : 1000;
    var popHeight = height ? height : 800;
    var popupX = (windowWidth - popWidth) / 2;
    var popupY = (windowHeight - popHeight) / 2;

    console.log('offsetWidth', windowWidth);
    var options = 'top=' + popupX + ', left=' + popupY + ', screenX' + popupX + ', screenY' + ', width=' + popWidth + ', height=' + popHeight + ', status=no, menubar=no, toolbar=no, resizable=no, scrollbars=yes';
    window.open(url, name, options);
}

function windowOpen() {
    $('.winPopup').click(function () {
        windowAction();
    });
}
function windowAction() {
    var url = 'windowopen.html'; //팝업창에 출력될 페이지 URL
    var winWidth = 500;
    var winHeight = 500;
    var popupOption = 'width=' + winWidth + ', height=' + winHeight; //팝업창 옵션(optoin)
    var myWindow = window.open(url, 'TestName', popupOption);
    myWindow.document.write('<h1>' + myWindow.name + '</h1>');
}

/*-------------------------------------------------------------------
	## Loading - 호출예시: 로딩실행 loading('open'); / 로딩닫기 loading('close');
-------------------------------------------------------------------*/
function loading(action, callback) {
    var $body = $('body');
    var $eleModule = $('.loading-wrap');
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
	## Sub slide menu / step menu
-------------------------------------------------------------------*/
function subSlideMenu() {
    var $subMenu = $('.step-wrap > ol');
    if ($subMenu.length) {
        var activeLiLeft = $subMenu.find(' > li.is-active').offset().left,
            activeLiWidth = $subMenu.find('> li').width(),
            activeScrollLeft = $subMenu.scrollLeft();
        $subMenu.scrollLeft(activeLiLeft - 40 + activeScrollLeft);
    }
}

//step 텍스트 가져오기
function stepText() {
    var selector = $('.process-step');
    $('.ele-button').on('click', function () {
        selector.each(function () {
            setTimeout(function () {
                stepEvent();
            }, 300);
        });
    });
}
function stepEvent() {
    var selector = $('.process-step');
    var selectStr = $('.process-step').find('.seceted strong').text();
    //$('.process-step').prev('.blind').remove();
    if (selector.prev('.blind').length == 0) {
        selector.before('<div class="blind"></div>' + selectStr + '</div>');
    }
}

/*-------------------------------------------------------------------
	## Include HTML
-------------------------------------------------------------------*/
function includeLayout() {
    var includeArea = $('[data-include]');
    var self, url;
    $.each(includeArea, function () {
        self = $(this);
        url = self.data('include');
        self.load(url, function () {
            gnbInit();
            self.removeAttr('data-include');
        });
    });
}

/*-------------------------------------------------------------------
	## Header scroll Percent
-------------------------------------------------------------------*/
function headerPercent() {
    var scrollPercent = (100 * $(window).scrollTop()) / ($(document).height() - $(window).height());
    $('.header-line').css('width', scrollPercent + '%');
    $(window).scroll(function () {
        var scrollPercent = (100 * $(window).scrollTop()) / ($(document).height() - $(window).height());
        $('.header-line').css('width', scrollPercent + '%');
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
    var $progress = $('.progress-bar > span');
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

/*--------------------------------------------------------------
	## UI Components
--------------------------------------------------------------*/
/* 버튼효과 */
function waveEffectEvent() {
    var events = null;
    $(document)
        .off('mousedown.waveEffectEvent touchstart.waveEffectEvent')
        .on('mousedown.waveEffectEvent touchstart.waveEffectEvent', '.btn, .tab-nav a', function (e) {
            events = 'mousedown';
            var self = $(this),
                wave = '.effect-wave',
                btnWidth = self.outerWidth();
            if (e.type == 'mousedown') {
                var x = e.offsetX,
                    y = e.offsetY;
            }
            if (e.type == 'touchstart') {
                var x = e.touches[0].pageX - self.offset().left,
                    y = e.touches[0].pageY - self.offset().top;
            }
            if (self.find(wave).length == 0) {
                self.prepend('<span class="effect-wave"></span>');
                $(wave)
                    .css({ top: y, left: x })
                    .stop()
                    .animate({ width: btnWidth * 3, height: btnWidth * 3 }, 400, function () {
                        $(this).addClass('is-complete');
                        if (events == 'mouseup') {
                            $(this)
                                .stop()
                                .animate({ opacity: '0' }, 200, function () {
                                    $(this).remove();
                                });
                        }
                    });
            }
        });
    $(document)
        .off('mouseup.waveEffectEvent touchend.waveEffectEvent')
        .on('mouseup.waveEffectEvent touchend.waveEffectEvent', '.btn, .tab-nav a', function (e) {
            events = 'mouseup';
            var self = $(this),
                wave = '.effect-wave';
            if (self.find(wave).hasClass('is-complete')) {
                $(wave)
                    .stop()
                    .animate({ opacity: '0' }, 200, function () {
                        $(this).remove();
                    });
            }
        });
    $(document)
        .off('click.waveEffectEvent focusin.waveEffectEvent')
        .on('click.waveEffectEvent focusin.waveEffectEvent', function (e) {
            if ($(e.target).is('.btn, .tab-nav a') == false && $('.effect-wave').length) {
                $('.effect-wave')
                    .stop()
                    .animate({ opacity: '0' }, 200, function () {
                        $(this).remove();
                    });
            }
        });
}

/*-------------------------------------------------------------------
	## Popup cookie
-------------------------------------------------------------------*/
//function getCookie(cname){
//	var name = cname + "=";
//	var ca = document.cookie.split(';');
//	for (var i = 0; i < ca.length; i++) {
//		var c = ca[i];
//		while (c.charAt(0) == ' ') c = c.substring(1);
//		if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
//	}
//	return "";
//}

//function setCookie(cname, cvalue, exdays){
//	var d = new Date();
//	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//	var expires = "expires=" + d.toUTCString();
//	document.cookie = cname + "=" + cvalue + "; " + expires;
//}

//function popupClose(){
//	if ($("input[name='popCheck']").is(":checked") == true) {
//		setCookie("close", "Y", 1);
//	}
//	$('.popup').hide();
//}
//$(document).ready(function(){
//	cookiedata = document.cookie;
//	if (cookiedata.indexOf("close=Y") < 0) {
//		$('.popup').show();
//	} else {
//		$('.popup').hide();
//	}
//	$('.btn-popupClose').click(function () {
//		popupClose();
//	});
//});
