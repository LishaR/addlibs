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
		sendToNew();
	});

	$("#submitNewStory").click(function(event) {
		submitNewStory();
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


	// Handles mouse-over button beautification
	$("#sendButton").mouseenter(function() {
		$(this).css("background-color","#1C6B04");
	});

	$("#sendButton").mouseout(function() {
		$(this).css("background-color","#55ff22");
	});

	$("#archiveButton").mouseenter(function() {
		$(this).css("background-color","#dd1c00");
	});

	$("#archiveButton").mouseout(function() {
		$(this).css("background-color","#ff3311");
	});

	$("#newStory").mouseenter(function() {
		$(this).css("background-color","#0077aa");
	});

	$("#newStory").mouseout(function() {
		$(this).css("background-color","#099cc");
	});

	$("#homeButton").mouseenter(function() {
<<<<<<< HEAD
		$(this).css("background-color","#111111");
	})

	$("#homeButton").mouseout(function() {
		$(this).css("background-color","#222222");
=======
		$(this).css("background-color","rgb(41, 40, 40)");
	})

	$("#homeButton").mouseout(function() {
		$(this).css("background-color","rgb(109, 108, 108)");
>>>>>>> 91a6c45e5a405a70d61d3b2c60d43fc185e7d1fd
	})
});

// Appends inputBox text to story paragraph
function sendToStory() {
	$.get( "/updateStory" + '?part=' + $("#inputBox").val(), null, function(data) {	
		console.log("call function");
		window.location.href = "/viewStory";
	});
}

function submitNewStory() {
	$.get( "/create" + "?title=" + $("#titleBox").val() + "&part=" + $("#inputBox").val(), null, function(data) {
		goToHome();
	});
}

// Updates the character counter, or displays / hides sendButton
function updateCharacterCounter() {
	var count = $("#inputBox").val().length;
	$("#counter").text("" + count + " / 40");
}

// Links to home page
function goToHome() {
	window.location.href = "/";
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
