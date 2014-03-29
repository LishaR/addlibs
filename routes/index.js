
/*
 * GET home page.
 */
var story = require("./story");

exports.index = function(req, res){
	story.last(req, res);
	res.render('index', { title: 'Home | AddLibs' });
};