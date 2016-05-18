
// INSPIRE CANVAS APP
"use strict"
var inspireApp = inspireApp || {};

inspireApp.main ={
	// CONSTANTS
	CANVAS_WIDTH:1920,//1920
	CANVAS_HEIGHT:1080,//1080
	GAME_STATE_START:0,
	GAME_STATE_SELECTION:1,
	GAME_STATE_CONNECTION:2,
	GAME_STATE_THANKS:3,
	canvas:undefined,
	ctx:undefined,
	artistData:undefined,
	uiFont: {font: "Brandon_light", size: 36, color: "white", weight: "normal", align: "center"},
	decadeCircleImages: ["assets/50s.png", "assets/60s.png", "assets/70s.png", "assets/80s.png", "assets/90s.png", "assets/00s.png"],
	totalAssets: 10, // # of assets to be loaded 
	mouse:{},
	mouseIsDown:false,
	len:0,
	canX:[], 
	canY:[],
	mouseDrag:[],
	gameState:undefined,
	
    /*
        Called after images are loaded, initializes inspireApp.
    */
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
	
    /*
        Main game loop, calls draw functions from each "class"
    */
	draw:function(){
		var app = inspireApp.main;
		requestAnimationFrame(this.draw.bind(this));		
		// background
		ctx.clearRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
		// game functions
		this.checkMouseDown();
		inspireApp.start.draw();
		inspireApp.selection.draw(app.mouse, app.mouseIsDown);
		inspireApp.connection.draw();
		inspireApp.thanks.draw();
	},
    
    /*
        Changes the game state on call
    */
	changeGameState:function(currentState){
		this.gameState = currentState;
	},
	
    /*
        Used to get the position of the mouse.
    */
	getMouse:function(e){
		inspireApp.main.mouse.x = e.pageX - e.target.offsetLeft;
		inspireApp.main.mouse.y = e.pageY - e.target.offsetTop;
	},
    
    /*
        When the mouse and in the specified game state, run those click functions.
    */
	clickFunctions:function(e){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_START){
			app.changeGameState(app.GAME_STATE_SELECTION);
		}
		else if(app.gameState == app.GAME_STATE_SELECTION){

				inspireApp.selection.checkClicks(app.mouse);
				
		}
		else if(app.gameState == app.GAME_STATE_THANKS){
			this.resetInspireApp();
			app.changeGameState(app.GAME_STATE_START);
		}

	},
    
	// Mouse is down
	mouseDown:function(){
		inspireApp.main.mouseIsDown = true;
	},
	// Mouse is up
	mouseUp:function(){
		inspireApp.main.mouseIsDown = false;
	},
	
    /*
        Checks if mouse down, turn off pointer events when mouse is down.
    */
	checkMouseDown:function(){

		var elements = document.getElementsByTagName('div');
		for (var i = 0; i < elements.length; i++) {
			if(this.mouseIsDown){
				elements[i].style.pointerEvents = "none";
			}else{
				elements[i].style.pointerEvents = "auto";
			}
		}
	},
    
    /*
        Retrieves image assets and stores them as image objects
    */
	preloadAssets:function(){
		var loadedassets = 0;
		var newImages = [];
		function assetLoadPost(){
			loadedassets ++;
			if(loadedassets == inspireApp.main.totalAssets){
				// Initialize Inspire App
				inspireApp.selection.decadeCircleImages = newImages;
				inspireApp.main.ready();
			}
		}
		var purpleButton = new Image();
		purpleButton.src = "assets/buttonpurple.png";
		purpleButton.onload = function(){
			var newWH = inspireApp.main.resizeAssets(purpleButton, inspireApp.selection.dropZoneDimensions.w, undefined);
			purpleButton.width = newWH.w;
			purpleButton.height = newWH.h;
			inspireApp.selection.purpleButton = purpleButton;
			assetLoadPost();
		}
		var greyButton = new Image();
		greyButton.src = "assets/buttongrey.png";
		greyButton.onload = function(){
			var newWH = inspireApp.main.resizeAssets(greyButton, inspireApp.selection.dropZoneDimensions.w, undefined);
			greyButton.width = newWH.w;
			greyButton.height = newWH.h;
			inspireApp.selection.greyButton = greyButton;
			assetLoadPost();
		}
		var artistCircle = new Image();
		artistCircle.src = "assets/pinkBullet.png";
		artistCircle.onload = function(){
			inspireApp.selection.artistCircleImages = artistCircle;
			assetLoadPost();
		}
		var exitCircle = new Image();
		exitCircle.src = "assets/X.png";
		exitCircle.onload = function(){
			inspireApp.selection.dropZoneExitCircleImage = exitCircle;
			assetLoadPost();
		}
		for(var i = 0; i < this.decadeCircleImages.length; i++){
			newImages[i] = new Image();
			newImages[i].src = this.decadeCircleImages[i];
			newImages[i].onload = function(){
				assetLoadPost();
			}
		}
	},
    
    /*
        Resizes front end assets
    */
	resizeAssets:function(img, w, h){
		var newWH = {};
		var oldWH = {w: img.width, h: img.height};
		h = (w * oldWH.h)/oldWH.w;
		newWH.w = w;
		newWH.h = h;
		return newWH;
	},
    
    /*
    
        Called in on window load. Loops through artist images, creates image ovject, calls resizeImages, stores new artistImages in selection
    
    */
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
		function imageLoadPost(){
			loadedimages++;
			if (loadedimages == images.length){
				// Once images are loaded..
				var resizedImages = inspireApp.main.resizeImages(newImages, undefined, inspireApp.selection.dropZoneDimensions.h);			
				inspireApp.selection.artistImages = resizedImages;
				inspireApp.main.preloadAssets();
				// Initialize Inspire App	
			}
		}
		for (var i = 0; i < images.length; i++){
			newImages[i] = new Image();
			newImages[i].src = images[i];
			newImages[i].onload = function(){
				imageLoadPost()
			}
			newImages[i].onerror=function(){
				imageLoadPost()
			}
		}	
	},
    
    /* 
    
        Resizes artist images. Images have uniform heights 
        
    */
	resizeImages:function(newImages, w, h){				
		for(var i = 0; i < newImages.length; i++){
			var oldWidth = newImages[i].width;
			var oldHeight = newImages[i].height;
			w = (h * oldWidth)/oldHeight;	
			if(w < inspireApp.selection.dropZoneDimensions.w){
				w = inspireApp.selection.dropZoneDimensions.w;
				h = (w * oldHeight)/oldWidth;
			}
			newImages[i].width = w;
			newImages[i].height = h;		
		}
		return newImages;
	},

    
    /*
        Resets vars when inspireApp loops back to game state start.
    */
	resetInspireApp:function(){
		var selection = inspireApp.selection;
		var connection = inspireApp.connection;
		// Selection
		selection.resetSelection();
		// Connection
		connection.resetConnection();
		// Main	
		this.mouseIsDown = false;
	}
};

