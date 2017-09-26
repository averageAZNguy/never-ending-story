'use strict';

var mongoose 				= require('mongoose'),
	passportLocalMongoose 	= require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose); //gives all methods to user models associated with passport

module.exports = mongoose.model('User', userSchema);