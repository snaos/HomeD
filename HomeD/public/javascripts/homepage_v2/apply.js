
var pageObject = {
    min : 0,
    max : 15,
    maxLevel : 0,
    now : 0
}
var resultsPageNo = 12;
var pageHeightSet = [850, 900,850,1200,850,1150,950, 1000,1150,850,850,850,1050,600,900];
var pageHeightSetXS = [800, 900,850,800,850,1200,600, 1450,1550,950,950,950,1150,600,900];
var conceptObject = {
    modern : {
        koName : '모던',
        url : '/images/do_interior_quiz/modern.jpg',
        resultsText : '<p class="apply-concept-crown-contents-text-title-p">모던(MODERN)<br class="visible-xs"> 스타일</p><p class="apply-concept-crown-contents-text-p">모던 스타일의 인테리어는 현대적이며 차갑고 세련됨</p>',
        score : 0
    },
    scandinavian : {
        koName : '북유럽',
        url : '/images/do_interior_quiz/scandi.jpg',
        resultsText : '<p class="apply-concept-crown-contents-text-title-p">북유럽(SCANDINAVIAN)<br class="visible-xs"> 스타일</p><p class="apply-concept-crown-contents-text-p">북유럽 스타일의 인테리어는 심플하며 실용성을 중요시함</p>',
        score : 0
    },
    natural : {
        koName : '내추럴',
        url : '/images/do_interior_quiz/natural.jpg',
        resultsText : '<p class="apply-concept-crown-contents-text-title-p">내추럴(NATURAL)<br class="visible-xs"> 스타일</p><p class="apply-concept-crown-contents-text-p">내추럴 스타일의 인테리어는 자연스럽고 편안함</p>',
        score : 0
    },
    provence : {
        koName : '프로방스',
        url : '/images/do_interior_quiz/provence.jpg',
        resultsText : '<p class="apply-concept-crown-contents-text-title-p">프로방스(PROVENCE)<br class="visible-xs"> 스타일</p><p class="apply-concept-crown-contents-text-p">프로방스 스타일의 인테리어는 자연스럽지만 다채로운 컬러로 생동감을 준다.</p>',
        score : 0
    },
    vintage : {
        koName : '빈티지',
        url : '/images/do_interior_quiz/vintage.jpg',
        resultsText : '<p class="apply-concept-crown-contents-text-title-p">빈티지(VINTAGE)<br class="visible-xs"> 스타일</p><p class="apply-concept-crown-contents-text-p">빈티지 스타일의 인테리어는 오래도록 질리지 않는 특징</p>',
        score : 0
    },
    classic : {
        koName : '클래식',
        url : '/images/do_interior_quiz/classic.jpg',
        resultsText : '<p class="apply-concept-crown-contents-text-title-p">클래식(CLASSIC)<br class="visible-xs"> 스타일</p><p class="apply-concept-crown-contents-text-p">클래식 스타일의 인테리어는 고전적이며 고풍스럽다</p>',
        score : 0
    },
}
var spaceKo = {
    living : "거실",
    bath : "화장실",
    bed : "침실",
    dress : "드레스룸",
    kids : "아이방",
    kitchen : "주방",
    other : "기타",
    unknown :"잘모르겠어요"
}
var navBottomMessage = [
    '선택하고 다음을 눌러주세요',
    '두 약관에 동의해주세요',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '최종 확인 후 신청합니다',
]
var space_img_src = {
    living : "/icon/doInterior/interiordo_4_living.png",
    bath : "/icon/doInterior/interiordo_4_bathroom.png",
    bed : "/icon/doInterior/interiordo_4_bedroom.png",
    dress : "/icon/doInterior/interiordo_4_dressroom.png",
    kids : "/icon/doInterior/interiordo_4_kidsroom.png",
    kitchen : "/icon/doInterior/interiordo_4_kitchen.png",
    other : "/icon/doInterior/interiordo_4_other.png",
    unknown :"/icon/doInterior/interiordo_4_unknow.png"
}
var userApplyInfoObject = {
    select : "",
    terms : 0,
    live : "",
    housing : "",
    construction : "",
    space : {
        living : 0,
        bath : 0,
        bed : 0,
        dress : 0,
        kids : 0,
        kitchen : 0,
        other : 0,
        unknown :0,
        totalNo : 0
    },
    conceptColor : "",
    pattern : "",
    furniture : "",
    conceptImg : [0,0,0],
    concept : "",
    conceptSelectImg : ['empty'],
    individual : {
        userName : "",
        age : "",
        male : "",
        job : "",
        mail : "",
        address : "",
        phone : "",
        phoneTime : "",
        bill : "",
        funnel : "",
        message : ""
    }
}
var pageChangeBoolean = false;
var conceptQuizStartNo = 9;
var borderColor = {
    none : "2px solid #aeaeae",
    yellow : "2px solid #ffc40b"
}
var conceptTempImgs = {};

