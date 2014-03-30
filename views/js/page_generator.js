$(document).ready(function () {
	// Ask the database for stories the user has contributed to (from database.js)
	var stories = getFinishedStories();

	// For each story, create a new div and display it
	for (var i=0; i < stories.length; i++) {
		var newStoryDiv = document.createElement("div");
		newStoryDiv.id = ("story" + i);
		newStoryDiv.className = "content";

		// Adding the title and story content to the div
		newStoryDiv.innerHTML = ("<div class='title'><h2 style=''> " + 
			stories[i][0] + "</h2></div><div class='text'>" + 
			stories[i][1] + "...</div>");

		// Add an empty div for spacing
		var emptyDiv = document.createElement("div");
		emptyDiv.className = "empty";

		// Append our created divs to the container div
		$("#storiesContainer").append(newStoryDiv);
		$("#storiesContainer").append(emptyDiv);
	}
});