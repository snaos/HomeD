var mainSlideNo = 3;
var slideNo = 2;
var slideNm = 'slide-text-div-';
$(document).ready(function () {
    mainPageSizeSetting();

    animateImgs();
    owlCarouselSetting();
    hoverPortpolioImg();
});
$(window).scroll(function () {
    animateImgs();
})
$(window).resize(function () {
    mainPageSizeSetting();
})
owlCarouselSetting = function () {
    var owl = $('.homed-story-carousel-items');
    owl.owlCarousel({
        loop:true,
        autoPlay:true,
        autoplayTimeout : 3000,
        autoplayHoverPause : true,
        center : true,
        margin : 30,
        nav : false,
        items : 3,
        responsiveClass:true,
        responsive: {
            0 : {
                items : 1,
                center : true,
            },
            480: {
                items : 2
            },
            900 : {
                items : 3
            }
        }
    });
    $(".homed-story-carousel-next").click(function(){
       owl.trigger('next.owl.carousel');
    })
    $(".homed-story-carousel-prev").click(function(){
       owl.trigger('prev.owl.carousel');
    })
}
hoverPortpolioImg = function () {
    $(".carousel-item").hover(function () {
        $(this).find(".homed-story-hover-div").css("display", "block");
    }, function (){
        $(this).find(".homed-story-hover-div").css("display", "none");
    });
}
mainPageSizeSetting = function () {
    $(".page-between-home-intro").css("height", $(".home").height());
    if( $(window).width() < 768){
        $(".home-main-text-easy-p").css("font-size", "75px");
        $(".slide-text-div").css("font-size", "30px");
        $(".home-main-text-1").removeClass("parallax__layer").removeClass("parallax__layer--front");
        $(".main-request-btn").css("width", "150px");
    } else {
        $(".home-main-text-easy-p").css("font-size", $(window).width() / 12);
        $(".slide-text-div").css("font-size", $(window).width() / 35);
        $(".main-request-btn").css("width", $(window).width() / 7);
        $(".main-request-btn").css("font-size", $(window).width() / 50);
        $(".home-main-text-1").addClass("parallax__layer").addClass("parallax__layer--front");
    }
}
mainPageSlideSetting = function () {
    $(".slide-text-div").fadeOut(400, function () {
        if (slideNo == 1) {
            $(".slide-text-div").find("img").eq(0).removeClass("main_slide_color_line-none");
            $(".slide-text-div").find("img").eq(2).addClass("main_slide_color_line-none");
            $(".slide-text-div-text").empty();
            $(".slide-text-div-text").text("집 꾸미기");
            slideNo++;
        } else if (slideNo == 0) {
            $(".slide-text-div").find("img").eq(2).removeClass("main_slide_color_line-none");
            $(".slide-text-div").find("img").eq(1).addClass("main_slide_color_line-none");
            $(".slide-text-div-text").empty();
            $(".slide-text-div-text").text("인테리어")
            slideNo++;
        } else {
            $(".slide-text-div").find("img").eq(1).removeClass("main_slide_color_line-none");
            $(".slide-text-div").find("img").eq(0).addClass("main_slide_color_line-none");
            $(".slide-text-div-text").empty();
            $(".slide-text-div-text").text("홈스타일링")
            slideNo = 0;
        }
        $(".slide-text-div").fadeIn(400, function () {
        });
    });
}
setInterval(mainPageSlideSetting, 4000);
scrollUpDetection = function () {
    var lastScrollTop = 0;
    $(window).on('scroll', function () {
        var st = $(this).scrollTop();
        if (st < lastScrollTop) {
            $(".nav-right-bar").css("display", "none");
        } else {
            $(".nav-right-bar").css("display", "flex");
        }
        lastScrollTop = st;
        return false;
    });
}
animateImgs = function () {
    if ($(window).scrollTop() > ($(".page-homed-story").offset().top - $(".page-homed-story").height())) {
        $(".homed-story-img").fadeIn(800, function () {
        });
    }
    // if ($(window).scrollTop() > ($(".page-homed-app").offset().top - $(".page-homed-app").height())) {
    //     $(".homed-app-img").fadeIn(800, function () {
    //     });
    // }
    return false;
}