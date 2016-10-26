

$(document).ready(function () {
	mainOwlCarouselSetting();
	thumbOwlCarouselSetting();
});
mainOwlCarouselSetting = function () {
    var owl = $('.homed-story-portpolio-img-carousel-items');
    owl.owlCarousel({
    	autoPlay : true,
    	items : 1,
			itemsCustom : false,
	    itemsDesktop : false,
	    itemsDesktopSmall : false,
	    itemsTablet: false,
	    itemsTabletSmall: false,
	    itemsMobile : false,
	    singleItem : true,

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
		    	items : 5,
					itemsCustom : false,
			    itemsDesktop : false,
			    itemsDesktopSmall : false,
			    itemsTablet: false,
			    itemsTabletSmall: false,
			    itemsMobile : false,
			    singleItem : false,
	});
}