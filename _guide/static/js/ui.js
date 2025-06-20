var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

$(function() {
	uiInit();
});

function uiInit() {
    eleFocus();
    formInit();
	autoEmail();
    accodiInit();
	popupHeader();
}

/* Form */
function formInit(){
    inputMotion();
	inputDelete();
}
function inputMotion(){
	// focus
	$('.form-input').on('focusin', function(){
		$(this).closest('.input-group').addClass('is-focus');
	});
	$('.form-input').on('focusout', function(){
		$(this).closest('.input-group').removeClass('is-focus');
		if($(this).val() != '') { //값이 존재하면
			$(this).closest('.input-group').addClass('is-data');
		} else {
            $(this).closest('.input-group').removeClass('is-data');
        }
	});

	// label text click
	$(document).on('click', '.input-group .label-txt', function(){
		$(this).next('input').focus();
	});
}
function inputDelete(){
	$(document).on('focusin input paste', function(e){
		if($(e.target).parents().is('.has-delBtn') && !$(e.target).is('[readonly]')) {
			$('.has-delBtn button.input-del').hide();
			$this = $(e.target).parents('.has-delBtn').find('input');
			if($this.val() != '') { //값이 존재하면
				if($this.siblings('button.input-del').length == 0) { //삭제버튼이 없으면
					$this.after('<button type="button" class="input-del"><span>내용지우기</span></button>');
					$this.next('button.input-del').show();
				}
				else {
					$this.next('button.input-del').show();
				}
			}
		} 
		else {
			$('.has-delBtn button.input-del').hide();
		}
	});
	$(document).on('touchstart click', function(e){
		if(!$(e.target).parents().is('.has-delBtn')) {
			$('.has-delBtn button.input-del').hide();
		}
	});
	$(document).on('click', '.has-delBtn button.input-del', function(){
		$(this).prev('input').val('').focus();
		$(this).remove();
	});
}
// email
function autoEmail(){
	var hosts = [ "naver.com", "gmail.com", "daum.net", "nate.com" ];

	var action = function(){
		$("#email").autocomplete({
		   autoFocus: true,
		   minLength: 3, // 3글자부터 작동
		   source: function setAutocompleteSource(request, response) {
				var term = request.term
				var atIndex = term.indexOf("@")
				var name = term
				var host = ""
				var result = []
				// 현재 입력한 문자열 추가
				result.push(term)
	   
				if (atIndex > -1) {
				   name = term.slice(0, atIndex)
				   host = term.slice(atIndex + 1)
				}
				if (name) {
					var findedHosts = hosts.filter(function(item) {
						return item.indexOf(host) > -1;
					});
					var findedResults = findedHosts.map(function(host) {
						return name + "@" + host;
					});
					result = result.concat(findedResults)
					// 중복 제거: 사용자가 입력한 문자열과 자동완성된 문자열이 동일한 경우 제거
					// 예: pcjpcj2@gmail.com 을 끝까지 입력한 상태에서 
					// 자동완성 문자열에 pcjpcj2@gmail.com이 두개 나올 수 있음
					result = result.filter(function(element, position) {
						return result.indexOf(element) === position
					});
				}
				response(result);
			}
		});
	}
	action();
}

/* Accordion */
function accodiInit(){
	$(document).on('click','.accordion .item-tit', function(){
		var id = $(this).closest('li').attr('id');
		accodiAction(id);
		if($(this).parent().hasClass('is-active')) { $(this).find('.btn-toggle').attr('aria-expanded', 'true'); }
	});
}
function accodiAction(id){
 	var $accodi = $('#' + id);
 	if ($accodi.hasClass('is-active')){
 		$accodi.removeClass('is-active');
 		$accodi.find('.item-cont').stop().slideUp(350);
 	} else {
		$accodi.addClass('is-active');
		$accodi.find('.item-cont').stop().slideDown(350);
		$accodi.siblings().find('.item-cont').stop().slideUp(350); //개별로 펼칠 경우 주석처리
		$accodi.siblings().removeClass('is-active'); //개별로 펼칠 경우 주석처리
		$accodi.siblings().find('.btn-expand').attr('aria-expanded', 'false');
 	}
}

// popup header scroll
function popupHeader(){
	$('.popup-full .popup-body').scroll(function(){
		if ($(this).scrollTop() > 0) {
		   $(this).closest('.popup').addClass('is-scrolled');
		} else {
		   $(this).closest('.popup').removeClass('is-scrolled');
		}
	});
}

/* Utility Function */
// focus
function eleFocus(){
    $(document).off('focusin.eleEvent click.eleEvent').on('focusin.eleEvent click.eleEvent', function(e){
        $activeFocus = $(e.target);
    });
}
// scroll on,off
function scrollOn(){
    var $body = $('body');
    var $wrapper = $('.wrapper');
	setTimeout(function(){  
		$body.addClass('scrollOff'); 
		$wrapper.attr('aria-hidden', 'true');
	}, 50);
}
function scrollOff(){
    var $body = $('body');
	var $wrapper = $('.wrapper');
    setTimeout(function(){ 
		$body.removeClass('scrollOff'); 
		$wrapper.removeAttr('aria-hidden');
	}, 50);
}

/* Modal */
// popup - 팝업열기 onclick="popupOpen('popupBasic', this);" / 팝업닫기 onclick="popupClose('popupBasic', this)"
function popupOpen(id, focus){
	var $popWrap = $('#'+id);
	var $focus = $popWrap.find('.popup');
	var $lastFocus = $focus.find('button').last();
	$popWrap.data('opener', $activeFocus).addClass('is-active').attr('aria-hidden', 'false');
	// $popWrap.addClass('is-active').attr('aria-hidden', 'false');
	$popWrap.one('transitionend', function(){
		if ($(this).hasClass('is-active')){
			focus != true && $focus.attr('tabindex','0').focus();
			$lastFocus.after('<div class="popup-focus" tabindex="0"></div>');
		}
	});
	scrollOn();
	changeZindex(id);

	// focus
	$lastFocus.off().on('focusout', function(){
		$focus.focus();
	});
}
function popupClose(id){
	var $wrapper = $('html');
	var $popWrap = $('#'+id);
	var $focus = $popWrap.data('opener') || $wrapper.find('a:first');
	var $lastFocus = $popWrap.find('button').last();
	$lastFocus.next().remove('.popup-focus');
	$popWrap.removeClass('is-active').attr('aria-hidden', 'true').removeAttr('style');
	$popWrap.one('transitionend', function(){
		if (!$(this).hasClass('is-active')){
			$focus.focus();
		}
	});
	scrollOff();
}
function changeZindex(id){
	var zIndex = 1002;
	var $popWrap = $('#'+id);
	var $popCurrent = $('.popup-wrap.is-active').length;
	var zIndexOption = zIndex + $popCurrent;
	$popWrap.each(function() {
		$(this).css({'z-index':zIndexOption});
	});
}