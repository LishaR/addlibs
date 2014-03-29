exports = module.exports = function(app, mongoose) {

	var storySchema = new mongoose.Schema({			
			title: String,
			parts: [String],
			last: String,
		});
	 
	app.db.model('Story', storySchema);
}