/*

        Window onload functions

*/
window.onload = function(){
	// set artist data
	inspireApp.main.artistData = local_data;
	// canvas
	this.canvas = document.getElementById("canvas");
	this.ctx = this.canvas.getContext('2d');
	// Preload artist images
	inspireApp.main.preloadImages(inspireApp.main.artistData);
	// Event Listeners
	this.canvas.addEventListener("mousedown", function(){inspireApp.main.clickFunctions(); inspireApp.main.mouseDown();}, false);
	this.canvas.addEventListener("mouseup", function(){inspireApp.main.mouseUp();}, false);
	this.canvas.addEventListener("mouseout", function(){inspireApp.main.mouseIsDown = false}, false);
	window.addEventListener("mousemove", inspireApp.main.getMouse,false);
	
	window.socketHandler = SocketHandler();
	window.audioObj = AudioObj();
	audioObj.init('#similarAudio');
	
	console.log('setters');
	socketHandler.setSimilarHandler(function(data) {
		inspireApp.connection.newArtist = data;
		console.log(data);
		console.log("received: " + data.name);
	});
	socketHandler.setPackageHandler(function(data) {
		console.log(data);
		audioObj.setSong(data.similar.song);
	});
	socketHandler.setPlayAudioHandler(function(data) {
		console.log(data);
		audioObj.playSong();
	});
}
