exports = module.exports = function(app, passport) {

	var index = require('./routes/index');

	//front end
	app.get('/', require('./routes/index').index);

	// app.param('resource', resource.resource);
	
	// app.all('*', require('./views/http/index').http404);
}