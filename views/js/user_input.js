$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();

	// Attaches send method to sendButton
	$("#sendButton").click(function(event) {
		sendToStory();
	});

	// Each time a key is pressed...
	$("#inputBox").keyup(function(event) {
		// Updates the character count
		updateCharacterCounter();

		// Sends to story when ENTER button is clicked
		var key = event.keyCode || event.which;
		if (key == 13) {
			sendToStory();
		}
	});

	$("#homeButton").click(function(event) {
		sendToHome();
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

// Updates the character counter
function updateCharacterCounter() {
	var count = $("#inputBox").val().length;
	$("#counter").text("" + count + " / 40");
}
