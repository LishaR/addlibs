exports = module.exports = function(app, mongoose) {

	var storySchema = new mongoose.Schema({			
			title: String,
			parts: [String],
			last: String,
			created: {type: Date, default: Date.now}
		});
	 
	app.db.model('Story', storySchema);
}


