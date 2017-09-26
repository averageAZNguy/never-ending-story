var express = require('express'),
	methodOverride = require('method-override'),
	app = express(),
	mongoose = require('mongoose'),
	bodyparser = require('body-parser'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	Blog = require('./models/Blog'),
	User = require('./models/user'),
	expressSanitizer = require('express-sanitizer'),
	port = 8080;

var postRoutes = require('./routes/post'),
	indexRoutes = require('./routes/index');

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app");
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: "Another secret string",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate())); //User.authenticate comes with creating a local stratetgy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next(); //
});  // applies this function middleware for req.user for all routes
app.use(indexRoutes);
app.use('/blog',postRoutes); // can bring in prefix router

// SERVER CONFIG to PORT
app.listen(port, function(){
	console.log("Server has connected to port:",port)
})

// functions