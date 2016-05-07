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


        fImage.src = data.first.images[0].url;
        fVideo.src = data.first.video[0].url;
        //influ.innerHTML = data.first.influencers[0].name;

        sImage.src = data.second.images[0].url;
        sVideo.src = data.second.video[0].url;
        //sinflu.innerHTML = data.second.influencers[0].name;

        var $audioObject = $('#similarAudio');
        $audioObject.attr('src', data.similar.song);
        $audioObject.prop('volume', 0);
        $audioObject.animate({volume: 1}, 5000);
        setTimeout(function(){
            $audioObject.animate({volume: 0}, 5000);
        }, 10000)

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
window.onload = init;