var utils = require('./server/utils.js')
var socketio = require('socket.io');
var io = socketio();

io.sockets.on("connection", function(socket) {
	console.log("Connection detected");
	
	socket.join("AssetShare");
	
	socket.on('serverArtist', function(data){
        console.log("Searching...");
		utils.makePackage(data, socket);
		//utils.findAlbumArt(data.first);
	});
    
    socket.on('fromSpire', function(data) {
        console.log(data);
        socket.broadcast.to('AssetShare').emit("fromSpire", data);
    });
});

module.exports = io;