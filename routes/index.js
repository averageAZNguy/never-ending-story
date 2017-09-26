var express = require('express');
var router = express.Router();
var Blog = require('../models/Blog');
var User = require('../models/user');
var passport = require('passport');

router.get('/', function(req,res){
	res.redirect('/blog');
})

router.get('/REST', function(req,res){
	res.render('rest');
})

// TABLE OF CONTENT ROUTE
router.get('/blog/tableofcontent', function(req,res){
	Blog.find({}).sort('order').exec(function(err, posts){
		if(err){
			console.log(err);
		} else {
			res.render('tableofcontent', {posts:posts});
		}
	});
});

//======
// AUTH ROUTES
//======
router.get('/register', function(req,res){
	res.render("register");
});

// Post registration daata to the DB and then authenticates the user
// once user has been registers and redirects to blog
router.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});

	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {err: err});
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect('/blog');
		});
	});
});

// LOGIN ROUTE
router.get('/login', function(req, res){
	res.render('login');
});
// app.post("login", middleware, callback)
// Assumes person is already register and attempts to log
// user into page
router.post('/login', 
	passport.authenticate('local',
	{
		successRedirect: '/blog',
		failureRedirect: '/login'
	}), function(req, res){
	
});

// LOGOUT ROUTE
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/blog');
});

module.exports = router;