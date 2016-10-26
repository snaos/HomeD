var homesytlingStatus = false;
var consultingStatus = false;
var roomSelect = {};
var minRoomSelect = -1;
var roomSelectStatus = 0;
var minRoomInspirationSelect = -1;
var roomInspirationImgs = {};
var roomInspirationImgsStatus = 0;
var pageValue = 1;
var homestyling_offline_meeting = "none";
var pagingBoolean = true;
var nextButtonActive = false;
var matching_img_no = 0;
var userInfo = {};
var body_min_height = 900;
var nowFlow = 1;
var selectedConcept = "none";
$(document).ready(function () {
    flowSetting();
    clickNextOrPrev();
    offlineCheck();
    nextHover();
    flowIntroClick();
    clickConceptImg();
    barColorChange();
    clickZoomInButton();
    selectFlowShowFlowImgSetting();
    moveNextTabIndex();
});
$(window).resize(function () {
    selectFlowShowFlowImgSetting();
    return false;
});
barColorChange = function () {
    var originBorder = $(".room-image-div").css("border");
    if (serviceType == 1) {
        $(".doInterior-bar-color").attr("src", "/images/mainpage_line_2.png");
        $(".select-flow-start-title-p").html("홈디 서비스 1");
        $(".room-image-div").hover(function () {
            $(this).css("border", "2.5px solid #057fb2")
        }, function () {
            if ($(this).children("img").attr("src").indexOf("click") > 0) {
                $(this).css("border", "2.5px solid #057fb2")
            } else {
                $(this).css("border", "2.5px solid rgba(0,0,0,0.25)");
            }
        });
    } else {
        $(".room-image-div").hover(function () {
            $(this).css("border", "2.5px solid #f4af00")
        }, function () {
            if ($(this).children("img").attr("src").indexOf("click") > 0) {
                $(this).css("border", "2.5px solid #f4af00");
            } else {
                $(this).css("border", "2.5px solid rgba(0,0,0,0.25)");
            }
        });
    }
}
flowSetting = function () {
    $(".homestyling-btn").click(function () {
        $('body,html').animate({scrollTop: 0}, 0);
        homesytlingStatus = true;
        consultingStatus = false;
        nextButtonActive = false;
        $(".navbar-fixed-bottom").css("visibility", "visible");
        othersHide("select-room");
        $('body').css("min-height", "900px");
    });
    $(".consulting-btn").click(function () {
        consultingStatus = true;
        homesytlingStatus = false;
    });
    $(".homestylingAconsulting-btn").click(function () {
        homesytlingStatus = true;
        consultingStatus = true;
    });
    return false;
}
$(".room-image").click(function () {
    var imgSrc = $(this).attr("src");
    if (imgSrc.indexOf("_click") == -1) {
        roomSelect[imgSrc] = true;
        $(this).attr("src", $(this).attr("src").replace(".png", "_click.png"));
        if (serviceType == 1) {
            $(this).parent().css("border", "2.5px solid #057fb2");
        } else {
            $(this).parent().css("border", "2.5px solid #f4af00");
        }
        nextButtonActive = true;
        roomSelectStatus++;
    } else {
        $(this).attr("src", $(this).attr("src").replace("_click", ""));
        imgSrc = $(this).attr("src");
        $(this).parent().css("border", "2.5px solid #C5C3C3");
        roomSelect[imgSrc] = false;
        roomSelectStatus--;
        if (roomSelectStatus == 0) {
            nextButtonActive = false;
        }
    }
    return false;
});
$(document).on('click', ".room-inspiration-img", function () {
    if (!roomInspirationImgs[$(this).attr("src")]) {
        roomInspirationImgs[$(this).attr("src")] = true;
        $(this).css("border", "1px solid  #B1ACAC");
        $(this).css("-ms-filter","'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)'");
        $(this).css("filter","alpha(opacity=50)");

        var click_img = $(this).parent().next().find('img');
        click_img.css("display", "block");
        roomInspirationImgsStatus++;
        if (roomInspirationImgsStatus == 1) {
            $(".navbar-bottom-page-no").html('2개 더 선택해 주세요');
        } else if (roomInspirationImgsStatus == 2) {
            $(".navbar-bottom-page-no").html('1개남았습니다!');
        } else if (roomInspirationImgsStatus > 2) {
            nextButtonActive = true;
            $(".navbar-bottom-page-no").html('다음으로 넘어갈 수 있습니다. 3개 이상 선택하셔도 좋아요');
        }
    } else {
        roomInspirationImgs[$(this).attr("src")] = false;
        $(this).css("filter", "0");
        $(this).css("filter", "grayscale(0%)");
        $(this).css("-moz-webkit-filter", "0");
        $(this).css("-moz-filter", "grayscale(0%)");
        $(this).css("-webkit-filter", "0");
        $(this).css("-webkit-filter", "grayscale(0%)");
        $(this).css("border", "0px solid");
        $(this).parent().next().find('img').css("display", "none");
        roomInspirationImgsStatus--;
        if (roomInspirationImgsStatus < 3) {
            nextButtonActive = false;
            if (roomInspirationImgsStatus == 2) {
                $(".navbar-bottom-page-no").html('1개남았습니다!');
            } else if (roomInspirationImgsStatus == 1) {
                $(".navbar-bottom-page-no").html('2개 더 선택해 주세요');
            } else if (roomInspirationImgsStatus == 0) {
                $(".navbar-bottom-page-no").html('3개 이상의 이미지를 선택해 주세요!');
            }
        }
    }
    return false;
})

