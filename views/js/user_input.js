$(document).ready(function() {
	// Automatically puts cursor in inputBox
	$("#inputBox").focus();
	$("#titleBox").focus();
	$("#error-msg").hide();

	// Attaches send method to sendButton
	$("#sendButton").click(function(event) {
		sendToStory();
	});

	// Links to home page when home button is clicked
	$("#homeButton").click(function(event) {
		goToHome();
	});

	// Links to create new page when create new button is clicked
	$("#newStory").click(function(event) {
		goToNew();
	});

	// Submits a new story
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

	$("#newstory-box").keyup(function(event) {
		var key = event.keyCode || event.which;
		if (key == 13) {
			submitNewStory();
		}
	});

	// Handles mouse-over button beautification
	$("#sendButton").mouseenter(function() {
		$(this).css("background-color","#44ee11");
	});

	$("#sendButton").mouseout(function() {
		$(this).css("background-color","#55ff22");
	});

	$("#submitNewStory").mouseenter(function() {
		$(this).css("background-color","#44ee11");
	});

	$("#submitNewStory").mouseout(function() {
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
		$(this).css("background-color","#0099cc");
	});

	$("#homeButton").mouseenter(function() {
		$(this).css("background-color","#111111");
	})

	$("#homeButton").mouseout(function() {
		$(this).css("background-color","#222222");
	})
});

// Appends inputBox text to story paragraph
function sendToStory() {
	if (!$("#inputBox").val())
	{
		$("#error-msg").show();
	}
	else
	{
		$.get( "/updateStory" + '?part=' + $("#inputBox").val(), null, function(data) {	
			console.log("call function");
			window.location.href = "/viewStory";
		});
	}
}

// Submits a new story to the database
function submitNewStory() {
	if (!($("#titleBox").val() && $("#inputBox").val()))
	{
		$("#error-msg").show();
	}
	else
	{
		$.get( "/create" + "?title=" + $("#titleBox").val() + "&part=" + $("#inputBox").val(), null, function(data) {
			goToHome();
		});
	}
}

// Updates the character counter, or displays / hides sendButton
function updateCharacterCounter() {
	var count = $("#inputBox").val().length;
	$("#counter").text("" + count + "/40");
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

// Links to create a new story page
function goToNew() {
	window.location.replace("/newStory");
}
