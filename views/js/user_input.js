// Set focus on inputBox
$(document).ready(function() {
	$("#inputBox").focus();
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

// A test method for displaying an alert
function displayAlert() {
	alert("Hey! Its an alert");
}