// INSPIRE CANVAS APP
"use strict"
var inspireApp = inspireApp || {};

inspireApp.main ={
	// CONSTANTS
	CANVAS_WIDTH:1920,
	CANVAS_HEIGHT:1080,
	GAME_STATE_START:1,
	GAME_STATE_SELECTION:2,
	GAME_STATE_TRANSITION:3,
	GAME_STATE_EXPLORE:4,
	GAME_STATE_END:5,
	canvas:undefined,
	ctx:undefined,
	
	// VARS
	gameState:undefined,
	// EVENTS
	// FUNCTIONS
	ready:function(){
		console.log("ready");
		$('#canvas').css({
			'width': this.CANVAS_WIDTH,
			'height': this.CANVAS_HEIGHT
		});
		this.draw();
	},
	
	draw:function(){
		console.log("draw");
	},
	
	changeGameState:function(){
		
	}




};
window.onload = function(){
	console.log(local_data);
	// canvas
	this.canvas = document.getElementById("canvas");
	this.ctx = this.canvas.getContext('2d');
	// event listeners
	
	// initialize app
	inspireApp.main.ready();
}
/*"use strict"
var inspireApp = inspireApp || (function(){
	// CONSTANTS
	var artists ={}; // private
	//var CANVAS_WIDTH = document.getElementById('canvas').style.width;
	//var CANVAS_HEIGHT = document.getElementById('canvas').style.height;
	
    return {
        init : function(Args) {
		    // json artist data
			artists = Args;
			var elem = document.getElementById("canvas");
			var theCSSprop = window.getComputedStyle(elem,null).getPropertyValue("height");
			console.log(theCSSprop);
			//console.log($('#canvas').css());
            // some other initialising
			console.dir(artists["1950s"][0].name);
			//console.log(CANVAS_HEIGHT)
        }
    };
}());
*/