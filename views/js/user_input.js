$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();

	// Attaches send method to sendButton
	$("#sendButton").click(function(event) {
		sendToStory();
	});

	$("#homeButton").click(function(event) {
		sendToHome();
	});

	// Sends to story when ENTER button is clicked
	$("#inputBox").keypress(function(event){
		var key = event.keyCode || event.which;
		if (key == 13) {
			sendToStory();
		}
	});
});

function sendToHome() {
	$.get( "/", null, function(data) {
		window.location.replace("/");
	});
} 

// Appends inputBox text to story paragraph
function sendToStory() {
	$.get( "/updateStory" + '?part=' + $("#inputBox").val(), null, function(data) {	
					window.location.replace("/viewStory");					
				});
}
