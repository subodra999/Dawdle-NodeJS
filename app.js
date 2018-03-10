const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave:true
}));

//Validator
app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

app.use(cookieParser());
app.use(flash());
app.use(function(req,res,next){
	res.locals.messages = require('express-messages')(req,res);
	next();
});
app.use(passport.initialize());
app.use(passport.session());



//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

// User global
app.get('*',function(req,res,next){
	res.locals.user = req.user || null;
	next();
});


// Set public folders
app.use(express.static(path.join(__dirname, 'public')));

// connect to mongoose
mongoose.connect('mongodb://localhost/dawdle');
const db = mongoose.connection;

require('./routes/routes.js')(app);

app.listen(3000);
console.log('Running on port 3000');
