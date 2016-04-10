var utils = require('./public/js/utils.js')
var socketio = require('socket.io');
var io = socketio();

io.sockets.on("connection", function(socket) {
	console.log("Connection detected");
	//utils.makePackage({'first': 'Taylor Swift', 'second': 'Kelly Clarkson'}, socket);

    socket.join("AssetShare");
    
    socket.emit('ping', {});
    socket.emit('ping', {});
    socket.emit('ping', {});
    socket.emit('ping', {});
    socket.emit('ping', {});
    
	socket.on('serverArtist', function(data){
        console.log("Hello");
		utils.makePackage(data, socket);
	});
    
    socket.on("package", function(data) {
        console.log("all packaged up");
    });
});

module.exports = io;