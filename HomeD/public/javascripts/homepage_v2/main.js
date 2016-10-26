
$(document).ready(function () {
	// portpolio_carousel_setting();
	// designer_carousel_setting();
	flow_step_showing_setting();
	moveScroll();
});
$(window).on("load", function () {
	navbar_color_change();
	// if($(window).scrollTop() > 80) {
	//     $('#navbar').css('background-color', 'rgba(25, 38, 65,1)');
	// } else {
	//     $('#navbar').css('background-color', 'rgba(25, 38, 65,0.2)');
	// }
	$('.portpolio-carousel-celld').height($(".portpolio-carousel-main-img").height()+3);
	return false;
});
$(window).resize(function () {
	$('.portpolio-carousel-celld').height($(".portpolio-carousel-main-img").height()+3);
})
$(window).scroll(function () {
	flow_step_showing_scroll();
})

navbar_color_change = function () {
	$(window).on("scroll", function (ev) {
		if($(window).scrollTop() > 80) {
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
		} else {
		    $('#navbar').css({'background-color': 'rgba(0, 0, 0,0.3)',
		    		    	'border-bottom': '1.5px solid rgba(174,174,174,0)'});
        $(".homed-logo-change-class").attr("src", "/icon/logo_white.png");
        $(".navbar-menu-div > ul> li > a").css({
        	color:'white'
        });
        $(".doInterior-box-div").css({"color":'white',
    				'border': '1px solid #f2c535'});
        $(".doInterior-box-div-text").css({
        	'color':'white'
        })
        $(".nav-triangle").css({
        	'border-color': 'transparent transparent transparent white'
        });

			}
		return false;
	});
}
//포트폴리오 캐러셀 세팅
// portpolio_carousel_setting = function () {
// 	$('.portpolio-carousel').flickity({
// 	  // options
// 	  cellAlign: 'left',
// 	  imagesLoaded: true,
// 	  contain: true,
// 	  percentPosition: false,
// 	  wrapAround: true,
// 	  prevNextButtons: true,
// 	  pageDots: false,
// 	});
// }

//디자이너 캐러셀 세팅
// designer_carousel_setting = function () {
// 	$('.designer-carousel').flickity({
// 		cellAlign: 'left',
// 		imagesLoaded: true,
// 		autoPlay: 1500,
// 		contain: true,
// 	  wrapAround: true,
// 	  pageDots: false,
// 	});
// 	$('.portpolio-carousel-celld').height($(".portpolio-carousel-main-img").height());
// }

//flow step에서 위치 설정
flow_step_showing_setting = function () {
	$('.main-homed-flow-step-left-div').css({
		left : "-200px",
		opacity : 0,
		position : "relative"});
	$('.main-homed-flow-step-right-div').css({
		right : "-200px",
		opacity : 0,
		position : "relative"});
	for(var i = 0 ; i < $('.main-homed-flow-step-div').length; i++ ){
		if( $('.main-homed-flow-step-div:nth-child(' + (i+1) +')').offset().top+210 < ($(window).height()+$(window).scrollTop()) ) {
				$('.main-homed-flow-step-left-div:eq(' + i +')').animate({
					opacity : 1,
					left : 0,
				}, 1000,function () {
				});
				$('.main-homed-flow-step-right-div:eq(' + i +')').animate({
					opacity : 1,
					right : 0,
				}, 1000,function () {
				});
		}
	}
}
//해당 지점 도착하면 flow step이 좌우에서 나옴.
flow_step_showing_scroll = function () {
	for(var i = 0 ; i < $('.main-homed-flow-step-div').length; i++ ){
		if( $('.main-homed-flow-step-div:nth-child(' + (i+1) +')').offset().top+200 < ($(window).height()+$(window).scrollTop()) ) {
				$('.main-homed-flow-step-left-div:eq(' + i +')').animate({
					opacity : 1,
					left : 0,
				}, 1000,function () {
				});
				$('.main-homed-flow-step-right-div:eq(' + i +')').animate({
					opacity : 1,
					right : 0,
				}, 1000,function () {
				});
		}
	}
}

moveScroll = function () {
    $('a[href^="#main"]').click(function () {
        var speed = 800;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position;
        if (target.selector == "#main-homed-price") {
            position = target.offset().top - 20;
        } else {
            position = target.offset().top - 50;
        }
        $('body,html').animate({scrollTop: position}, speed, 'swing');
        return false;
    });
}