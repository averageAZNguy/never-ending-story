var express = require('express'),
	methodOverride = require('method-override'),
	app = express(),
	mongoose = require('mongoose'),
	bodyparser = require('body-parser'),
	expressSanitizer = require('express-sanitizer'),
	port = 8080;

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app");
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	content: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema); 

app.get('/', function(req,res){
	res.redirect('/blog');
})

//ROUTE BLOG
app.get('/blog', function(req, res){
	Blog.find({}, function(err,blog){
		if(err){console.log(err)
		} else {
			res.render('blog', {blogs:blog});
		}
	})
})

// NEW ROUTE
app.get('/blog/new', function(req,res){
	res.render("new")
})

// CREATE BLOG ROUTE
app.post('/blog', function(req,res){
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
app.get('/blog/:id', function(req,res){
	Blog.findById(req.params.id, function(err,findpost){
		if(err){
			res.redirect('/blog');
		} else {
			res.render("post", {posts: findpost});
		}
	})
})

// EDIT ROUTE
app.get('/blog/:id/edit', function(req,res){
	Blog.findById(req.params.id, function(err,findpost){
		if(err){
			res.redirect('/blog');
		} else {
			res.render("edit", {posts: findpost});
		}
	})
})

// UPDATE ROUTE
app.put('/blog/:id', function(req,res){
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
app.delete('/blog/:id', function(req,res){
	Blog.findByIdAndRemove(req.params.id ,function(err,delPost){
		if(err){
			res.redirect('/blog');
		} else {
			res.redirect('/blog')
		}
	})
})
// SERVER CONFIG to PORT
app.listen(port, function(){
	console.log("Server has connected to port:",port)
})