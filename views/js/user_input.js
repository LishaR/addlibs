$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();

	// Attaches send method to sendButton
	$("#sendButton").click(function(event) {
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
	console.log($("#inputBox").val());
	$.get( "/updateStory" + '?part=' + $("#inputBox").val(), function(data) {	
					console.log("call function");			
					//window.location.replace("/ViewStory");
					
				});
	//location.reload();
	$("#story").text($("#story").text() + " " + 
		$("#inputBox").val());
	$("#inputBox").val("");
}
