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

exports.createStory = function(req, res){
	console.log("Started");
	var story = new req.app.db.models.Story();
	story.title = "Title";
	console.log(story.title);
	story.parts.push("Story!");
	story.last = "Last";
	story.save(function(err, story){
		if(err) console.log(err);
	});
	console.log("finished");
};

exports.last = function(req, res) {
	console.log("last started");
	req.app.db.models.Story.findOne({title: 'Title'}, function(err, story){
		if(err) console.log(err);
		req.session.story = "unicorns";
		req.session.save();
		console.log(req.session.story);
		// var htmlSource = fs.readFileSync("index.html", "utf8");
		// htmlSource.replace("{TITLE", req.session.story);
		res.render('index', { title: 'Home | AddLibs', req: req});
	});
	console.log("Last finished");
};

exports.testLast = function(req, res) {
	console.log(req.session.story);
}

exports.sell = function(req, res){
 
		if(!req.user) {
		res.send (401);
		return;
	}

	var transaction = new req.app.db.models.Transaction();
	transaction.name = req.params.hashtag;
	transaction.shares = req.query.shares;
	transaction.type = "sell";

	hashtag.price(req, req.params.hashtag, function(err, price) {
		totalPurchased(req, req.params.hashtag, function(err, totalPurchased){
			if(err) res.send(500);
			count(req, req.params.hashtag, function(err, count){
				if(err) res.send(500);
				console.log("shares: " + transaction.shares);
				console.log("totalPrice: " + price);
				console.log("topsyPrice: " + count/100);
				console.log("tsb: " + totalPurchased);
				
				transaction.price = count * (2 + (2*totalPurchased - transaction.shares) * .001) / 200;
				console.log(transaction.price);

				req.app.db.models.Portfolio.findOne({owner: req.user._id}, function(err, portfolio){
					if(err) console.log(err);
					else {

						var previousTotal = 0;
						portfolio.totals.forEach(function(v, k){
							if(v.name == transaction.name) previousTotal = v.shares;
						});

						console.log(previousTotal);
						if(previousTotal - transaction.shares < 0) {
							res.send(402);
							return;
						}

						portfolio.balance += transaction.shares * transaction.price;
						if(portfolio.balance > portfolio.maxBalance) {
							portfolio.maxBalance = portfolio.balance;
						}
						portfolio.transactions.push(transaction);
						var found = false;
						portfolio.totals.forEach(function(v, k){
							if(v.name == transaction.name){
								v.shares -= transaction.shares;
								found = true;
							}
						});
						
						if(!found) {
							portfolio.totals.push({"name": transaction.name, "shares": transaction.shares});
						}

						portfolio.save(function(err, portfolio){
							if(err) console.log(err);					
							hashtag.totalPurchased(req, transaction.name, -transaction.shares, function(err){
								if(err) res.send(500);
								res.json(portfolio);	
							})
						})
					}
				})	
			});
		});
		
		
	});
	

};

exports.history = function(req, res){
	res.render('index', { title: 'History | TweetStreet' });
};

exports.info = function(req, res) {
	res.json(req.user);
}


exports.home = function(req, res){
	req.app.db.models.Portfolio.findOne({owner: req.user._id}, function(err, portfolio){
		if(err) console.log(err);
		else {
			res.render('index', { title: 'Home | TweetStreet', portfolio: portfolio, isHome: true});
		}
	})	
};

exports.profile = function(req, res){
	var portfolio = null;
	req.app.db.models.Portfolio.findOne({owner: req.user._id}, function(err, portfolio){
		if(err) console.log(err);
		else {
			portfolio.transactions.sort(function(a, b){
				var keyA = new Date(a.created),
				keyB = new Date(b.created);
				// Compare the 2 dates
				if(keyA < keyB) return 1;
				if(keyA > keyB) return -1;
				return 0;
			});

			if(portfolio.totals === undefined) portfolio.totals = [];
			var results = portfolio.totals.map(function(v, k){
				if(v.shares > 0){
					return v;
				}
			}).compact();
			var prices = [];
			async.each(results, 					
					function(item, callback){
						hashtag.price(req, item.name, function(err, price){
							if(err) callback(err);
							prices.push({name: item.name, price: price});
							callback(null);							
						});
						
					}
			,			
			function(err){
				var data = {}
				data.portfolio = portfolio
				data.results = results;
				data.prices = prices;
				console.log(data);
				res.render('profile', { title: 'Profile | TweetStreet', data: data, isProfile: true});
			});

			
		}
	})	
};


exports.help = function(req, res){
	res.render('help', { title: 'Help | TweetStreet' });
};