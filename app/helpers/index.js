'use strict';
var router = require('express').Router();
var db = require('../db');
const crypto= require('crypto');


var registerRoutes = function (routes,method) {
		for (var key in routes) {
		if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)){
			registerRoutes(routes[key],key);
		}	
		else {
			//register the routes
			if(method === 'get') {
				router.get(key,routes[key]);
			}

			else if (method === 'post') {
				router.post(key,routes[key]);
			}
			else {
				router.use(routes[key]);
			}
		}
		}
	}


var route = function (routes) {
		registerRoutes(routes);
		return router;

}

let findOne = function(profileId) {
	return db.userModel.findOne({
		'profileId':profileId
	});
}	

let createNewUser = function(profile) {
	return new Promise(function(resolve,reject) {
		let newChatUser =new db.userModel({
         profileId:profile.id,
         fullName:profile.displayName,
         profilePic: profile.photos[0].value || ''

		})
		newChatUser.save(function(error){
			if(error) {
				console.log('create user error',error);
				reject(error);
			}
			else {
				resolve(newChatUser);
			}
		})
	})
}

let findById = function (id) {
	return new Promise(function(resolve,reject){
		db.userModel.findById(id ,function(error,user){
			if(error){
				reject(error);
			}
			else {
				resolve(user);
			}
		});
	});
}



let isAuthenticated = function(req,res,next) {
	if(req.isAuthenticated){
		next();
	}
	else {
		res.redirect('/');
	}
}

let findRoomByName = function (allrooms,room) {
   let findRoom =allrooms.findIndex(function(element,index,array){
   	if(element.room===room){
   		return true;
    }

    else {
    	return false;
    }
    return findRoom >-1 ? true:false;
   });
}
//function to generate a randome room id

let generateRoomID = function() {
  return crypto.randomBytes(24).toString('hex');
}

let findRoomById =function (allrooms,roomId) {
	return allrooms.find(function(element,index,array) {
		if(element.roomID===roomId){
			return true;
		}
		else {
			return false;
		}
	});
}

let addUserToHome = function(allrooms,data,socket) {
	let getRoom =findRoomById(allrooms,data.roomID)
	if(getRoom !== undefined) {
		let userID= socket.request.session.passport.user;
		let checkUser = getRoom.users.findIndex(function(element,index,array) {
			if(element.userID===userID){
				 return true;
			}
			else {
				return false;
			}
		});
		if(checkUser > -1) {
			getRoom.users.splice(checkUser,1);
		}

		getRoom.users.push({
          socketID : socket.id,
          userID,
          user: data.user,
          userPic:data.userPic
		});
		socket.join(data.roomID);
		return getRoom;
	}

}

let removeUserFromRoom = function(allrooms,socket) {
	for(let room in allrooms) {
		let findUser =room.users.findIndex(function(element,index,array) {
			if(element.socketID=socket.id) {
				return true;
			}
			else {
				return false;
			}
		});
       
       if(findUser> -1) {
       	socket.leave(room.roomID);
       	room.users.splice(findUser,1);
       	return room;
       }

	}
}
module.exports = {
	route,
	findOne,
	createNewUser,
	findById,
	isAuthenticated,
	findRoomByName,
	generateRoomID,
	findRoomById,
	addUserToHome,
	removeUserFromRoom
};