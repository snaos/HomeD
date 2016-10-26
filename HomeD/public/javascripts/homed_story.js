

$(document).ready(function () {
	mainOwlCarouselSetting();
	thumbOwlCarouselSetting();
	// portpolioListClick();
	portpolioListSizeSetting();
});

$(window).resize(function () {
	portpolioListSizeSetting();
})

portpolioListClick = function () {
	$(".homed-story-portplio-list-img").click(function () {
		var hiddenNo = $(".hiddenNo");
		var hiddenStory =  $(".hiddenStory");
		var hiddenNm =  $(".hiddenNm");
		var homedStoryNo = $(this).parent().find(hiddenNo).val();
		var homedStoryNm = $(this).parent().find(hiddenNm).val();
		var homedStoryStory = $(this).parent().find(hiddenStory).val();
		var imgList = '';
		$.ajax({
		    type: "GET",
		    dataType: 'json',
		    url: "http://52.37.242.167/homed-story-info/" + homedStoryNo,
		    success: function (data) {
		    	var imgArray = data.results;
		    	for(var i = 0 ; i <imgArray.length; i++) {
		    		imgList +="<img class='homed-story-portpolio-img' src='"+imgArray[i].homedStoryImgPath+"'>"
		    	}
		    	$('.homed-story-portpolio-img-list-div-inner').html(imgList);
		    	$('.homed-story-portpolio-text-inner').html(homedStoryStory)
		    },
		    error: function (error) {
		        console.log('error = ', error);
		    }
		});
	});
}

portpolioListSizeSetting = function () {
	var StandardHeight = $('#homed-story-portplio-list-container').height()/10;
	$(".homed-story-portplio-list-img").css("height", StandardHeight*9 +"px").css("margin-top", StandardHeight/2);
}

mainOwlCarouselSetting = function () {
    var owl = $('.homed-story-portpolio-img-carousel-items');
    owl.owlCarousel({
    		loop:true,
    		autoPlay:true,
    		autoplayTimeout : 3000,
        autoplayHoverPause : true,
        items : 1,
    	  center : true,
        nav : false
    });
    $(".homed-story-portpolio-img-carousel-next").click(function(){
       owl.trigger('next.owl.carousel');
    })
    $(".homed-story-portpolio-img-carousel-prev").click(function(){
       owl.trigger('prev.owl.carousel');
    })
}
thumbOwlCarouselSetting = function () {
	var owl = $('.homed-story-portplio-list-container-inner');
	owl.owlCarousel({
		loop:true,
		nav:false,
		margin : 10,
		responsiveClass:true,
    responsive:{
        0:{
            items:3,
        },
        768:{
            items:4,
        },
        900: {
        	items:5,
        }
    }
	});
}