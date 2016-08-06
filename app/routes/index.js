'use strict';
var h = require('../helpers');
var passport = require('passport');
var config = require('../config');
module.exports = function (){
	var routes = {
		'get' : {
			'/' : function (req,res,next) {
				res.render('login');
			},
			'/rooms' : [h.isAuthenticated,function (req,res,next) {
				res.render('rooms',{
					user:req.user,
					host:config.host
				});}]

			,
			'/chat/:id' : [h.isAuthenticated,function (req,res,next) {
				let getRoom =h.findRoomById(req.app.locals.chatrooms,req.params.id);
				if(getRoom === undefined) {
					return next();
				}

				else {
					console.log(req.user);
					res.render('chatroom',{
					user:req.user,
					host:config.host,
					room:getRoom.room,
					roomID:getRoom.roomID

					});
				}
				
			}],
			'/auth/facebook' : passport.authenticate('facebook'),
			'/auth/facebook/callback' : passport.authenticate('facebook',{
				successRedirect:'/rooms',
				failureRedirect:'/'
			}),
			'/auth/twitter' : passport.authenticate('twitter'),
			'/auth/twitter/callback' : passport.authenticate('twitter',{
				successRedirect:'/rooms',
				failureRedirect:'/'
			}),
			'/logout' : function(req,res,next) {
				req.logout();
				res.redirect('/');
			}


		},
		'post' : {

		},
		'NA' : function(req,res,next) {
			 res.status(404).sendFile(process.cwd() + '/views/404.htm');
		}
	}


	return h.route(routes);


}