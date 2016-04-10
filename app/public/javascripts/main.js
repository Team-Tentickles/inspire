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
		inspireApp.selection.ready(this.artistData, this.CANVAS_WIDTH);
		// call draw
		this.draw();
	},
	
	draw:function(timestamp){
		// Throttle the frame rate.
		var app = inspireApp.main;
		if (timestamp < app.lastFrameTimeMs + (1000 / app.maxFPS)) {
			requestAnimationFrame(app.draw);
			return;
		}
		//app.delta += timestamp - app.lastFrameTimeMs;
		app.lastFrameTimeMs = timestamp;
		while (app.delta >= app.timestep) {
			// UPDATE FUNCTION
			// update(timestep);
			app.delta -= app.timestep;
		}
		// DRAW FUNCTIONS
		// background
		ctx.save();
		ctx.fillStyle="white";
		ctx.fillRect(0,0,app.CANVAS_WIDTH,app.CANVAS_HEIGHT);
		ctx.restore();
		// game functions
		inspireApp.start.draw();
		inspireApp.selection.draw(app.mouse, app.mouseIsDown);
		
		requestAnimationFrame(app.draw);
		
		
		
		//requestAnimationFrame(this.draw.bind(this));
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
	
	animation:function(){
		
	
	}
};
window.onload = function(){
	//console.log(local_data.decade);
	// set artist data
	inspireApp.main.artistData = local_data;
	// canvas
	this.canvas = document.getElementById("canvas");
	this.ctx = this.canvas.getContext('2d');
	// event Listeners
	this.canvas.addEventListener("mousedown", function(){inspireApp.main.clickFunctions(event);inspireApp.main.mouseIsDown = true}, false);
	this.canvas.addEventListener("mouseup", function(){inspireApp.main.mouseIsDown = false}, false);
	this.canvas.addEventListener("mouseout", function(){inspireApp.main.mouseIsDown = false}, false);
	this.canvas.addEventListener("mousemove", inspireApp.main.getMouse,false);
	// initialize app
	inspireApp.main.ready();
}


/*
	Resources:
	
	http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#solution

*/
