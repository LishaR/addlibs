$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();

	// Attaches send method to sendButton
	$("#sendButton").click(function(event) {
		sendToStory();
	});

	// Links to home page when home button is clicked
	$("#homeButton").click(function(event) {
		sendToHome();
	});

	// Links to archive when archive button is clicked
	$("#archiveButton").click(function(event) {
		goToCompletedStories();
	});

	// Each time a key is pressed...
	$("#inputBox").keyup(function(event) {
		// Updates the character count
		updateCharacterCounter();

		// Sends to story if ENTER button is clicked and character count is reached
		var key = event.keyCode || event.which;
		if (key == 13 && $("#inputBox").val().length == 40) {
			sendToStory();
		}
	});

	$("#sendButton").mouseenter(function() {
		console.log("enter");
		$(this).css("background-color","#1C6B04");
	})

	$("#sendButton").mouseout(function() {
		console.log("exit");
		$(this).css("background-color","#55ff22");
	})

	$("#archiveButton").mouseenter(function() {
		console.log("enter");
		$(this).css("background-color","#1C6B04");
	})

	$("#archiveButton").mouseout(function() {
		console.log("exit");
		$(this).css("background-color","#55ff22");
	})

	$("#newStory").mouseenter(function() {
		console.log("enter");
		$(this).css("background-color","#015774");
	})

	$("#newStory").mouseout(function() {
		console.log("exit");
		$(this).css("background-color","#0099cc");
	})

	// Hides the submit button and show character counter by default
	hideSubmitButton();

});

// Appends inputBox text to story paragraph
function sendToStory() {
	$.get( "/updateStory" + '?part=' + $("#inputBox").val(), null, function(data) {	
		console.log("call function");
		window.location.replace("/viewStory");
	});
}

// Updates the character counter, or displays / hides sendButton
function updateCharacterCounter() {
	var count = $("#inputBox").val().length;
	$("#counter").text("" + count + " / 40");
	if (count == 40) showSubmitButton();
	else hideSubmitButton();
}

// Links to home page
function sendToHome() {
	$.get( "/", null, function(data) {
		window.location.replace("/");
	});
} 

// Links to the completed stories page
function goToCompletedStories() {
	window.location.replace("/viewCompletedStories");
}

// Shows the submit button and hides the character counter
function showSubmitButton() {
	$("#sendButton").show();
	$("#counter").hide();
}

// Hides the submit button and shows the character counter
function hideSubmitButton() {
	$("#sendButton").hide();
	$("#counter").show();
}

