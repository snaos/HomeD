$(document).ready(function () {
	portpolio_img_changer();
});
portpolio_img_changer = function () {
 $('.portpolio-img-list-img').click(function () {
 	$(".portpolio-img-showing-img").attr("src",$(this).attr("src"));
 });
}