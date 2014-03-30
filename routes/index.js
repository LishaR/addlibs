
/*
 * GET home page.
 */
var story = require("./story");

exports.index = function(req, res){
	story.checkStory(req, res);
};