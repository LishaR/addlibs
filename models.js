exports = module.exports = function(app, mongoose) {
	//general sub docs
	require('./schema/Story')(app, mongoose);
}