
$(document).ready(function () {
	owlCarouselSetting();
});
owlCarouselSetting = function () {
    var owl = $('.homed-story-carousel-items');
    owl.owlCarousel({
    	items : 3,
    	autoPlay : true,
    	itemsCustom : false,
	    itemsDesktop : false,
	    itemsDesktopSmall : false,
	    itemsTablet: false,
	    itemsTabletSmall: false,
    	stopOnHover : true,
    	responsive: true,
    	navigation : false
    });
    $(".homed-story-carousel-next").click(function(){
       owl.trigger('next.owl.carousel');
    })
    $(".homed-story-carousel-prev").click(function(){
       owl.trigger('prev.owl.carousel');
    })
}
