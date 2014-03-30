$(document).ready(function() {
	console.log("Hello");
		$(window).keyup(function(event) {
			var key = event.keyCode || event.which;
			if (key == 13) {
				goToHome();
			}
		}); 
	});