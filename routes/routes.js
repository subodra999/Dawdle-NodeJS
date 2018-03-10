var register = require('../config/register.js');
var login = require('../config/login.js');
var Riddle = require('../config/riddle.js');
var Story = require('../config/story.js');

ObjectId = require('mongodb').ObjectID;


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var user = require('../models/modelsUser.js');
var crypto = require('crypto');
var rand = require('csprng');

var Stories = require('../models/modelsStory.js');
var Riddles = require('../models/modelsRiddle.js');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index',{
			body:"Node-Android-Project : Dawdle"
		});
	});

	app.get('/entry', ensureAuthenticated,function(req, res) {
		res.render('entry');
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

	app.get('/ariddles', function(req, res){
			Riddle.getRiddles(function(err, riddles) {
			if(err){
				console.log("Error in getting riddles!");
				throw err;
			}
			res.json(riddles);
		});
	});

	app.get('/wriddles',ensureAuthenticated, function(req, res){
			Riddle.getRiddles(function(err, riddles) {
			if(err){
				console.log("Error in getting riddles!");
				throw err;
			}
			res.render('riddles',{
      	title: "Riddles",
      	riddles: riddles,
				like:"true"
    	});
		});
	});

	app.post('/riddles', function(req, res){
		var riddle={
			body : req.body.body,
			answer : req.body.answer,
			user_added : req.user[0]._id
		};
		Riddle.addRiddle(riddle, function(err, riddle){
			if(err){
				console.log("error in riddle post");
				throw err;
			}
			res.location('/entry');
			res.redirect('/entry');
		});
	});

	app.get('/astories', function(req, res){
			Story.getStories(function(err, stories) {
			if(err){
				console.log("Error in getting stories!");
				throw err;
			}
			res.json(stories);
		});
	});

	app.get('/wstories', ensureAuthenticated,function(req, res){
			Story.getStories(function(err, stories) {
			if(err){
				console.log("Error in getting stories!");
				throw err;
			}
			res.render('stories',{
      	title: "Stories",
      	stories: stories,
				like: "true"
    	});
		});
	});

	app.post('/stories', function(req, res){
		var story={
			title : req.body.title,
			body : req.body.body,
			author : req.body.author,
			user_added : req.user[0]._id
		};
		Story.addStory(story, function(err, story){
			if(err){
				console.log("error in story post");
				throw err;
			}
			res.location('/entry');
			res.redirect('/entry');
		});
	});

	app.get('/wlogin',function(req, res){
	  res.render('login',{
	    title: "Login",
			errors: ""
	  });
	});

	app.get('/wregister',function(req, res){
	  res.render('register',{
	    title: "Register",
			errors: ""
	  });
	});

	app.post('/wregister',function(req, res){
		var email = req.body.email;
		var password = req.body.password;
		var password2 = req.body.password2;

		// Form Validator
		req.checkBody('email','email field is required!').notEmpty();
		req.checkBody('password','password field is required').notEmpty();
		req.checkBody('password2','confirm password field is required').notEmpty();
		req.checkBody('password','password donot match').equals(password2);

		var errors = req.validationErrors();

		if(errors) {
			console.log('Errors in registrationform!');
			res.render('register',{
				errors: errors,
				email: email
			});
		} else {
			var temp = rand(160, 36);
  		var newpass = temp + password;
  		var token = crypto.createHash('sha512').update(email +rand).digest("hex");
  		var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");

  		var newuser = new user({
  			token: token,
  			email: email,
  			hashed_password: hashed_password,
  			salt : temp
			});

			//Create user
			user.find({email: email}, function(err, users){
  			var len = users.length;
  			if(len == 0){
  				newuser.save(function (err) {
            if(err) {
              console.log('error in registration!');
              //throw err;
							res.location('/entry');
							res.redirect('/entry');
            }else{
							//success message
							req.flash('success','you are now registered.');
							res.location('/wlogin');
							res.redirect('/wlogin');
						}
  				});
  			}
  			else{
					console.log('already exist');
  				req.flash('success','Email already registered!');
					res.location('/wregister');
					res.redirect('/wregister');
  			}
  		});
		}
	});

	passport.serializeUser(function(user,done){
		done(null,user);
	});

	passport.deserializeUser(function(user,done){
			done(null,user);

	});

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: "true"
		},
		function(req,email,password,done) {
			console.log(email);
			user.find({email: email}, function(err, users){
				if(users){
					console.log(users);
					var temp = users[0].salt;
					var hash_db = users[0].hashed_password;
					var id = users[0].token;
					var newpass = temp + password;
					var hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");

					if(hash_db == hashed_password){
						console.log('done');
						return done(null,users);
					} else{
						console.log('Invalid password');
						return done(null,false,{message:'Invalid password'});
					}
				}  else{
					console.log('Unknown user');
					return done(null,false,{message:'Unknown User'});
				}
			});
		}
	));

	app.post('/wlogin',passport.authenticate('local',{failureRedirect:'/wlogin',failureFlash:'Invalid username or password'}),function(req,res){
		console.log('Authentication success');
		req.flash('success','you are now logged in');
		res.location('/entry');
		res.redirect('/entry');
	});

	app.get('/wlogout',function(req,res){
		req.logout();
		console.log('Logged out');
		req.flash('success','you have logged out');
		res.location('/');
		res.redirect('/');
	});

	app.get('/myprofile',ensureAuthenticated ,function(req,res){
		console.log(req.user);
		res.render('profile',{
			title:"Profile page",
			user: req.user
		});
	});

	app.get('/myprofile/addStory', ensureAuthenticated,function(req,res){
		res.render('addStory');
	});

	app.get('/myprofile/addRiddle', ensureAuthenticated,function(req,res){
		res.render('addRiddle');
	});

	app.get('/myprofile/myStory', ensureAuthenticated,function(req,res){
		var id = req.user[0]._id;
		Stories.find({user_added:id},function(err, stories) {
			if(err){
				console.log("Error in getting stories!");
				throw err;
			}
			console.log(stories);
			res.render('stories',{
				title: "Stories",
				stories: stories,
				like:"true"
			});
		});
	});

	app.get('/myprofile/myRiddle', ensureAuthenticated,function(req,res){
		var id = req.user[0]._id;
		Riddles.find({user_added:id},function(err, riddles) {
			if(err){
				console.log("Error in getting riddles!");
				throw err;
			}
			console.log(riddles);
			res.render('riddles',{
				title: "Riddles",
				riddles: riddles,
				like:"true"
			});
		});
	});

	app.post('/myprofile/addLikeStories',ensureAuthenticated,function(req, res){
		var story_id = req.body.story_id;
		console.log(story_id);
		user.find({$and: [{_id:req.user[0]._id},{liked_story:{$in : [story_id]}}]},function(err, found) {
			if(err) {
				console.log("Error in getting story_id");
				throw err;
			}
			console.log(found);
			if(found.length!=0){
				// remove
				user.update({_id:req.user[0]._id},{$pullAll: {liked_story:[story_id]}}, function(err, found) {
					if(err) {
						console.log("error in removing like");
						throw err;
					}
					console.log("dislike");
					Stories.findOneAndUpdate({_id :story_id}, {$inc : {like : -1}},function(err, found){
						if(err) {
							console.log("error in like increase");
							throw err;
						}
						res.location('/wstories');
						res.redirect('/wstories');
					});
				});
			}
			else {
				user.update({_id:req.user[0]._id},{$push: {liked_story:[story_id]}},function(err, found){
						if(err) {
							console.log("like not added ");
							throw err;
						}
						console.log("like found");
						console.log(found);
						Stories.findOneAndUpdate({_id :story_id}, {$inc : {like : 1}}, function(err, found){
							if(err) {
								console.log("error in like increase");
								throw err;
							}
							res.location('/wstories');
							res.redirect('/wstories');
						});
				});
			}
		});
	});

	app.post('/myprofile/addLikeRiddles',ensureAuthenticated,function(req, res){
		var riddle_id = req.body.riddle_id;
		console.log(riddle_id);
		user.find({$and: [{_id:req.user[0]._id},{liked_riddle:{$in : [riddle_id]}}]},function(err, found) {
			if(err) {
				console.log("Error in getting riddle_id");
				throw err;
			}
			console.log(found);
			if(found.length!=0){
				// remove
				user.update({_id:req.user[0]._id},{$pullAll: {liked_riddle:[riddle_id]}}, function(err, found) {
					if(err) {
						console.log("error in removing like");
						throw err;
					}
					console.log("dislike");
					Riddles.findOneAndUpdate({_id :riddle_id}, {$inc : {like : -1}},function(err, done){
						if(err) {
							console.log("error in like");
							throw err;
						}
						res.location('/wriddles');
						res.redirect('/wriddles');
					});
				});
			}
			else {
				user.update({_id:req.user[0]._id},{$push: {liked_riddle:[riddle_id]}},function(err, found){
						if(err) {
							console.log("like not added ");
							throw err;
						}
						console.log("like");
						Riddles.findOneAndUpdate({_id :riddle_id}, {$inc : {like : 1}},function(err, done){
							if(err){
								console.log("error in like");
								throw err;
							}
							res.location('/wriddles');
							res.redirect('/wriddles');
						});
				});
			}
		});
	});

	app.get('/myprofile/likedStory',ensureAuthenticated,function(req,res){
		user.find({_id:req.user[0]._id},function(err,user){
			Stories.find({_id:{$in : user[0].liked_story}},function(err,stories){
				console.log("success------>");
				console.log(user[0].liked_story);
				if(err){
					//console.log(err);
					throw err;
				}
				res.render('stories',{
					title:"Liked Stories",
					stories: stories,
					like: "false"
				})
			})
		})
	});

	app.get('/myprofile/likedRiddle',function(req,res){
		user.find({_id:req.user[0]._id},function(err,user){
			Riddles.find({_id:{$in : user[0].liked_riddle}},function(err,riddles){
				console.log("success------>");
				if(err){
					//console.log(err);
					throw err;
				}
				res.render('riddles',{
					title:"Liked Riddles",
					riddles: riddles,
					like: "false"
				})
			})
		})
	});

	function ensureAuthenticated(req,res,next){
	  if(req.isAuthenticated()){
	    return next();
	  }else{
	    req.flash('danger','please log In first');
			res.location('/wlogin');
	    res.redirect('/wlogin');
	  }
	}


};
