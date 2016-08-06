'use strict';
const h =require('../helpers');
module.exports = function(io,app) {
	let  allrooms=app.locals.chatrooms;

	console.log(allrooms);
	io.of('/roomslist').on('connection',function(socket){
      socket.on('getChatrooms', function(){
      	socket.emit('chatRoomsList',JSON.stringify(allrooms));
      });

      socket.on('createNewRoom', function(newRoomInput) {
      	console.log("new input is"+newRoomInput);
      	if(!(h.findRoomByName(allrooms,newRoomInput))) {
      		allrooms.push({
      			room:newRoomInput,
      			roomID:h.generateRoomID(),
      			users:[]
      		});

        socket.emit('chatRoomsList',JSON.stringify(allrooms));
        socket.broadcast.emit('chatRoomsList',JSON.stringify(allrooms));

        io.of('/chatter').on('connection',function(socket) {
          socket.on('join', function(data){
            let userList = h.addUserToHome(allrooms,data,socket);

            //updated list
            console.log('userList: ',userList);
            socket.broadcast.to('updateUsersList',JSON.stringify(userList.users));
            socket.emit('updateUsersList',JSON.stringify(userList.users));


          });

          socket.on('disconnect',function(){
            let room = h.removeUserFromRoom(allrooms,socket);
            socket.broadcast.to(room.roomID).emit('updateUsersList',JSON.stringify(userList.users));


          });
        })


      	}

      })
	});

}