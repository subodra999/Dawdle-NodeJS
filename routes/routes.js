var register = require('../config/register.js');
var login = require('../config/login.js');
var Riddle = require('../config/riddle.js');
var Story = require('../config/story.js');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.end("Node-Android-Project : Dawdle");
	});

	app.post('/login',function(req,res){
		var email = req.body.email;
        var password = req.body.password;

		login.login(email,password,function (found) {
			console.log(found);
			res.json(found);
		});
	});


	app.post('/register',function(req,res){
		var email = req.body.email;
        var password = req.body.password;
        //console.log(email);
		register.register(email,password,function (found) {
			console.log(found);
			res.json(found);
		});
	});

	app.get('/riddles', function(req, res){
		Riddle.getRiddles(function(err, riddles) {
			if(err){
				console.log("Error in getting riddles!");
				throw err;
			}
			res.json(riddles);
		});
	});

	app.post('/riddles', function(req, res){
		var riddle = req.body;
		Riddle.addRiddle(riddle, function(err, riddle){
			if(err){
				console.log("error in riddle post");
				throw err;
			}
			res.json(riddle);
		});
	});

	app.get('/stories', function(req, res){
		Story.getStories(function(err, stories) {
			if(err){
				console.log("Error in getting stories!");
				throw err;
			}
			res.json(stories);
		});
	});

	app.post('/stories', function(req, res){
		var story = req.body;
		Story.addStory(story, function(err, story){
			if(err){
				console.log("error in story post");
				throw err;
			}
			res.json(story);
		});
	});
	
};