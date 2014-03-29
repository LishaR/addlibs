exports = module.exports = function(app, mongoose) {
	//general sub docs
	require('./schema/Assets')(app, mongoose);	
	require('./schema/User')(app, mongoose);
	require('./schema/Cache')(app, mongoose);
}