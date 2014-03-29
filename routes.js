exports = module.exports = function(app, passport) {

	var index = require('./routes/index')
	, user = require('./routes/user')
	, leaderboard = require('./routes/leaderboard')
	, ht = require('./routes/hashtag')
	, login = require('connect-ensure-login');

	//front end
	app.get('/', require('./routes/index').index);

	// Authentication
	app.get('/register', user.register);
	app.post('/register', user.registerPost);

	app.get('/resend', user.resendRegisterEmail);
	app.post('/resend', user.resendRegisterEmailPost);
	app.get('/verify', user.verify);

	app.get('/auth/facebook',
		passport.authenticate('facebook', {
			scope: [ 'email', 'user_about_me'],
			failureRedirect: '/login'
		}))
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			failureRedirect: '/login'
		}), function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/home');
	  })	
	app.get('/auth/google',
		passport.authenticate('google', {
			failureRedirect: '/login',
			scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
			]
		}))
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/login'
		}), function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/home');
	  })
	
	app.get('/login', user.login);
	app.post('/login', passport.authenticate('local', { failureFlash: true, successReturnToOrRedirect: '/home', failureRedirect: '/login' }));

	app.get('/logout', user.logout);

	// API
	app.get('/me', login.ensureLoggedIn(), user.info);		
	app.get('/history', login.ensureLoggedIn(), user.history);

	app.get('/home', login.ensureLoggedIn(), user.home);
	app.get('/about', index.about);
	app.get('/help', user.help);
	app.get('/stock', login.ensureLoggedIn(), ht.stock);
	app.get('/buy/:hashtag', login.ensureLoggedIn(), user.buy);
	app.get('/sell/:hashtag', login.ensureLoggedIn(), user.sell);
	app.get('/leaderboard', leaderboard.index);
	app.get('/profile', login.ensureLoggedIn(), user.profile);

	app.get('/tweet', ht.tweet);

	// app.param('resource', resource.resource);
	
	// app.all('*', require('./views/http/index').http404);
}