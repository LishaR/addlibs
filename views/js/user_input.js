function displayAlert() {
	alert("Hey! Its an alert");
}

$(document).ready(function() {
	$(sendButton).click(function() {
		$("#story").text($("#showStory #story").text() + " " + 
			$("#inputBox").val());
		$("#inputBox").val("");
	});
});