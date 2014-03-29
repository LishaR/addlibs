
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('help', { title: 'Home | TweetStreet' });
};

exports.about = function(req, res){
	res.render('about', { title: 'About | TweetStreet' });
};