/**Empty node module disallows JSmodule requires
 * 
 */
$(window).scroll(function() {
	if($('.navbar').offset().top > 50) {
		$('.navbar-fixed-top').addClass('top-nav-collapse');
	}
	else {
		$('.navbar-fixed-top').removeClass('top-nav-collapse');
	}
});

$(function() {
	$('a[href*="#"]:not([href="#"])').click( function() {
		console.log("location.pathname: " + location.hostname);
		console.log("this object.pathname: " + this.hostname);
		if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hashslice(1) + ']');
			console.log(target);
			event.preventDefault();
			if(target.length) {
				$('html, body').animate( {
					scrollTop: target.offset().top
				}, 1500, 'easeInOutExpo');
			}
		}
		
	});
});


