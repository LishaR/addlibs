/**
 * Module dependencies.
 */
 var passport = require('passport')
 , oauthorize = require('oauthorize')
 , login = require('connect-ensure-login')
 , hashtag = require('./hashtag')
 , async = require('async')
 , sugar = require('sugar');


// create OAuth server
var server = oauthorize.createServer();
/*
 * GET users listing.
 */

exports.checkStory = function(req, res) {
	console.log("checking");
	req.session.storyID = false;
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
		story.locked = true;
		req.session.storyID = story._id;
		req.session.save();
		var data = {};
		data.title = story.title;
		data.lastWords = story.lastWords;
		data.lastChars = story.lastChars
		story.save(function(err, story){
			if(err) console.log(err);
			res.render('index', { title: 'Home | AddLibs', data: data});
		});
	});
};

exports.updateStory = function(req, res) {
	console.log("updating");
	req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
		if(err) console.log(err);
		story.parts.push(req.query.part);
		var lastSpace = req.query.part.lastIndexOf(' ');
		story.lastWords = req.query.part(0, lastSpace);
		story.lastChars = req.query.part(lastSpace + 1);
		story.locked = false;
		story.save(function(err, story){
			if(err) console.log(err);
			console.log("finished update");
			res.json(story);
		});
	});
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

exports.viewCompletedStories = function(req, res) {
	req.app.db.models.Story.findOne({_id: req.session.storyID}, function(err, story){
		if(err) console.log(err);
		var data = {};
		res.render('finished_stories', { title: 'Home | AddLibs', data: data});
	});
};

exports.createStory = function(req, res){
	console.log("Started");
	var story = new req.app.db.models.Story();
	story.title = req.query.title;
	story.parts.push(req.query.part);
	var lastSpace = req.query.part.lastIndexOf(' ');
	story.lastWords = req.query.part(0, lastSpace);
	story.lastChars = req.query.part(lastSpace + 1);
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

 exports.registerPost = function(req, res){

	// TODO check params

	var user = new req.app.db.models.User();
	user.email = req.body.email;
	user.name = req.body.name;
	user.password = require('crypto').createHash('md5').update(req.body.password).digest("hex");
	user.status = "active";
	user.verify = req.app.utility.uid(32);

	if(user.email == "" || req.body.password == "") {
		req.flash('error', 'Please fill in all the fields!')
		res.redirect('/login');
	}
	user.save(function(err, user){
		if(err) { 
			if(err.code === 11000)
				res.send({'error': 'User already exists'}, 409);
			else					
				res.send(500);
		} else {
			portfolio = new req.app.db.models.Portfolio();
			portfolio.owner = user._id;

			portfolio.save(function (err) {
				if (err) console.log(err)
					req.flash('success', 'Successfully registered!')
				res.redirect('/login');
			});


		}
	})
};


exports.verify = function(req, res){
	req.app.db.models.User.findOne({verify: req.query.verifyToken}, function(err, user){
		if(err) res.send(500);
		else if(user){

			user.status = 'active';
			user.save(function(err, user){
				if(err) res.send(500);
				else {

					req.app.utility.email(req, res, {
						from: req.app.config.email.from.name +' <'+ req.app.config.email.from.address +'>',
						to: user.email,
						subject: 'Welcome to Bucket',
						textPath: 'email/welcome-text',
						htmlPath: 'email/welcome-html',
						locals: {},
						success: function(message) {
							req.app.logger.info("account.welcomEmail:" + user.email);
						},
						error: function(err) {
							req.app.logger.error("account.welcomeEmail:" + user.email + ":" + err);
						}
					});
					res.json({'message': 'verified'});
				}
			});
			
		} else {
			res.json({'message': 'user not found'});
		}
	});
};

exports.resendRegisterEmail = function(req, res){
	res.render('resend-verification');
}

exports.resendRegisterEmailPost = function(req, res){
	req.app.db.models.User.findOne({email: req.body.email}, function(err, user){
		if(err) res.send(500);
		else if(user){

			req.app.utility.email(req, res, {
				from: req.app.config.email.from.name +' <'+ req.app.config.email.from.address +'>',
				to: user.email,
				subject: 'Verfiy Bucket Account',
				textPath: 'email/signup-text',
				htmlPath: 'email/signup-html',
				locals: {},
				success: function(message) {
					req.app.logger.info("account.signupEmail:" + user.email);
				},
				error: function(err) {
					req.app.logger.error("account.signupEmail:" + user.email + ":" + err);
				}
			});

			res.json({'message': 'sent'});
		} else {
			res.json({'message': 'user not found'});
		}
	});
}

exports.login = function(req, res){
	res.render('login', {title: 'Login | TweetStreet', flasherror: req.flash('error'), flashsuccess: req.flash('success')});
};

exports.logout = function(req, res){
	req.logout();
	res.redirect('/');
};