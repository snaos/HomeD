


$(document).ready(function () {
	navbar_color_change();
});
navbar_color_change = function () {
		    $('#navbar').css({
		    	'background-color' :'rgba(255, 255, 255,1)',
		    	'border-bottom': '1.5px solid rgba(174,174,174,0.68)'
		    });
		    $(".homed-logo-change-class").attr("src", "/icon/logo_black.png");
		    $(".navbar-menu-div > ul> li > a").css({
		    	color:'black'
		    });
		    $(".doInterior-box-div").css({"color":'black',
						'border': '1px solid black'});
		    $(".doInterior-box-div-text").css({
		    	'color':'black'
		    })
		    $(".nav-triangle").css({
		    	'border-color': 'transparent transparent transparent black'
		    });

		return false;
}