'use strict';
var session =require('express-session');
var MongoStore =require('connect-mongo')(session);
var config =require('../config');
if(process.env.NODE_ENV === 'production') {
	module.exports =session ({
		secret:config.sessionSecret,
		resave:false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection : db.Mongoose.connection
		})
	});

}

else {
	module.exports =session ( {
		secret:config.sessionSecret,
		resave:false,
		saveUninitialized: true
	});
}