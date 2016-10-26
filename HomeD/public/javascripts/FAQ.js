
$(document).ready(function () {

});

$(".faq-question").each(function () {
		var thisQuestion = $(this);
		var thisAnswer = thisQuestion.closest("li").find(".faq-answer");
		var state = false;
		thisQuestion.click(function () {
			state = !state;
			thisAnswer.slideToggle(state);
		});
})

