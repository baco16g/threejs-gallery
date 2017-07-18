/*global $ b:true*/

$(function(){
	//スクロール禁止用関数
	function no_scroll(){
		//PC用
		let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).on(scroll_event, function(e){e.preventDefault();});
		//SP用
		$(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
	}
	//スクロール復活用関数
	function return_scroll(){
		//PC用
		let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).off(scroll_event);
		//SP用
		$(document).off('.noScroll');
	}

	no_scroll();
});
