/**
 * Declare the form elements
 */
var select1,
    select2,
    submit;
var initializeFields = function() {
    select1 = document.getElementById("first");
    select2 = document.getElementById("second");
    submit = document.getElementById("send");
}

var init = function(){
    initializeFields();
    socket = io.connect();

    //* This is where you will get your data package back *//
    socket.on('package', function(data){
    	var fImage = document.getElementById('fImage');
        var fVideo = document.getElementById('fVideo');
        var influ = document.getElementById('influ');

        console.log(data);

        fImage.src = data.first.images[0].url;
        fVideo.src = data.first.video[0].url;
        influ.innerHTML = data.first.influencers[0].name;

        sImage.src = data.second.images[0].url;
        sVideo.src = data.second.video[0].url;
        sinflu.innerHTML = data.second.influencers[0].name;
    });
    
    //* This will be the function to get the artist and send it to socket to process *//
    //* Use the 'serverArtist' as the emit command and put in your own variables for "first" and "second" *//
    var submitArtist = function(){
        var firstArtist = select1.options[select1.selectedIndex].value;
        var secondArtist = select2.options[select2.selectedIndex].value;
        socket.emit('serverArtist', {first: firstArtist, second: secondArtist});
    }
    submit.addEventListener("click", submitArtist);
}


/**
 * This is an object that handles socket events
 */
var SocketHandler = function () {
    var socket = io.connect();
    
    socket.on('fromSpire', function (data) {
        console.log(data);
    });
    
    var submit = function (artist1, artist2) {
        socket.emit('serverArtist', {
            first: artist1, 
            second: artist2
        });
    };
    
    return {
        submit: submit,
    };
}
window.onload = init;
