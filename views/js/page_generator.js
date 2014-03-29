$(document).ready(function () {
	// Ask the database for stories the user has contributed to (from database.js)
	var stories = getContributedStories();

	// For each story, create a new div and display it
	for (var i=0; i < stories.length; i++) {
		var newStoryDiv = document.createElement("div");
		newStoryDiv.id = ("story" + i);
		newStoryDiv.className = "story";

		// Adding the title and story content to the div
		newStoryDiv.innerHTML = ("<h2>" + stories[i][0] + "</h2> <p>" + 
			stories[i][1] + "</p>");

		// Append our created div to the container div
		$("#storiesContainer").append(newStoryDiv);
	}
});