offlineCheck = function () {
    $(".offline-select-div-check-box-online").click(function () {
        homestyling_offline_meeting = false;
        $(".offline-select-div-check-box-online").css("background-color", "black");
        $(".offline-select-div-check-box-offline").css("background-color", "white");
        $(".offline-meeting-price-div").text('0 원');
    });
    $(".offline-select-div-check-box-offline").click(function () {
        homestyling_offline_meeting = true;
        $(".offline-select-div-check-box-online").css("background-color", "white");
        $(".offline-select-div-check-box-offline").css("background-color", "black");
        $(".offline-meeting-price-div").text('100,000 원');
    });
    return false;
}
othersHide = function (section) {
    $(".select-flow").css('display', 'none');
    $(".select-room").css('display', 'none');
    $(".concept-select-page").css('display', 'none');
    $(".offline-select-page").css('display', 'none');
    $(".room-inspiration").css('display', 'none');
    $(".user-info").css('display', 'none');
    $(".final-confirmation").css('display', 'none');
    $(".matching-container").css('display', 'none');
    section = "." + section;
    if (section == ".concept-select-page") {
        $(section).css('display', 'inline-block');
    } else {
        $(section).css('display', 'block');
    }
    return false;
}
flowIntroClick = function () {
    $(".select-flow-show-flow-button").click(function () {
        $(".select-flow-show-flow-button").children("p").css("color", "black");
        $(".select-flow-show-flow-button").children("img").css("visibility", "hidden");
        $(this).children("p").css("color", "white");
        $(this).children("img").css("visibility", "visible");
        if ($(this).attr("class").indexOf("1") > -1) {
            $(".select-flow-show-flow-content").css("display", "none");
            $(".select-flow-show-flow-1").css("display", "block");
            $(".select-flow-show-flow-button").css("color", "white");
            nowFlow = 1;
        } else if ($(this).attr("class").indexOf("2") > -1) {
            $(".select-flow-show-flow-content").css("display", "none");
            $(".select-flow-show-flow-2").css("display", "block");
            $(".select-flow-show-flow-button").css("color", "white");
            nowFlow = 2;
        } else if ($(this).attr("class").indexOf("3") > -1) {
            $(".select-flow-show-flow-content").css("display", "none");
            $(".select-flow-show-flow-3").css("display", "block");
            $(".select-flow-show-flow-button").css("color", "white");
            nowFlow = 3;
        } else if ($(this).attr("class").indexOf("4") > -1) {
            $(".select-flow-show-flow-content").css("display", "none");
            $(".select-flow-show-flow-4").css("display", "block");
            $(".select-flow-show-flow-button").css("color", "white");
            nowFlow = 4;
        }
    });
    $(".select-flow-show-flow-content-slider-left").click(function () {
        if(nowFlow != 1) {
            nowFlow--;
            $(".select-flow-show-flow-content").css("display", "none");
            $(".select-flow-show-flow-"+nowFlow).css("display", "block");
            $(".select-flow-show-flow-button").css("color", "white");
            $(".select-flow-show-flow-button").children("p").css("color", "black");
            $(".select-flow-show-flow-button").children("img").css("visibility", "hidden");
            $(".flow-page-"+nowFlow).children("p").css("color", "white");
            $(".flow-page-"+nowFlow).children("img").css("visibility", "visible");
        }
    });
    $(".select-flow-show-flow-content-slider-right").click(function () {
        if(nowFlow != 4) {
            nowFlow++;
            $(".select-flow-show-flow-content").css("display", "none");
            $(".select-flow-show-flow-"+nowFlow).css("display", "block");
            $(".select-flow-show-flow-button").css("color", "white");
            $(".select-flow-show-flow-button").children("p").css("color", "black");
            $(".select-flow-show-flow-button").children("img").css("visibility", "hidden");
            $(".flow-page-"+nowFlow).children("p").css("color", "white");
            $(".flow-page-"+nowFlow).children("img").css("visibility", "visible");
        }
    });
    return false;
}
nextHover = function () {
    if (nextButtonActive) {
        $(".navbar-next-button").hover(function () {
            $(this).css("border", "1px solid  #B1ACAC");
        }, function () {
            $(this).css("border", "none");
        })
    }
    return false;
}
clickNextOrPrev = function () {
    $(".navbar-next-button").click(function () {
        if (nextButtonActive) {
            $('body,html').animate({scrollTop: 0}, 0);
            if ($(".select-room").css("display") != "none") {
                othersHide("concept-select-page");
                $(".navbar-bottom-page-no").html('컨셉 이미지를 선택해 주세요!');
            } else if ($(".concept-select-page").css("display") != "none") {
                if (roomSelectStatus > minRoomSelect) {
                    othersHide("room-inspiration");
                    inputConfirmInfo("room-inspiration");
                    $(".navbar-bottom-page-no").html('3개 이상의 이미지를 선택해 주세요!');
                    if (roomInspirationImgsStatus < 3)nextButtonActive = false;
                }
            } else if ($(".room-inspiration").css("display") != "none") {
                if (roomInspirationImgsStatus > minRoomInspirationSelect) {
                    othersHide("offline-select-page");
                    $(".navbar-bottom-page-no").html('체크해 주세요');
                }
            } else if ($(".offline-select-page").css("display") != "none") {
                if (homestyling_offline_meeting != "none") {
                    othersHide("user-info");
                    inputConfirmInfo("user-info");
                    $(".navbar-bottom-page-no").html('모두 입력하시면 next를 눌러주세요');
                    $("body").css("min-height", "900px");
                }
            } else if ($(".user-info").css("display") != "none") {
                if (inputemptyCheck() == true) {
                    othersHide("final-confirmation");
                    inputConfirmInfo("final-confirmation");
                    if ($(window).width() < 768) {
                        $("body").css("min-height", "1500px");
                    }
                    $("footer").css("margin-top", "100px");
                    var total_price = 0;
                    if (serviceType==1) {
                        var total_price = roomSelectStatus * 99;
                    } else if (serviceType==2) {
                        var total_price = roomSelectStatus * 199;
                    }
                    if(homestyling_offline_meeting) {
                        total_price += 100
                    }
                    if (total_price > 0) {
                        $(".total-price-div").text(total_price + ",000 원 ");
                    } else {
                        $(".total-price-div").text(total_price + "0 원 ");
                    }
                    if($(window).width() <768){
                        if(roomSelectStatus <3) {
                            $('.select-room-confirm').height(90);
                        } else if(roomSelectStatus<5) {
                           $('.select-room-confirm').height(170);
                        } else {
                            $('.select-room-confirm').height(250);
                        }
                    }
                    $(".navbar-bottom-page-no").html('선택 사항들을 확인해주세요');
                    $(".next-button-span").empty();
                    $(".next-button-span").text("완료");
                }
            } else if ($(".final-confirmation").css("display") != "none") {
                othersHide("matching-container");
                requestInterior();
                viewMatching(true);
                $(".navbar-bottom-page-no").css("display", "none");
                $(".navbar-bottom-button").css("display", "none");
            }
        }
        return false;
    });
    $(".navbar-prev-button").click(function () {
        $('body,html').animate({scrollTop: 0}, 0);
        if ($(".select-room").css("display") != "none") {
            othersHide("select-flow");
            $(".navbar-fixed-bottom").css("visibility", "hidden");
        } else if ($(".concept-select-page").css("display") != "none") {
            nextButtonActive = true;
            $(".navbar-bottom-page-no").html('1개 이상의 방을 선택해주세요.');
            othersHide("select-room");
        } else if ($(".room-inspiration").css("display") != "none") {
            nextButtonActive = true;
            $(".navbar-bottom-page-no").html('컨셉 이미지를 선택해 주세요!');
            othersHide("concept-select-page");
        } else if ($(".offline-select-page").css("display") != "none") {
            nextButtonActive = true;
            othersHide("room-inspiration");
            $(".navbar-bottom-page-no").html('다음으로 넘어갈 수 있습니다. 3개 이상 선택하셔도 좋아요');
        } else if ($(".user-info").css("display") != "none") {
            nextButtonActive = true;
            othersHide("offline-select-page");
            $(".navbar-bottom-page-no").html('체크해 주세요');
        } else if ($(".final-confirmation").css("display") != "none") {
            othersHide("user-info");
            $("footer").css("margin-top", "0px");
            $("body").css("min-height", "900px");
            $(".navbar-bottom-page-no").html('모두 입력하시면 next를 눌러주세요');
            $(".next-button-span").empty();
            $(".next-button-span").text("NEXT");
        }
        return false;
    });
}
inputemptyCheck = function () {
    var returnValue = true;
    if ($(".user-name-input").val().length == 0) {
        $(".user-name-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-name-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-price-input").val().length == 0) {
        $(".user-price-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-price-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-house-input").val().length == 0) {
        $(".user-house-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-house-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-address-input").val().length == 0) {
        $(".user-address-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-address-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-phone-input").val().length == 0) {
        $(".user-phone-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-phone-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-email-input").val().length == 0) {
        $(".user-email-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-email-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".message-textarea").val().length == 0) {
        $(".message-textarea").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".message-textarea").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-age-input").val().length == 0) {
        $(".user-age-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-age-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    if ($(".user-funnel-input").val().length == 0) {
        $(".user-funnel-input").css("border", "1px solid #DC3232");
        returnValue = false;
    } else {
        $(".user-funnel-input").css("border", "1px solid #B1ACAC");
        returnValue = true;
    }
    return returnValue;
}
getRoomImg = function (page, callback) {
$.support.cors = true;

    $.ajax({
  crossDomain: true,
        type: "GET",
        dataType: 'json',
        url: "/doInterior/select/" + page,
        success: function (data) {
            callback(data);
            console.log("data = ", data);
        },
        error: function (error) {
            console.log('error = ', error);
            callback({"success": -1});
        }
    });
}
getCurrentlyCoordinates = function () {
    var offset = $(this).scrollTop();
    var footerOffset = $("footer").offset();
    var head = '<div class="room-inspiration-img-div"> <div class="room-inspiration-img-inner"> <div class="room-instpiration-main-img"> <img class="room-inspiration-img" src=';
    var tail = '> </div> <div class="room-inspiration-click-img"> <img class="image-click" src="/images/button/image_click.png"> </div><div class="room-inspiration-zoom-icon"><img class="room-inspiration-zoom-icon-img" src="/icon/zoom_button.png"></div> </div> </div>';
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100 && pagingBoolean == true) {
        pagingBoolean = false;
        pageValue++;
        getRoomImg(pageValue, function (results) {
            var room_insp = results.roomInspiration;
            room_insp.forEach(function (img, index) {
                var room_inspiration = document.querySelector('#room-columns');
                var item = document.createElement('div');
                salvattore['append_elements'](room_inspiration, [item]);
                item.outerHTML = head + img + tail;
                pagingBoolean = true;
            })
        });
    }
    return false;
}
$(window).scroll(function () {
    if ($(".room-inspiration").css('display') == 'block') {
        getCurrentlyCoordinates();
    }
    if (($(".final-confirmation").css('display') == 'block') && $(window).width() < 768) {
        $("body").css("min-height", "1500px");
    } else if (($(".user-info").css('display') == 'block')) {
        $("body").css("min-height", "900px");
    } else {
        $("body").css("min-height", "700px");
    }
    return false;
});
inputConfirmInfo = function (section) {
    switch (section) {
        case'room-inspiration':
            var roomImgList = '';
            var roomSrcs = Object.keys(roomSelect);
            for (var i = 0; i < roomSrcs.length; i++) {
                if (roomSelect[roomSrcs[i]] == true) {
                    roomImgList += '<img class="room-confirm-img" src="' + roomSrcs[i] + '"> ';
                }
            }
            $(".select-room-confirm-input").empty();
            $(".select-room-confirm-input").append(roomImgList);
            break;
        case'user-info':
            var roomInspList = '';
            var roomInspSrcs = Object.keys(roomInspirationImgs);
            roomInspImgCnt = 0;
            for (var i = 0; i < roomInspSrcs.length; i++) {
                if (roomInspirationImgs[roomInspSrcs[i]] == true) {
                    if (roomInspImgCnt > 2) {
                        roomInspList += '&nbsp...';
                        break;
                    }
                    roomInspList += '<img class="room-inspiration-confirm-img" src="' + roomInspSrcs[i] + '"> ';
                    roomInspImgCnt++;
                }
            }
            $(".inspiration-confirm-input").empty();
            $(".inspiration-confirm-input").append(roomInspList);
            break;
        case'final-confirmation':
            var name = $(".user-name-input").val();
            var price = $(".user-price-input").val();
            var house = $(".user-house-input").val();
            var address = $(".user-address-input").val();
            var phone = $(".user-phone-input").val();
            var email = $(".user-email-input").val();
            var message = $(".message-textarea").val();
            var input_div = ".user-info-confirm-input-container-row-input-"
            userInfo = {
                "userName": name,
                "price": price,
                "house": house,
                "address": address,
                "phone": phone,
                "email": email,
                "message": message
            }
            $(input_div + "name").text(name);
            $(input_div + "price").text(price);
            $(input_div + "address").text(address);
            $(input_div + "phone").text(phone);
            $(input_div + "email").text(email);
            $(input_div + "house").text(house);
            $(input_div + "message").text(message);
            break;
    }
    return false;
}


