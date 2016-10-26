$(document).ready(function () {
    if (main == 1) {
        moveScroll();
        topNavScrolling();
    }
    requestImgHover();
    slideToggle();
});
$(window).on("load", function () {
    if (main == 1) {
        // topNavFirst();
        topNavFirst();
        console.log("main");

    }
});




topNavScrolling = function () {
    if (jQuery(window).width() > 0) {
        jQuery(window).on("scroll", function (ev) {
            if (jQuery(window).scrollTop() > 80) {
                $('.navbar-fixed-top').css('background-color', 'rgba(25, 38, 65,1)');
            } else {
                $('.navbar-fixed-top').css('background-color', 'rgba(25, 38, 65,0)');
            }
            return false;
        });
    }
}
topNavFirst = function () {
    if (jQuery(window).scrollTop() > 80) {
        $('.navbar-fixed-top').css('background-color', 'rgba(25, 38, 65,1)');
    } else {
        $('.navbar-fixed-top').css('background-color', 'rgba(25, 38, 65,0)');
    }
}
// homedStoryNavSetting = function () {
//     $(".navbar-fixed-top").css('background-color', '#192641');
//     $(".request-img").css("color", "white");
//     $(".request-img").css("background-color", "transparent");
//     $(".request-img").css("border", "1px solid white");
//     $(".request-img").hover(function () {
//         $(".request-img").css("color", "#192641");
//         $(".request-img").css("background-color", "white");
//         $(".request-img").css("border", "1px solid white");
//     }, function () {
//         $(".request-img").css("color", "white");
//         $(".request-img").css("background-color", "transparent");
//         $(".request-img").css("border", "1px solid white");
//     })
// }
moveScroll = function () {
    $('a[href^="#page"]').click(function () {
        var speed = 800;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position;
        if (target.selector == "#page-service") {
            position = target.offset().top - 50;
        } else {
            position = target.offset().top - 100;
        }
        $('body,html').animate({scrollTop: position}, speed, 'swing');
        return false;
    });
}

requestImgHover = function () {
    $(".request-img").hover(function () {
        $(".request-img").css("color", "black");
        $(".request-img").css("background-color", "white");
    }, function (){
        $(".request-img").css("color", "white");
        $(".request-img").css("background-color", "transparent");
    });
}

slideToggle = function () {
    $(".aside-menu-request-btn-a").click(function () {
        $('.aside-slide').css("transform", "translateX(0px)");
        $('.navbar-fixed-top').css("transform", "translateX(0px)");
        $(".xs-slide-bar-button").css("display", 'inline');
        $("html").css("overflow-y","auto");
        $("html").css("overflow-x","hidden");
        $("body").css("overflow-y","auto");
        $("body").css("overflow-x","hidden");
        $(".aside-menu").css("display","none");
        $("#main-container-cover").css("display","none");
    })
    $(".xs-slide-bar-button").click(function () {
        $('.aside-slide').css("transform", "translateX(270px)");
        $('.navbar-fixed-top').css("transform", "translateX(270px)");
        $(".xs-slide-bar-button").css("display", 'none');
        $("html").css("overflow","hidden");
        $("body").css("overflow","hidden");

        $(".aside-menu").css("display","block");
        $("#main-container-cover").css("display","block");
    });
    $(".aside-menu-exit-conatiner").click(function() {
        $('.aside-slide').css("transform", "translateX(0px)");
        $('.navbar-fixed-top').css("transform", "translateX(0px)");
        $(".xs-slide-bar-button").css("display", 'inline');
        $("html").css("overflow-y","auto");
        $("html").css("overflow-x","hidden");
        $("body").css("overflow-y","auto");
        $("body").css("overflow-x","hidden");

        $(".aside-menu").css("display","none");
        $("#main-container-cover").css("display","none");
    })
}