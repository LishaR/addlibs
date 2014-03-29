function displayAlert() {
	alert("Hey! Its an alert");
}

function sendToStory() {
	$("#story").text($("#showStory #story").text() + " " + 
		$("#inputBox").val());
	$("#inputBox").val("");
}