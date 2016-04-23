var utils = require('./server/utils.js')
var socketio = require('socket.io');
var io = socketio();

io.sockets.on("connection", function(socket) {
	console.log("Connection detected");

	socket.on('serverArtist', function(data){
        console.log("Searching...");
		//utils.makePackage(data, socket);
		utils.findSong(data);
	});
});

module.exports = io;