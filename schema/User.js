exports = module.exports = function(app, mongoose) {

	var userSchema = new mongoose.Schema({		
		email: {type: String, index: {unique: true}},		
		name: String,	
		password: String,
		username: { type: String, default: '' },
		provider: { type: String, default: '' },
		verify: String,
		reset: String,
		status: { type: String, default: 'pending' },
		facebook: {},
		google: {},
		created: {type: Date, default: Date.now}
	});
  
	app.db.model('User', userSchema);
}