$(document).ready(function () {
    apply_page_change();
    //page 0
    apply_page_selected("select");
    //page 1
    apply_terms_page();
    //page 2
    apply_page_selected("live");
    //page 3
    apply_page_selected("housing");
    //page 4
    apply_page_selected("construction");
    //page 5
    apply_space_up_and_down();
    //page 6
    apply_page_color();
    //page 7
    apply_page_selected("pattern");
    //page 8
    apply_page_selected("furniture");
    //page 9 - 11
    apply_concept_imgs_page();
    //page 13
    apply_concept_select_page();
});

var $grid = $('.grid').masonry({
  // options
  itemSelector: '.grid-item',
  percentPosition: true
});

$(window).resize(function () {
    var page_width = $('#apply-page-slider').width()/16;
    $('#apply-page-slider').css({left: -(page_width*pageObject.now)+'px' })
});


apply_page_selected = function (selectorName) {
    $(".apply-"+selectorName+"-div").click(function () {
        if (userApplyInfoObject[selectorName].length != 0) {
            $(".apply-"+selectorName+"-div").css({
                border : borderColor.none,
            });
            $(".apply-"+selectorName+"-div").find(".apply-selected-check-box").css("display","none");
            $(".apply-"+selectorName+"-div").find('img').css("opacity","0.5");
            $(".apply-"+selectorName+"-div").find('p').css("color","#aeaeae");
        }

        $(this).css({
            border : borderColor.yellow
        });
        $(this).find(".apply-selected-check-box").css("display","block");
        $(this).find('img').css("opacity","1");
        $(this).find('p').css("color","black");

        userApplyInfoObject[selectorName] = $(this).attr('name');
        pageChangeBoolean = true;
    });
}

apply_page_color = function () {
    $(".apply-concept-color-div").click(function () {
        if (userApplyInfoObject["conceptColor"].length != 0) {
            $(".apply-concept-color-div").css({
                border : borderColor.none,
           });
            $(".apply-concept-color-div").find(".apply-selected-check-box").css("display","none");
       }
       $(this).css({
           border : borderColor.yellow
       });
        $(this).find(".apply-selected-check-box").css("display","block");
        userApplyInfoObject["conceptColor"] = $(this).attr('name');
        pageChangeBoolean = true;
    });
}

