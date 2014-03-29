$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();

	// Attaches send method to sendButton
	$("#sendButton").click(function() {
		sendToStory();
	});

	// Sends to story when ENTER button is clicked
	$("#inputBox").keypress(function(event){
		var key = event.keyCode || event.which;
		if (key == 13) {
			sendToStory();
		}
	});
});

// Appends inputBox text to story paragraph
function sendToStory() {
	$("#story").text($("#story").text() + " " + 
		$("#inputBox").val());
	$("#inputBox").val("");
}
