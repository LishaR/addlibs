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
});

// Appends inputBox text to story paragraph
function sendToStory() {
	console.log($("#inputBox").val());
	$.get( "/updateStory" + '?part=' + $("#inputBox").val(), null, function(data) {	
					console.log("call function");
					window.location.replace("/viewStory");

					
				});
	//location.reload();
	$("#story").text($("#story").text() + " " + 
		$("#inputBox").val());
	$("#inputBox").val("");
}

// Updates the character counter
function updateCharacterCounter() {
	var count = $("#inputBox").val().length;
	$("#counter").text("" + count + " / 40");
}