apply_page_change = function () {
    $(".apply-next-page").click( function (){
        if(pageObject.now == 14) {
            apply_info_confirm();
            // pageChangeBoolean = true;
        } else if (pageObject.now == 13){
            apply_concept_select_page_next();
        } else if (pageObject.now == 15) {
            result_save();
        }
        if(pageChangeBoolean) {
            if(pageObject.now == pageObject.max) {

            } else {
                if(pageObject.now == 12) {
                    navBottomMessage[13] = conceptObject[userApplyInfoObject.concept].koName +"컨셉을 선택하셨습니다."
                    apply_concept_result_click(function (results) {
                        $grid.masonry( 'remove', $('.grid-item') );
                        conceptTempImgs = {};
                        for(var i = 0; i<results.length ; i++) {
                            $items = $('<div class="grid-item"><img class="apply-selected-check-box" src="/icon/doInterior/interiordo_check.png"> <img class="grid-item-img" src="'+results[i].CONCEPT_IMG_PATH+'"></div>')
                            $grid.append( $items ).masonry( 'appended', $items );
                        }
                        $grid.imagesLoaded().progress( function() {

                          $grid.masonry('layout');
                         $('#apply-page-div').css("min-height", ($('.apply-concept-select-img-conatiner').height()+130+"px"));
                        });

                    });
                }
                    if(pageObject.now >= pageObject.maxLevel){
                        pageChangeBoolean=false;
                    }
                    pageObject.now++;
                    if(pageObject.now > pageObject.maxLevel) {
                        pageObject.maxLevel = pageObject.now;
                    }
                    page_15_next_btn_changer();

                    var page_width = $(window).width();
                    if(page_width < 900) {
                        $('#apply-page-div').css({"min-height":pageHeightSetXS[pageObject.now]});
                        console.log("pageObject.now = ", pageObject.now);
                        console.log("pageHeightSetXS[pageObject.now] = ", pageHeightSetXS[pageObject.now])
                    }else {
                        $('#apply-page-div').css({"min-height":pageHeightSet[pageObject.now]});
                    }
                    // var nowPosition = parseFloat($('#apply-page-slider').css("left").split("px")[0]);
                    // console.log(nowPosition);
                    $(".apply-bottom-div-text").text(navBottomMessage[pageObject.now]);
                    $('#apply-page-slider').animate({left : -(100*(pageObject.now))+'%'});
                    $(window).scrollTop(0);

            }
            if(pageObject.now == resultsPageNo) {
                apply_results_texting();
            }
        }
    });

    $(".apply-prev-page").click( function (){

        if(pageObject.now == pageObject.min) {

        } else {
            pageObject.now--;
                    var page_width = $(window).width();
            page_15_next_btn_changer();

            $('#apply-page-div').css({"min-height":pageHeightSet[pageObject.now]});
            $('#apply-page-slider').animate({left : -(100*(pageObject.now))+'%'});
            $(window).scrollTop(0);
            $(".apply-bottom-div-text").text(navBottomMessage[pageObject.now]);
            pageChangeBoolean=true;
        }
    });
}

//page 1
apply_terms_page = function() {
    $("#terms-agree-1").click(function () {
        if($(this).is(":checked")) {
            userApplyInfoObject.terms++;
        } else {
            userApplyInfoObject.terms--;
        }
        if(userApplyInfoObject.terms == 2) {
            pageChangeBoolean = true;
        } else {
            pageChangeBoolean = false;
        }
    })
    $("#terms-agree-2").click(function () {
        if($(this).is(":checked")) {
            userApplyInfoObject.terms++;
        } else {
            userApplyInfoObject.terms--;
        }
        if(userApplyInfoObject.terms == 2) {
            pageChangeBoolean = true;
        } else {
            pageChangeBoolean = false;
        }
    })
}

//공간 갯수 선택 화면 page 5
apply_space_up_and_down = function () {
    //div 클릭시
    $('.apply-space-img-div').click(function () {
        var selectRoom = $(this).closest('.apply-space-div');
        var selectRoomNm = selectRoom.attr('name');
        var selectNumber = $(this).closest('.apply-space-div').find('.apply-space-select-div').find('.apply-space-select-number');
        if(Number(selectNumber.text()) ==0 ) {
            $(this).closest('.apply-space-div').find(".apply-space-select-div").find('div').css("color","black");
            $(this).find(".apply-space-img").css("opacity","1");
            selectRoom.find('.apply-space-img-div').find(".apply-space-img-p").css("color","black");
        }
        if(Number(selectNumber.text()) <20) {
            selectNumber.text(Number(selectNumber.text())+1);
            userApplyInfoObject.space[selectRoomNm]=Number(selectNumber.text());
            userApplyInfoObject.space.totalNo++;
        }
        selectRoom.css({
            border : borderColor.yellow
        });
        pageChangeBoolean = true;
    });
    // < 버튼 클릭시
    $('.apply-space-select-down').click(function () {
        var selectRoom = $(this).closest('.apply-space-div');
        var selectRoomNm = selectRoom.attr('name');
        var selectNumber = $(this).closest('.apply-space-select-div').find('.apply-space-select-number');
        if(Number(selectNumber.text()) >0) {
            selectNumber.text(Number(selectNumber.text())-1);
            userApplyInfoObject.space[selectRoomNm]=Number(selectNumber.text());
            userApplyInfoObject.space.totalNo--;
        }
        if(Number(selectNumber.text()) == 0) {
            selectRoom[0].removeAttribute("style");
            $(this).closest('.apply-space-select-div').find('div').css("color","#aeaeae");
            selectRoom.find('.apply-space-img-div').find(".apply-space-img").css("opacity","0.5");
            selectRoom.find('.apply-space-img-div').find(".apply-space-img-p").css("color","#aeaeae");
        }
        if(userApplyInfoObject.space.totalNo == 0){
            pageChangeBoolean = false;
        }
    });
    // > 버튼 클릭시
    $('.apply-space-select-up').click(function () {
        var selectRoom = $(this).closest('.apply-space-div');
        var selectRoomNm =selectRoom.attr('name');
        var selectNumber = $(this).closest('.apply-space-select-div').find('.apply-space-select-number');
        if(Number(selectNumber.text()) ==0 ) {
            $(this).closest('.apply-space-select-div').find('div').css("color","black");
            selectRoom.find('.apply-space-img-div').find(".apply-space-img").css("opacity","1");
            selectRoom.find('.apply-space-img-div').find(".apply-space-img-p").css("color","#aeaeae");
        }
        if(Number(selectNumber.text()) <20) {
            selectNumber.text(Number(selectNumber.text())+1);
            userApplyInfoObject.space[selectRoomNm]=Number(selectNumber.text());
            userApplyInfoObject.space.totalNo++;
        }

        selectRoom.css({
            border : borderColor.yellow
        });
        pageChangeBoolean = true;
    });
}



