var AudioObj = function () {
    var $audioObject = $('#similarAudio');
    
    /**
     * This function initializes the Audio Object by 
     * grabbing it from the DOM
     */
    var init = function () {
        $audioObject = $('#similarAudio');
    };
    
    /**
     * Given a URL for a song, play it, fading init
     * and out.
     */
    var playSong = function(songURL) {
        $audioObject.attr('src', data.similar.song);
        $audioObject.prop('volume', 0);
        $audioObject.animate({volume: 1}, 5000);
        setTimeout(function(){
            $audioObject.animate({volume: 0}, 5000);
        }, 10000);
    };
    
    return {
        init: init,
        playSong: playSong
    };
};
