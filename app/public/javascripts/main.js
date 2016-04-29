// INSPIRE CANVAS APP
"use strict"
var inspireApp = inspireApp || {};

inspireApp.main ={
	// CONSTANTS
	CANVAS_WIDTH:1920,//1920
	CANVAS_HEIGHT:1080,//1080
	GAME_STATE_START:0,
	GAME_STATE_SELECTION:1,
	GAME_STATE_TRANSITION:2,
	GAME_STATE_EXPLORE:3,
	GAME_STATE_END:4,
	canvas:undefined,
	ctx:undefined,
	artistData:undefined,
	// VARS
	mouse:{},
	// DELTA TIME VARS
	delta:0,
	lastFrameTimeMs:0,
	maxFPS: 60,
	timestep: 1000/60,
	mouseIsDown:false,
	
	socketHanlder: SocketHandler(),
	
	// VARS
	gameState:undefined,
	
	// FUNCTIONS
	ready:function(){
		console.log("ready");
		// set W x H of the canvas
		$('#canvas').attr({
			"width": this.CANVAS_WIDTH,
			"height": this.CANVAS_HEIGHT
		});
		
		// set vars
		this.gameState = this.GAME_STATE_START;
		// gameState ready functions
		inspireApp.selection.ready(this.artistData);
		// call draw
		this.draw();
	},
	
	draw:function(timestamp){
		// Throttle the frame rate.
		var app = inspireApp.main;
		requestAnimationFrame(this.draw.bind(this));
		//if (timestamp < app.lastFrameTimeMs + (1000 / app.maxFPS)) {
		//	requestAnimationFrame(app.draw);
		//	return;
		//}
		//app.delta += timestamp - app.lastFrameTimeMs;
		//app.lastFrameTimeMs = timestamp;
		//while (app.delta >= app.timestep) {
			// UPDATE FUNCTION
			// update(timestep);
		//	app.delta -= app.timestep;
		//}
		// DRAW FUNCTIONS
		// background
		ctx.save();
		ctx.fillStyle="white";
		ctx.fillRect(0,0,app.CANVAS_WIDTH,app.CANVAS_HEIGHT);
		ctx.restore();
		// game functions
		inspireApp.start.draw();
		inspireApp.selection.draw(app.mouse, app.mouseIsDown);
		
		//requestAnimationFrame(app.draw);
		
		
		
		
	},
	
	changeGameState:function(){
		if (this.gameState == this.GAME_STATE_START) this.gameState = this.GAME_STATE_SELECTION;
		else if(this.gameState == this.GAME_STATE_SELECTION) this.gameState = this.GAME_STATE_TRANSITION;
		else if(this.gameState == this.GAME_STATE_TRANSITION) this.gameState = this.GAME_STATE_EXPLORE;
	},
	
	getMouse:function(e){
		//var mouse = {} // make an object
		inspireApp.main.mouse.x = e.pageX - e.target.offsetLeft;
		inspireApp.main.mouse.y = e.pageY - e.target.offsetTop;
		//return mouse;
	},
	clickFunctions:function(e){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_START){
			app.changeGameState();
		}
		else if(app.gameState == app.GAME_STATE_SELECTION){
			inspireApp.selection.checkClicks(app.mouse);
		}
	},
	preloadImages:function(data){

		var newImages = []; // array of image objects
		var images = []; // array of image src's
		var loadedimages = 0; // counts loaded images
		
		
		// Get images from the data
		for(var a = 0; a < data.decade.length; a++){
			for(var b = 0; b < data.decade[a].artistsArray.length; b++){
				var artistImages = data.decade[a].artistsArray[b].images;
				images.push(artistImages);
			}
		}
		
		function imageloadpost(){
			loadedimages++

			if (loadedimages == images.length){
				// Once images are loaded..
				var resizedImages = inspireApp.main.resizeImages(newImages);			
				inspireApp.selection.artistImages = resizedImages;
				inspireApp.main.ready();		
			}
		}
		for (var i = 0; i < images.length; i++){
			newImages[i] = new Image();
			newImages[i].src = images[i];
			newImages[i].onload = function(){
				imageloadpost()
			}
			newImages[i].onerror=function(){
				imageloadpost()
			}
		}	
	},
	resizeImages:function(newImages){		
		var newDimensions = {w:undefined, h:inspireApp.selection.dropZoneDimensions.h};		
		for(var i = 0; i < newImages.length; i++){
			var oldWidth = newImages[i].width;
			var oldHeight = newImages[i].height;
			newDimensions.w = (newDimensions.h * oldWidth)/oldHeight;			
			newImages[i].width = newDimensions.w;
			newImages[i].height = newDimensions.h;		
		}
		return newImages;
	}
};
window.onload = function(){
	//console.log(local_data.decade);
	// set artist data
	inspireApp.main.artistData = local_data;
	// canvas
	this.canvas = document.getElementById("canvas");
	this.ctx = this.canvas.getContext('2d');
	// Preload artist images
	inspireApp.main.preloadImages(inspireApp.main.artistData);
	// event Listeners
	this.canvas.addEventListener("mousedown", function(){inspireApp.main.clickFunctions();inspireApp.main.mouseIsDown = true}, false);
	this.canvas.addEventListener("mouseup", function(){inspireApp.main.mouseIsDown = false}, false);
	this.canvas.addEventListener("mouseout", function(){inspireApp.main.mouseIsDown = false}, false);
	this.canvas.addEventListener("mousemove", inspireApp.main.getMouse,false);
	// initialize app
	//inspireApp.main.ready();
}


/*
	Resources:
	
	http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#solution

*/
