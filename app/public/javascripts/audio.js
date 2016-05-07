var AudioObj = function () {
    var $audioObject = $('#similarAudio');
    var audioURL = '';
    
    /**
     * This function initializes the Audio Object by 
     * grabbing it from the DOM
     */
    var init = function (id) {
        $audioObject = $(id);
    };
    
    /**
     * Play the current audio file, fading in to it
     * and then out.
     */
    var playSong = function() {
        $audioObject.attr('src', audioURL);
        $audioObject.prop('volume', 0);
        $audioObject.animate({volume: 1}, 5000);
        setTimeout(function(){
            $audioObject.animate({volume: 0}, 5000);
        }, 25000);
        $audioObject[0].play();
    };
    
    /**
     * set the current audioURL
     */
    var setSong = function(url) {
        $audioObject[0].pause();
        audioURL = url;
        console.log(audioURL);
    }
    
    return {
        init: init,
        playSong: playSong,
        setSong: setSong,
    };
};
