$(document).ready(function () {
	slide_toggle();
});

slide_toggle = function () {
	$('.slide-btn-xs').on("click", function () {
		$("#navbar-aside-slide-xs").css("display","block").animate({right:"+=250px"},200,function () {

		});
		$("#cover-screen").css("display","block");
	});
	$("#cover-screen").on("click", function () {
		$("#navbar-aside-slide-xs").animate({right:"-=250px"},200,function (){
		});
		$("#cover-screen").css("display","none");
	})
	$(".aside-menu-exit").on("click", function () {
		$("#navbar-aside-slide-xs").animate({right:"-=250px"},200,function (){
		});
		$("#cover-screen").css("display","none");
	})
	$(".aside-menu-dointerior").on("click", function () {
		$("#navbar-aside-slide-xs").animate({right:"-=250px"},200,function (){
		});
		$("#cover-screen").css("display","none");
	});
}