
/*
 * GET leaderboard page.
 */

exports.index = function(req, res){
	
	var q = req.app.db.models.Portfolio.find().populate('owner', 'name', 'User').sort({balance: -1}).limit(100)
	q.execFind(function(err, pf) {		
		var lb = [];
		for(var i = 0; i < pf.length; i++){
			lb.push({'name': pf[i].owner.name, 'balance': pf[i].balance})
		}
		res.render('leaderboard', { title: 'Leaderboard | TweetStreet', leaders: lb, isLeaderboard: true});
	});

};