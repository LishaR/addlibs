// Set focus on inputBox
$(document).ready(function() {
	$("#inputBox").focus();

	$("#sendButton").click(function() {
		sendToStory();
	});
});

// Call sendToStory when ENTER is pressed
$(document).keypress(function(event){
	var key = event.keyCode || event.which;
	if (key == 13) {
		sendToStory();
	}
});

// Appends inputBox text to story paragraph


function sendToStory() {
	$("#story").text($("#story").text() + " " + 
		$("#inputBox").val());
	$("#inputBox").val("");
}
