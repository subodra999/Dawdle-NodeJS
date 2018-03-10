var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	token : String,
	email: String,
	hashed_password: String,
	salt : String,
	temp_str : String,
	liked_riddle : [String],
	liked_story : [String]
});

module.exports = mongoose.model('users', userSchema);
