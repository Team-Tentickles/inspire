var SocketHandler = function () {
    var socket = io.connect();
    
    var submit = function (artist1, artist2) {
        socket.emit('serverArtist', {first: artist1, second: artist2});
    }
    
    return {
        submit: submit;
    }
}