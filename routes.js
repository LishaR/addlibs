exports = module.exports = function(app, passport) {

	var index = require('./routes/index')
	, story = require('./routes/story');

	//front end
	app.get('/', index.index);
	app.get('/updateStory', story.updateStory);
	app.get('/viewStory', story.viewStory);
	
	app.get('/create', story.createStory);
	app.get('/testLast', story.testLast);

	// app.param('resource', resource.resource);
	
	// app.all('*', require('./views/http/index').http404);
}