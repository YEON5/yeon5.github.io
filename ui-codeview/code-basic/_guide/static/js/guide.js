var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

$(function() {
	gIncludeHtml();	
	setTimeout(function(){
		guideUI();		
	},50);	
});

function guideUI() {	
	gSnbInit();
	gsnbSet();
	gToggle();
    gScrollTop();
	gViewPort();
	saveLocal('g-textfield');
}

// Snb
function gSnbInit(){
    $(document).on('click','.g-header .g-btn-aside',function(){
        var $wrapper = $('#g-wrapper');
        var $hasCls = $('#g-wrapper').hasClass('g-aside-closed');
        if (!$hasCls){
            $wrapper.addClass('g-aside-closed');
            $wrapper.removeClass('g-aside-opened');			
        }else{
            $wrapper.addClass('g-aside-opened');
            $wrapper.removeClass('g-aside-closed');
        }
    });
}

function gsnbSet(){	
	const asideEl = document.querySelector('#g-aside');
	const depth2Els = asideEl.querySelectorAll('.g-node2');
	depth2Els.forEach((button)=>{
		const dataName = button.querySelector('a').getAttribute('data-name');
		button.querySelector('a').addEventListener('click', ()=>{
			saveLocal(dataName);
		});		
	});
	
	function asideAct(){
		let localState = JSON.parse(localStorage.nameArray);

		depth2Els.forEach((button, idx)=>{
			const dataName = button.querySelector('a').getAttribute('data-name');
			button.classList.remove('is-current');
			if( localState === dataName ){
				depth2Els[idx].classList.add('is-current');
			}
		});
	}
	asideAct();
}

function saveLocal(dataName){
	let nameArray;
	if( localStorage.getItem('dataName') === null ){
		nameArray = [];
	} else {
		nameArray = JSON.parse(localStorage.getItem('nameArray'));
	}
	nameArray.push(dataName);
	localStorage.setItem('nameArray', JSON.stringify(dataName));
}

/* Toggle */
function gToggle(){
	$(document).on('click', '.btn-drop', function(){
        var $ele = $(this).closest('.codebrush-wrap');
		$ele.toggleClass('is-active', function(){
			$ele.find('.codebrush').stop().slideToggle(200);
		});
	});
}
// Scroll Top
function gScrollTop(){
    $(window).on('scroll', function(e) {
		var $btnScroll = $('.g-top');
		if ($(this).scrollTop() > 100) {
			$btnScroll.addClass('is-active');
		}
        else {
			$btnScroll.removeClass('is-active');
		}
	});
	$(document).on('click', '.g-top', function(e){
		e.preventDefault();
		$('html').animate({
			scrollTop: 0
		}, 300);
	});
}

// Viewport resize
function gViewPort(){
	var $wrapper = $('#g-wrapper');
	$(window).on('resize', function(){
		if (window.innerWidth <= 768) {
			$wrapper.addClass('g-aside-closed');
		}
		else {
			$wrapper.removeClass('g-aside-closed');
		}
	});
}

function gInclude(){
	

	
}

function gIncludeInit(){
	var incCom = false;
	setInterval(function () {
		if (ui.html.incCom) {
			clearInterval(ui.html.times);
			ui.init();
		}
	});
}

// Html Include
function gIncludeHtml(){
	var _this = this;
	var $inchtml = $("include");
	var incAmt = 0;
	if ($inchtml.length) {
		$inchtml.each(function (idx) {
			var inc = $(this).attr("src");
			// console.log(inc);
			var incopt = $(this).data("include-opt");

			var incNums = $inchtml.length;
			$(this).load(inc, function (response, status, xhr) {
			// console.log( inc, idx+1 , incNums,  status, xhr);

			if (incopt) {
				console.log(inc, incopt);
			}
			if (incopt && incopt.visible == "true") {
				// console.log("show" , $(this));
				$(this).find(">*").show().data("visible", true);

			}
			if (incopt && incopt.visible == "false") {
				$(this).find(">*").hide().data("visible", false);
			}
			if (incopt && incopt.class) {
				var incObjEls = {
				//"해당클래스가 있을시" : "해당 클래스가 block"
				".header.header--title": ".header-title",
				".header.header--close": ".header-close",
				".header.header--back": ".header-back"
				};
				var arrcls = incopt.class.replace(/ /g, "").split(",");
				console.log("arrls", inc, arrcls);
				for (var key in arrcls) {
				var cls = arrcls[key];
				//var rks = cls.replace("is-","");
	
				$(this).find(">*").addClass(cls);
				}
				for (var skey in incObjEls) {
				var els = incObjEls[skey];
				// console.log(skey,"  =   ",els  , $(this).find(">*"));
	
				$(this).find(">*").find(els).hide();
				console.log('test',els);

				if ($(this).find(">*").is(skey)) {
					// console.log("Ddd",els ,$(this).find(">*"));
					$(this).find(">*").find(els).show();
				}
				}
				$("#header .header-title").html(incopt.title); // data-include-opt title 사용
			}
	
			$(this).find(">*").unwrap();
			incAmt++;
			if (status == "success") {
			} else if (status == "error") {
				_this.incCom = false;
				console.log("include 실패", inc);
				if (typeof _this.loadCallback == "function") _this.loadCallback();
			}
			if (incAmt == incNums) {
				_this.incCom = true;
				// ui.html.set.tit();
				if (typeof _this.loadCallback == "function") _this.loadCallback();
			}
			});
		});
	} else {
		_this.incCom = true;
		ui.html.set.tit();
		if (typeof _this.loadCallback == "function") _this.loadCallback();
		
	}
	
	//console.log("완료" + _this.incCom);
}