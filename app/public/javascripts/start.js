
"use strict"
var inspireApp = inspireApp || {};

inspireApp.start ={
	
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_START){
			// draw start screen
			ctx.save();
			ctx.textAlign = app.uiFont.align;
			ctx.textBaseline = "middle";
			ctx.font = app.uiFont.weight + " " + app.uiFont.size + "px " + app.uiFont.font;
			ctx.fillStyle = app.uiFont.color;
			ctx.fillText("TOUCH TO GET STARTED", inspireApp.main.CANVAS_WIDTH/2, inspireApp.main.CANVAS_HEIGHT/2);
			ctx.restore();
		}
	}
};