viewMatching = function (trueOrFalse) {
    var frames = document.getElementById("matching-container-inner").children;
    var frameCount = frames.length;
    var i = 0;
    var intervalCouter = 0;
    var intervalLoop = setInterval(function () {
        intervalCouter++;
        frames[i % frameCount].style.display = "none";
        frames[++i % frameCount].style.display = "inline-block";
        if (intervalCouter > 30) {
            $(".matching-text2").css("display", "block");
            $(".matching-text1").css("display", "none");
            $(".matching-home-btn").css("display", "inline-block");
            clearInterval(intervalLoop);
        }
    }, 100);
    return false;
}
requestInterior = function () {
    var offlineChar = "N";
    if (homestyling_offline_meeting) {
        offlineChar = "Y";
    }
    $.ajax({
        type: "POST",
        dataType: 'json',
        data: {
            "room": Object.keys(roomSelect).toString(),
            "roomInspSrcs": Object.keys(roomInspirationImgs).toString(),
            "userInfo": userInfo,
            "offline": offlineChar,
            "concept" : selectedConcept,
            "serviceType" : serviceType,
            "userAge" : $(".user-age-input").val(),
            "userFunnel" : $(".user-funnel-input").val()
        },
        url: "/doInterior/request",
        success: function (data) {
            // console.log(data);
        },
        error: function (error) {
            console.log('error = ', error);
        }
    });
    return false;
}
clickConceptImg = function () {
    $(".concept-select-text-div").click(function () {
        selectedConcept = $(this).children()[0].value;
        $(".concept-confirm-input").html("<p>" + selectedConcept + "</p>");
        $(".concept-select-text-div").css("opacity", "1");
        $(this).css("opacity", "0.1");
    })
}
clickZoomInButton = function () {
   $(document).on('click',".room-inspiration-zoom-icon",function () {
        $(".room-inspiration-img-zoom-div-img").attr('src', $(this).parent().children('.room-inspiration-main-img').children('.room-inspiration-img').attr('src'));
        $("#room-inspiration-img-zoom-div").css("display", "block");
    });
    $("#room-inspiration-img-zoom-div").click(function () {
        $("#room-inspiration-img-zoom-div").css("display", "none");
    })
}

moveNextTabIndex = function () {
    $(document).on('keypress', function(e) {
           var nowInput = document.activeElement;
           if( e.which == 13 ) {
               e.preventDefault();
               $('[tabIndex=' + (+nowInput.tabIndex + 1) + ']')[0].focus();
           }
       });
}

selectFlowShowFlowImgSetting = function () {
    if($(window).width() < 768){
        if($(".select-flow-show-flow-content").height() < $('.select-flow-show-flow-img').width()*5/12) {
            $('.select-flow-show-flow-img').css("height",$(".select-flow-show-flow-content").height() ).css("width",$(".select-flow-show-flow-content").height()*12/5 );
        } else {
            $('.select-flow-show-flow-img').css("height",$('.select-flow-show-flow-img').width()*5/12 );

        }

    }
    else {
        $('.select-flow-show-flow-img').css("height",$(".select-flow-show-flow-content").height()).css("width","auto");
    }
}