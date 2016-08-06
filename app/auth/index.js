'use strict';
const passport =require('passport');
const config = require('../config');
const h = require('../helpers');

const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy =require('passport-twitter').Strategy;
module.exports = function () {
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});

	passport.deserializeUser(function(id,done){
		h.findById(id)
		 .then( function(user) {
		 	done(null,user);
		 })
		 .catch(function(error) {
		 	console.log('error deserializing the user info');
		 })
	});
	let authProcessor = function (accessToken,refreshToken,profile,done) {

     //find the user in the local db 
     h.findOne(profile.id)
      .then(function(result){
      	if(result){
          done(null,result);
      	}
      	else {
      		h.createNewUser(profile)
      		.then(function(newChatUser) {
      			done(null,newChatUser);
      		})
      		.catch(function(error){
      			console.log("error creating new user");
      		})

      	}
      })
     // if the user found return the user data using done
     //if the user is not found store data in db and return
	}

	passport.use(new FacebookStrategy(config.fb,authProcessor));
  passport.use(new TwitterStrategy(config.twitter,authProcessor));
}