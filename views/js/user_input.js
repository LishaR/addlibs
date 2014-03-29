$(document).ready(function() {
	$("#inputBox").focus();

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
