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
	if (req.session.storyID) {
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
	req.app.db.models.Story.find({locked: false}, function(err, stories){
		if(err) console.log(err);

		if (!stories) {
			newStory(req, res);
		} else {
			var index = Math.floor(Math.random() * stories.length);
			var story = stories[index];
			story.locked = true;
			story.save(function(err, story){
				if(err) console.log(err);
				req.session.storyID = story._id;
				req.session.save();
				var data = {};
				data.title = story.title;
				data.last = story.last;
				res.render('index', {data: data});
			});
		}
	});
};

exports.updateStory = function(req, res) {
	req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
		if(err) console.log(err);
		story.parts.push(" " + req.query.part);
		story.last = req.query.part;
		story.locked = false;
		story.save(function(err, story){
			if(err) console.log(err);
			res.json(story);
		});
	});
};

exports.newStory = function(req, res) {
		res.render('newstory');
};

exports.viewStory = function(req, res) {
	req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
		if(err) console.log(err);
		var data = {};
		data.parts = story.parts;
		data.title = story.title;
		res.render('yourFinishedStory', {data: data});
	});
};

exports.archive = function(req, res) {
	var data = {};
	data.stories = new Array();
	req.app.db.models.Story.find({}, function(err, story) {
		if (err) {

		} else {
			data.stories = story;
			res.render('archive', {data: data});
		}
	});
	
};

exports.archiveStory = function(req, res){
	var id = req.query.id;
	var story = req.app.db.models.Story.findOne({_id: id}, function(err, story) {
		var data = {};
		data.parts = story.parts;
		data.title = story.title;
		res.render('yourFinishedStory', {data: data});
	});
};

exports.createStory = function(req, res){
	console.log("Started");
	var story = new req.app.db.models.Story();
	story.title = req.query.title;
	story.parts.push(req.query.part);
	story.last = req.query.part;
	story.locked = false;
	story.save(function(err, story){
		if(err) console.log(err);
		res.json(story);
	});
};
