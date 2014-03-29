var timestamps = require("mongoose-times");

exports = module.exports = function(app, mongoose) {

	var cacheSchema = new mongoose.Schema({				
		name: {type: String, index: {unique: true}},	
		value: String
	});
  
  	cacheSchema.plugin(timestamps);
	app.db.model('Cache', cacheSchema);
}

