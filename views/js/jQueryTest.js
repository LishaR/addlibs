$(document).ready(function() {
	$('#showStory').hover(function() {
		$(this).fadeOut('slow');
	});
	$('p').slideDown('slow');
	console.log("running jquery script");
});