
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
	//GAME_STATE_EXPLORE:3,
	//GAME_STATE_END:4,
	canvas:undefined,
	ctx:undefined,
	artistData:undefined,
	uiFont: {font: "Brandon_light", size: 36, color: "white", weight: "normal", align: "center"},
	decadeCircleImages: ["assets/50s.png", "assets/60s.png", "assets/70s.png", "assets/80s.png", "assets/90s.png", "assets/00s.png"],
	totalAssets: 10, // # of assets to be loaded 
	// VARS
	mouse:{},
	mouseIsDown:false,
	len:0,
	canX:[], 
	canY:[],
	mouseDrag:[],
	
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
	
	draw:function(){
		var app = inspireApp.main;
		requestAnimationFrame(this.draw.bind(this));
		
		// background
		//ctx.save();
		//ctx.fillStyle="white";
		//ctx.fillRect(0,0,app.CANVAS_WIDTH,app.CANVAS_HEIGHT);
		//ctx.restore();
		ctx.clearRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
		// game functions
		this.checkMouseDown();
		inspireApp.start.draw();
		inspireApp.selection.draw(app.mouse, app.mouseIsDown);
		inspireApp.connection.draw();	
	},

	changeGameState:function(){
		if (this.gameState == this.GAME_STATE_START) this.gameState = this.GAME_STATE_SELECTION;
		else if(this.gameState == this.GAME_STATE_SELECTION) this.gameState = this.GAME_STATE_CONNECTION;
		else if(this.gameState == this.GAME_STATE_CONNECTION) this.gameState = this.GAME_STATE_THANKS;
	//	else if(this.gameState == this.GAME_STATE_THANKS) this.resetInspireApp();
	},
	
	getMouse:function(e){
		inspireApp.main.mouse.x = e.pageX - e.target.offsetLeft;
		inspireApp.main.mouse.y = e.pageY - e.target.offsetTop;
		//return mouse;
	},
	clickFunctions:function(e){
		var app = inspireApp.main;
		//console.log(inspireApp.main.canX[0]+", "+inspireApp.main.canY[0]);
		if(app.gameState == app.GAME_STATE_START){
			app.changeGameState();
		}
		else if(app.gameState == app.GAME_STATE_SELECTION){
			//console.log(inspireApp.main.len);
			//for(var i = 0; i < inspireApp.main.len; i++){
				inspireApp.selection.checkClicks(app.mouse);
				//console.log(inspireApp.main.canX[i],inspireApp.main.canY[i]);
				//inspireApp.selection.checkClicks(inspireApp.main.canX[i],inspireApp.main.canY[i]);
			//}
		}
		else if(app.gameState == app.GAME_STATE_CONNECTION){
			//inspireApp.connection.screenState = inspireApp.connection.SCREEN_STATE_CONNECTION;
		}
	},
	// Mouse is down
	mouseDown:function(){
		inspireApp.main.mouseIsDown = true;
		//inspireApp.main.mouseXY();
	},
	// Mouse is up
	mouseUp:function(){
		inspireApp.main.mouseIsDown = false;
		//inspireApp.main.mouseXY();
	},
	mouseXY:function(e){
		if (!e)
            e = event;
        inspireApp.main.canX[0] = e.pageX - canvas.offsetLeft;
        inspireApp.main.canY[0] = e.pageY - canvas.offsetTop;
        inspireApp.main.len = 1;
		//inspireApp.selection.drag(inspireApp.main.canX[0],inspireApp.main.canY[0]);
	},
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
	preloadAssets:function(){
		var loadedassets = 0;
		var newImages = [];
		function assetLoadPost(){
			loadedassets ++;
			//console.log("assets loaded "+loadedassets);
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
	resizeAssets:function(img, w, h){
		var newWH = {};
		var oldWH = {w: img.width, h: img.height};
		h = (w * oldWH.h)/oldWH.w;
		newWH.w = w;
		newWH.h = h;
		return newWH;
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
		function imageLoadPost(){
			loadedimages++;
			if (loadedimages == images.length){
				// Once images are loaded..
				var resizedImages = inspireApp.main.resizeImages(newImages, undefined, inspireApp.selection.dropZoneDimensions.h);			
				inspireApp.selection.artistImages = resizedImages;
				inspireApp.main.preloadAssets();
				// Initialize Inspire App
				//inspireApp.main.ready();		
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
	resizeImages:function(newImages, w, h){		
		//var newDimensions = {w: w, h: h};		
		for(var i = 0; i < newImages.length; i++){
			var oldWidth = newImages[i].width;
			var oldHeight = newImages[i].height;
			w = (h * oldWidth)/oldHeight;	
			if(w < inspireApp.selection.dropZoneDimensions.w){
				w = inspireApp.selection.dropZoneDimensions.w;
				h = (w * oldHeight)/oldWidth;
				//console.log("image width too small");
			}
			newImages[i].width = w;
			newImages[i].height = h;		
		}
		return newImages;
	},
	touchDown:function(){
		//inspireApp.main.mouseIsDown = true;
		inspireApp.main.touchXY();
		inspireApp.main.clickFunctions();
	},
	touchUp:function(e){
		if (!e)
        e = event;

		inspireApp.selection.checkDropZones();
        inspireApp.main.len = e.targetTouches.length;
		//inspireApp.main.mouseIsDown = false;
	},
	touchXY:function(e) {
        if (!e)
            e = event;
        e.preventDefault();
        inspireApp.main.len = e.targetTouches.length;
		
        for (var i = 0; i < inspireApp.main.len; i++) {
            inspireApp.main.canX[i] = e.targetTouches[i].pageX; //- canvas.offsetLeft;
            inspireApp.main.canY[i] = e.targetTouches[i].pageY; //- canvas.offsetTop;
			//console.log(inspireApp.main.canX[i]+", "+inspireApp.main.canY[i]);
        }
    },
	resetInspireApp:function(){
		
		this.gameState = this.GAME_STATE_START;
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
	// Event Listeners
	this.canvas.addEventListener("mousedown", function(){inspireApp.main.clickFunctions(); inspireApp.main.mouseDown();}, false);
	this.canvas.addEventListener("mouseup", function(){inspireApp.main.mouseUp();}, false);
	this.canvas.addEventListener("mouseout", function(){inspireApp.main.mouseIsDown = false}, false);
	// Touch Listeners
	//this.canvas.addEventListener("touchstart", inspireApp.main.touchDown, false);
    //this.canvas.addEventListener("touchend", inspireApp.main.touchUp, false);
    //this.canvas.addEventListener("touchmove", inspireApp.main.touchXY, false);
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
	// initialize app
	//inspireApp.main.ready();
}
