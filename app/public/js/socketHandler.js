
//* This will be the function to get the artist and send it to socket to process *//
//* Use the 'serverArtist' as the emit command and put in your own variables for "first" and "second" *//
var submitArtist = function(){

	//socket.emit('serverArtist', {first: firstArtist, second: secondArtist});
}

var init = function(){
    socket = io.connect();

    //* This is where you will get your data package back *//
    socket.on('package', function(data){
    	//* Parsing through the datapackage logic goes here *//
    }
}
window.onload = init;