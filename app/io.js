var utils = require('./public/js/utils.js')
var socketio = require('socket.io');
var io = socketio();

io.sockets.on("connection", function(socket) {
	console.log("Aye");
	utils.makePackage({'first': 'Taylor Swift', 'second': 'Kelly Clarkson'}, socket);

	socket.on('serverArtist', function(data){
		utils.makePackage(data, socket);
	});
});

module.exports = io;