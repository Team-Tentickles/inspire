var socketio = require('socket.io');
var io = socketio();

io.sockets.on("connection", function(socket) {
	console.log("Aye");
});

module.exports = io;