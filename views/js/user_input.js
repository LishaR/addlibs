$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();

	// Attaches send method to sendButton
	$("#sendButton").click(function(event) {
		sendToStory();
	});

	// Links to home page when home button is clicked
	$("#homeButton").click(function(event) {
		goToHome();
	});

	$("#newStory").click(function(event) {
		console.log("send to new");
		sendToNew();
	});

	// Links to archive when archive button is clicked
	$("#archiveButton").click(function(event) {
		goToArchive();
	});

	// Each time a key is pressed...
	$("#inputBox").keyup(function(event) {
		// Updates the character count
		updateCharacterCounter();

		// Sends to story if ENTER button is clicked and character count is reached
		var key = event.keyCode || event.which;
		if (key == 13) {
			sendToStory();
		}
	});


	$("#sendButton").mouseenter(function() {
		$(this).css("background-color","#1C6B04");
	});

	$("#sendButton").mouseout(function() {
		$(this).css("background-color","#55ff22");
	});

	$("#archiveButton").mouseenter(function() {
		$(this).css("background-color","#1C6B04");
	});

	$("#archiveButton").mouseout(function() {
		$(this).css("background-color","#55ff22");
	});

	$("#newStory").mouseenter(function() {
		$(this).css("background-color","#015774");
	});

	$("#newStory").mouseout(function() {
		$(this).css("background-color","#0099cc");
	});

	$("#homeButton").mouseenter(function() {
		$(this).css("background-color","#015774");
	})

	$("#homeButton").mouseout(function() {
		$(this).css("background-color","#000000");
	})

	// Hides the submit button and show character counter by default
	hideSubmitButton();
});


// Appends inputBox text to story paragraph
function sendToStory() {
	$.get( "/updateStory" + '?part=' + $("#inputBox").val(), null, function(data) {	
		console.log("call function");
		window.location.href = "/viewStory";
	});
}

function buttonColorChange() {};

// Updates the character counter, or displays / hides sendButton
function updateCharacterCounter() {

	var count = $("#inputBox").val().length;
	$("#counter").text("" + count + " / 40");
	// if (count == 40) showSubmitButton();
	// else hideSubmitButton();
}

// Links to home page
function goToHome() {
	$.get( "/", null, function(data) {
		window.location.href = "/";
	});
} 

// Links to a completed story, provided a given id
function goToViewStory(id) {
	/* TODO: Figure out which story to bring up!!! */
	window.location.href = "/viewStory";
}

// Links to the archive page
function goToArchive() {
	window.location.replace("/archive");
}

function sendToNew() {
	window.location.replace("/newStory");
}

// Shows the submit button and hides the character counter
function showSubmitButton() {
	$("#sendButton").show();
	$("#counter").hide();
}

 // // Shows the submit button and hides the character counter
 // function showSubmitButton() {
 // 	$("#sendButton").show();
 // 	$("#counter").hide();
 // }

 // // Hides the submit button and shows the character counter
 // function hideSubmitButton() {
 // 	$("#sendButton").hide();
 // 	$("#counter").show();
 }