//concept 퀴즈 이미지 선택시 페이지를 체크해서 처리함.
apply_concept_imgs_page = function () {
    $(".apply-concept-img-div").click(function () {
        $(this).closest(".apply-concept-img-conatiner").find('.apply-concept-img-div').css({
            border : borderColor.none
        });
        $(this).closest(".apply-concept-img-conatiner").find('.apply-selected-check-box').css("display","none");
        $(this).css({
            border : borderColor.yellow
        });
        $(this).find(".apply-selected-check-box").css("display","block");
        userApplyInfoObject.conceptImg[pageObject.now-conceptQuizStartNo] = $(this).attr('name');
        pageChangeBoolean = true;
    });
}

//컨셉 점수 javascript
apply_concept_scoring = function ( callback ) {
    var conceptResults = {
        score : 0,
        concept : "",
        array : []
    }
    {
        if(userApplyInfoObject.conceptColor.indexOf("white") !== -1) {
            conceptObject.modern.score += 0.3;
            conceptObject.natural.score += 0.3;
            conceptObject.scandinavian.score += 0.3;
            conceptObject.provence.score += 0.3;
        }
        if(userApplyInfoObject.conceptColor.indexOf("grey") !== -1) {
            conceptObject.modern.score += 0.3;
            conceptObject.vintage.score += 0.3;
            conceptObject.classic.score += 0.3;

        }
        if(userApplyInfoObject.conceptColor.indexOf("black") !== -1) {
            conceptObject.modern.score += 0.3;
            conceptObject.vintage.score += 0.3;
            conceptObject.classic.score += 0.3;
        }
        if(userApplyInfoObject.conceptColor.indexOf("skin") !== -1) {
            conceptObject.natural.score += 0.3;
            conceptObject.scandinavian.score += 0.3;
            conceptObject.provence.score += 0.3;
        }
        if(userApplyInfoObject.conceptColor.indexOf("brown") !== -1) {
            conceptObject.natural.score += 0.3;
            conceptObject.scandinavian.score += 0.3;
            conceptObject.vintage.score += 0.3;
            conceptObject.classic.score += 0.3;
        }
        if(userApplyInfoObject.conceptColor.indexOf("beige") !== -1) {
            conceptObject.provence.score += 1.2;
        }
    }
    {
        if (userApplyInfoObject.furniture == 1) {
            conceptObject.vintage.score += 1.1;
        } else if (userApplyInfoObject.furniture == 2) {
            conceptObject.scandinavian.score += 1.1;
        } else if (userApplyInfoObject.furniture == 5) {
            conceptObject.classic.score += 1.1;
        } else if (userApplyInfoObject.furniture == 6) {
            conceptObject.natural.score += 1.1;
        } else if (userApplyInfoObject.furniture == 3) {
            conceptObject.modern.score += 1.1;
        } else {
            conceptObject.provence.score += 1.1;
        }
    }
    {
        if(userApplyInfoObject.pattern == "noPatern") {
            conceptObject.modern.score += 1.2;
            conceptObject.natural.score +=1.2;
            conceptObject.classic.score += 0.3;
        } else if(userApplyInfoObject.pattern == "patern"){
            conceptObject.provence.score += 1.2;
            conceptObject.scandinavian.score += 0.3;
            conceptObject.vintage.score += 0.3;
        }
    }
   {
       if(userApplyInfoObject.conceptImg[0] == 1) {
           conceptObject.natural.score += 1.3;
           userApplyInfoObject.conceptImg[0] == 'natural';
       } else if(userApplyInfoObject.conceptImg[0] == 2) {
           conceptObject.scandinavian.score += 1.3;
           userApplyInfoObject.conceptImg[0] == 'scandinavian';
       }else if(userApplyInfoObject.conceptImg[0] == 3) {
           conceptObject.classic.score += 1.3;
           userApplyInfoObject.conceptImg[0] == 'classic';
       }else if(userApplyInfoObject.conceptImg[0] == 4) {
           conceptObject.modern.score += 1.3;
           userApplyInfoObject.conceptImg[0] == 'modern';
       }else if(userApplyInfoObject.conceptImg[0] == 5) {
           conceptObject.vintage.score += 1.3;
           userApplyInfoObject.conceptImg[0] == 'vintage';
       }else if(userApplyInfoObject.conceptImg[0] == 6) {
           conceptObject.provence.score += 1.3;
           userApplyInfoObject.conceptImg[0] == 'provence';
       }
   }
   {
       if(userApplyInfoObject.conceptImg[1] == 4) {
           conceptObject.natural.score += 1.3;
           userApplyInfoObject.conceptImg[1] == 'natural';
       } else if(userApplyInfoObject.conceptImg[1] == 5) {
           conceptObject.scandinavian.score += 1.3;
           userApplyInfoObject.conceptImg[1] == 'scandinavian';
       }else if(userApplyInfoObject.conceptImg[1] == 6) {
           conceptObject.classic.score += 1.3;
           userApplyInfoObject.conceptImg[1] == 'classic';
       }else if(userApplyInfoObject.conceptImg[1] == 1) {
           conceptObject.modern.score += 1.3;
           userApplyInfoObject.conceptImg[1] == 'modern';
       }else if(userApplyInfoObject.conceptImg[1] == 2) {
           conceptObject.vintage.score += 1.3;
           userApplyInfoObject.conceptImg[1] == 'vintage';
       }else if(userApplyInfoObject.conceptImg[1] == 3) {
           conceptObject.provence.score += 1.3;
           userApplyInfoObject.conceptImg[1] == 'provence';
       }
   }
   {
       if(userApplyInfoObject.conceptImg[2] == 2) {
           conceptObject.natural.score += 1.3;
           userApplyInfoObject.conceptImg[2] == 'natural';
       } else if(userApplyInfoObject.conceptImg[2] == 3) {
           conceptObject.scandinavian.score += 1.3;
           userApplyInfoObject.conceptImg[2] == 'scandinavian';
       }else if(userApplyInfoObject.conceptImg[2] == 4) {
           conceptObject.classic.score += 1.3;
           userApplyInfoObject.conceptImg[2] == 'classic';
       }else if(userApplyInfoObject.conceptImg[2] == 5) {
           conceptObject.modern.score += 1.3;
           userApplyInfoObject.conceptImg[2] == 'modern';
       }else if(userApplyInfoObject.conceptImg[2] == 6) {
           conceptObject.vintage.score += 1.3;
           userApplyInfoObject.conceptImg[2] == 'vintage';
       }else if(userApplyInfoObject.conceptImg[2] == 1) {
           conceptObject.provence.score += 1.3;
           userApplyInfoObject.conceptImg[2] == 'provence';
       }
   }

   var concepts = Object.keys(conceptObject);
   for(var i = 0; i< concepts.length; i++){
       if(conceptObject[concepts[i]].score > conceptResults.score){
            conceptResults.score = conceptObject[concepts[i]].score;
            conceptResults.concept = concepts[i];
       }

   }
   for(var i = 0; i< concepts.length ; i++) {
        if(conceptResults.concept != concepts[i]){
            conceptResults.array.push(concepts[i]);
        }
   }
    callback(conceptResults);
}

