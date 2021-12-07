/*
	Twenty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
	breakpoints({
		wide: ['1281px', '1680px'],
		normal: ['981px', '1280px'],
		narrow: ['841px', '980px'],
		narrower: ['737px', '840px'],
		mobile: [null, '736px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1000,
		offset: function () { return $header.height() + 10; }
	});

	// Dropdowns.
	$('#nav > ul').dropotron({
		mode: 'fade',
		noOpenerFade: true,
		expandMode: (browser.mobile ? 'click' : 'hover')
	});

	// Nav Panel.

	// Button.
	// 	$(
	// 		'<div id="navButton">' +
	// 			'<a href="#navPanel" class="toggle"></a>' +
	// 		'</div>'
	// 	)
	// 		.appendTo($body);

	// // Panel.
	// 	$(
	// 		'<div id="navPanel">' +
	// 			'<nav>' +
	// 				$('#nav').navList() +
	// 			'</nav>' +
	// 		'</div>'
	// 	)
	// 		.appendTo($body)
	// 		.panel({
	// 			delay: 500,
	// 			hideOnClick: true,
	// 			hideOnSwipe: true,
	// 			resetScroll: true,
	// 			resetForms: true,
	// 			side: 'left',
	// 			target: $body,
	// 			visibleClass: 'navPanel-visible'
	// 		});

	// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
	if (browser.os == 'wp' && browser.osVersion < 10)
		$('#navButton, #navPanel, #page-wrapper')
			.css('transition', 'none');

	// Header.
	if (!browser.mobile
		&& $header.hasClass('alt')
		&& $banner.length > 0) {

		$window.on('load', function () {

			$banner.scrollex({
				bottom: $header.outerHeight(),
				terminate: function () { $header.removeClass('alt'); },
				enter: function () { $header.addClass('alt reveal'); },
				leave: function () { $header.removeClass('alt'); }
			});

		});

	}

	//Collapsible script - taken from macrofade
	// var type = ['collapsible']
	// for (j = 0; j < type.length; j++) {
	var coll = document.getElementsByClassName('collapsible');
	var i;

	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function () {
			this.classList.toggle("active");
			var content = this.nextElementSibling;
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + "px";
			}
		});
	}
	// }

	//Collapsible script
	// Change div class to Collaspsible Model Active
	// var type = ['collapsibleModel']
	// for (j = 0; j < type.length; j++) {
	var coll1 = document.getElementsByClassName('collapsibleModel');
	// var coll1 = document.getElementsByClassName('symbolExpand');
	var j;


	// This works! makes clickable area for expanding bigger, then clean up, then create rest of assumptions

	for (j = 0; j < coll1.length; j++) {
		// var symbol = this.getElementsByClassName('symbolExpand')
		if (coll1[j].getElementsByClassName('symbolExpand')[0] != undefined) {
			// console.log(coll1[j])
			coll1[j].addEventListener("click", function () {
				console.log('clicked')
				// coll1[j].getElementsByClassName('symbolExpand')[0].addEventListener("click", function () {

				// this.classList.toggle("active");
				// var content = this.nextElementSibling;

				// var parent = child.parentElement;
				var parent = this;
				var child = parent.children[1];
				var content = parent.nextElementSibling;
				if (content.style.maxHeight) {
					content.style.maxHeight = null;
					child.innerHTML = '<b>+</b>'
					// document.getElementById('symbolExpand').innerHTML = '<b>+</b>'
				} else {
					content.style.maxHeight = content.scrollHeight + "px";
					child.innerHTML = '<b>-</b>'
					// document.getElementById('symbolExpand').innerHTML = '<b>-</b>'
				}
			});
		}
	}


})(jQuery);


