'use strict';

//Social authentication logic
require('./auth')();

let ioServer = function(app) {
	app.locals.chatrooms=[];
	const server =require('http').Server(app);
	const io =require('socket.io')(server);
	io.use(function(socket,next){
		require('./sessions')(socket.request,{},next);
	});
	require('./socket')(io,app);
	return server;
}

module.exports={
	router:require('./routes')(),
	session: require('./sessions'),
	ioServer
}