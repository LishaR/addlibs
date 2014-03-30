/**
 * Module dependencies.
 */
 var passport = require('passport')
 , oauthorize = require('oauthorize')
 , login = require('connect-ensure-login')
 , async = require('async')
 , sugar = require('sugar');


// create OAuth server
var server = oauthorize.createServer();
/*
 * GET users listing.
 */

exports.checkStory = function(req, res) {
	console.log("checking");
	if (req.session.storyID) {
		console.log("unlocking");
		req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
			story.locked = false;
			story.save(function(err, story){
				if(err) console.log(err);
				getStory(req, res);
			});
		});
	} else {
		getStory(req, res);
	}
};

getStory = function(req, res) {
	req.app.db.models.Story.findOne({locked: false}, function(err, story){
		if(err) console.log(err);

		if (!story) {
			newStory(req, res);
		} else {
			story.locked = true;
			req.session.storyID = story._id;
			req.session.save();
			var data = {};
			data.title = story.title;
			data.last = story.last;
			story.save(function(err, story){
				if(err) console.log(err);
				res.render('index', { title: 'Home | AddLibs', data: data});
			});
		}
	});
};

exports.updateStory = function(req, res) {
	console.log("updating");
	req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
		if(err) console.log(err);
		req.query.part = req.query.part + " ";
		story.parts.push(req.query.part);
		story.last = req.query.part;
		story.locked = false;
		story.save(function(err, story){
			if(err) console.log(err);
			console.log("finished update");
			res.json(story);
		});
	});
};

exports.newStory = function(req, res) {
		var data = {};
		res.render('newstory', { title:  'Home | AddLibs', data: data});
};

exports.viewStory = function(req, res) {
	req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
		if(err) console.log(err);
		var data = {};
		data.parts = story.parts;
		data.title = story.title;
		res.render('yourFinishedStory', { title: 'Home | AddLibs', data: data});
	});
};

exports.archive = function(req, res) {
	var data = {};
	data.stories = new Array();
	req.app.db.models.Story.find({}, function(err, story) {
		if (err) {

		} else {
			data.stories = story;
			res.render('archive', { title: 'Home | AddLibs', data: data});
		}
	});
	
};

exports.createStory = function(req, res){
	console.log("Started");
	var story = new req.app.db.models.Story();
	story.title = req.query.title;
	req.query.part = req.query.part + " ";
	story.parts.push(req.query.part);
	story.last = req.query.part;
	story.locked = false;
	story.save(function(err, story){
		if(err) console.log(err);
		res.json(story);
	});
};


exports.list = function(req, res){
 	res.send("respond with a resource");
 };

 exports.register = function(req, res){
 	res.render('register');
 };
