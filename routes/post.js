var express = require('express');
var router = express.Router(); //Router({mergeParams: true}) will pass through objects for params.id
var Blog = require('../models/Blog'),
	passport = require('passport'),
	isLoggedIn = require('../controllers/isLoggedIn');

//ROUTE BLOG
router.get('/', function(req, res){
	Blog.find({}, function(err,blog){
		if(err){console.log(err)
		} else {
			res.render('blog', {blogs:blog, currentUser: req.user});
		}
	})
})
// NEW ROUTE
router.get('/new', isLoggedIn.isLoggedIn, function(req,res){
	Blog.find({},function(err,posts){
		if(err){
			res.redirect('/blog');
		} else {
			res.render("new", {posts: posts});
		}
	});
});

// CREATE BLOG ROUTE
router.post('/', isLoggedIn.isLoggedIn,function(req,res){

	req.body.post.content = req.sanitize(req.body.post.content)
	Blog.create(req.body.post, function(err, newPost){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blog")
		}
	});
});

// SHOW ROUTE
router.get('/:id', function(req,res){
	Blog.findById(req.params.id, function(err,findpost){
		if(err){
			res.redirect('/blog');
		} else {
			res.render("post", {posts: findpost});
		}
	})
})

// EDIT ROUTE
router.get('/:id/edit',isLoggedIn.isLoggedIn, function(req,res){
	Blog.findById(req.params.id, function(err,findpost){
		if(err){
			res.redirect('/blog');
		} else {
			res.render("edit", {posts: findpost});
		}
	})
})

// UPDATE ROUTE
router.put('/:id', isLoggedIn.isLoggedIn, function(req,res){
	req.body.post.content = req.sanitize(req.body.post.content)
	Blog.findByIdAndUpdate(req.params.id, req.body.post, function(err,updatedpost){
		if(err){
			res.redirect('/blog');
		} else {
			res.redirect('/blog/'+req.params.id);
		}
	})
})

// DELETE ROUTE
router.delete('/:id', isLoggedIn.isLoggedIn, function(req,res){
	Blog.findByIdAndRemove(req.params.id ,function(err,delPost){
		if(err){
			res.redirect('/blog');
		} else {
			res.redirect('/blog')
		}
	})
})

module.exports = router;