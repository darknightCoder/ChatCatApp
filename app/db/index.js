'use strict';
var config =require('../config');
var Mongoose =require('mongoose').connect(config.dbURI);

//Log an error if the connection fails
Mongoose.connection.on('error', function(error) {
	console.log(config.dbURI);
	console.log("MongoDB error",error);

});
const chatUser = new Mongoose.Schema({
	profileId: String,
	fullName:String,
	profilePic:String

});
var userModel = Mongoose.model('chatUser',chatUser);
module.exports = {
	Mongoose,
	userModel
}