apply_results_texting = function () {
    apply_concept_scoring(function (results) {
        var conceptResultHtml = '<div class="apply-concept-result-conatiner"><div class="apply-page-title"><p class="apply-apge-title-small-p">당신의 스타일을 찾아드려요!</p><p class="apply-apge-title-p">당신에게 '+conceptObject[results.concept].koName+'스타일을 제안합니다.</p><div class="apply-page-title-bar"></div><p class="apply-apge-title-small-p"> 13/ 16</p></div><div class="apply-concept-result-div"><div class="apply-concept-crown-div"><div class="apply-concept-crown-inner apply-concept-selector" name="'+results.concept+'"><img class="apply-selected-check-box" src="/icon/doInterior/interiordo_check.png"><div class="apply-concept-crown-contents apply-concept-crown-contents-img"> <img class="apply-concept-crown-concept-img" src="'+ conceptObject[results.concept].url+'"> </div><div class="apply-concept-crown-contents apply-concept-crown-contents-text"><div class="apply-concept-crown-contents-text-inner-div"><img class="apply-concept-crown-img" src="/icon/doInterior/interiordo_9_crown.png">' + conceptObject[results.concept].resultsText+'</div></div></div> </div><div class="apply-concept-others-div"><div class="apply-concept-others-inner">';
                                          for(var i = 0; i<results.array.length; i++){
                                            conceptResultHtml += '<div class="apply-concept-other-div apply-concept-selector" name="'+ results.array[i]+'"><div class="apply-concept-other-text-div">'+conceptObject[results.array[i]].koName+'</div><div class="triangle-top-left"></div> <p class="apply-concept-other-absolute-p">'+ (i+2)+ '</p><img class="apply-selected-check-box" src="/icon/doInterior/interiordo_check.png"><img class="apply-concept-other-img" src="'+conceptObject[results.array[i]].url+'"></div>'
                                          }
                                          conceptResultHtml += '</div> </div></div></div>';

        $("#apply-page-12").html(conceptResultHtml);
        $('.apply-concept-selector').click(function () {
            userApplyInfoObject.concept = $(this).attr("name");
            $('.apply-concept-selector').css({
                border : borderColor.none
            });
            $('.apply-concept-selector').find(".apply-selected-check-box").css("display","none");
            $(this).css({
                border : borderColor.yellow
            });
            $(this).find(".apply-selected-check-box").css("display","block");
            pageChangeBoolean = true;
        });
    });
}

