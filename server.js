'use strict';
var express = require('express');
var app = express();
var chatCat = require('./app');
var passport = require('passport');
var fs= require('fs');
app.set('port',process.env.PORT || 3000);
app.set('view engine','ejs');
app.use(express.static('public'));



//middleware functions
  //session
app.use(chatCat.session);
 //social login
app.use(passport.initialize());
//social session
app.use(passport.session());

 //basic navigation
app.use('/',chatCat.router);



   
chatCat.ioServer(app).listen(app.get('port'),function(){
	console.log('chat cat running on 3000');
});