apply_concept_result_click = function (callback) {

    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "http://52.37.242.167/doInterior/getConceptImages/" + userApplyInfoObject.concept,
        success: function (data) {
            callback(data.conceptImages);
        },
        error: function (error) {
            console.log('error = ', error);
            callback({"success": -1});
        }
    });
}

apply_concept_select_page = function () {
    $(document).on('click', ".grid-item", function () {
        if(conceptTempImgs[$(this).find(".grid-item-img").attr("src")] == 1 ) {
            conceptTempImgs[$(this).find(".grid-item-img").attr("src")] = 0;
            $(this).css("border",borderColor.none).find(".apply-selected-check-box").css('display','none');
        } else {
            conceptTempImgs[$(this).find(".grid-item-img").attr("src")] = 1;
            $(this).css("border",borderColor.yellow).find(".apply-selected-check-box").css('display','block');
        }
        pageChangeBoolean = true;
    });
    return false;
}

apply_concept_select_page_next = function () {
    var srcs = Object.keys(conceptTempImgs);
    for(var i = 0; i <srcs.length ; i++) {
        if(conceptTempImgs[srcs[i]] == 1) {
           userApplyInfoObject.conceptSelectImg.push(srcs[i]);
        }
    }
}

apply_info_confirm = function () {
    pageChangeBoolean = true;
    if($(".user-name-input").val().length == 0) {
        $(".user-name-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-name-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.userName = $(".user-name-input").val()
    }
    if($(".user-age-input").val().length == 0) {
        $(".user-age-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-age-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.age = $(".user-age-input").val()
    }
    if($(".user-job-input").val().length == 0) {
        $(".user-job-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-job-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.job = $(".user-job-input").val()
    }
    if($(".user-mail-input").val().length == 0) {
        $(".user-mail-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-mail-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.mail = $(".user-mail-input").val()
    }
    if($("#jibunAddress").val().length == 0) {
        $("#jibunAddress").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $("#jibunAddress").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.address = $("#postcode").val() + " " + " / " + $("#jibunAddress").val() + " " + $("#extraAdress").val();
    }
    if($(".user-phone-input").val().length == 0) {
        $(".user-phone-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-phone-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.phone = $(".user-phone-input").val()
    }
    if($(".user-bill-input").val().length == 0) {
        $(".user-bill-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-bill-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.bill = $(".user-bill-input").val()
    }
    if($(".user-phoneTime-input").val().length == 0) {
        $(".user-phoneTime-input").css("border", "1px solid #f12222");
        pageChangeBoolean = false;
    } else {
        $(".user-phoneTime-input").css("border", "1px solid #aeaeae");
        userApplyInfoObject.individual.phoneTime = $(".user-phoneTime-input").val()
    }
    userApplyInfoObject.individual.male = $("#apply-user-sex").val();
    userApplyInfoObject.individual.funnel = $("#funnel").val();
    userApplyInfoObject.individual.message = $(".message-textarea").val();
    apply_user_confirm_page_setting();
}
apply_user_confirm_page_setting = function() {
    $("#apply-user-info-confirm-name-div >div").html(userApplyInfoObject.individual.userName);
    $("#apply-user-info-confirm-bill-div > div").html(userApplyInfoObject.individual.bill);
    var serviceType = "홈디 베이직";
    var servicePrice = 199;
    if(userApplyInfoObject.select == "primeum"){
        serviceType="홈디 프리미엄"
        servicePrice = 499;
    }
    $("#apply-user-info-confirm-service-div >div").html(serviceType);

    var spaceInfo = ""
    var spaceArray = Object.keys(userApplyInfoObject.space);
    for(var i = 0; i < spaceArray.length ; i ++) {
        if(userApplyInfoObject.space[spaceArray[i]] > 0) {
            if(spaceArray[i] == 'totalNo'){
                continue;
            }

                spaceInfo += '<img class="apply-user-info-room-confirm-img" src="'+space_img_src[spaceArray[i]]+'">';
        }
    }
    var user_info_private_string = '<p> 이름 :  '+userApplyInfoObject.individual.userName+' &nbsp<br class="visible-xs"> 연락처 : ' + userApplyInfoObject.individual.phone+ '</p> <p> 예산안 : ' + userApplyInfoObject.individual.bill + ' &nbsp<br class="visible-xs"> 메일 : '+userApplyInfoObject.individual.mail+'</p> <p> 희망 전화 시간 : '+ userApplyInfoObject.individual.phoneTime + '</p> <p> 홈스타일링 공간 주소 : '+ userApplyInfoObject.individual.address +'</p>  <p> 메시지 : ' + userApplyInfoObject.individual.message;

    $("#apply-user-info-private-confirm-box").html(user_info_private_string);
    $("#apply-user-info-confirm-room-div > div").html(spaceInfo);
    $("#apply-user-info-confirm-concept-div >div").html(conceptObject[userApplyInfoObject.concept].koName);
    $("#apply-user-info-confirm-price-div >div").html(userApplyInfoObject.space.totalNo+"공간 X " + servicePrice+",000원 = " +servicePrice*userApplyInfoObject.space.totalNo+",000원");


}


page_15_next_btn_changer = function() {
    if(pageObject.now == 15){
        $(".hidden-page-15").css("display","none");
        $(".visible-page-15").css("display","inline-block");
    } else {
        $(".hidden-page-15").css('display', "inline-block");
        $(".visible-page-15").css('display',"none");
    }
}

result_save = function () {
    $.ajax({
       type: "POST",
       dataType: 'json',
       data: userApplyInfoObject,
       url: "/doInterior/apply",
       success: function (data) {
           console.log(data);
       },
       error: function (error) {
           console.log('error = ', error);
       }
    });
    location.href='/doInterior/apply/result';
}

function execDaumPostcode() {
        new daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                var extraRoadAddr = ''; // 도로명 조합형 주소 변수

                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }
                // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                if(fullRoadAddr !== ''){
                    fullRoadAddr += extraRoadAddr;
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById('postcode').value = data.zonecode; //5자리 새우편번호 사용
                document.getElementById('roadAddress').value = fullRoadAddr;
                document.getElementById('jibunAddress').value = data.jibunAddress;

                // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
                if(data.autoRoadAddress) {
                    //예상되는 도로명 주소에 조합형 주소를 추가한다.
                    var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                    document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';

                } else if(data.autoJibunAddress) {
                    var expJibunAddr = data.autoJibunAddress;
                    document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';

                } else {
                    document.getElementById('guide').innerHTML = '';
                }
            }
        }).open();
    }