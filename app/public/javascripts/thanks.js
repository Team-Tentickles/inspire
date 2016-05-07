
"use strict"
var inspireApp = inspireApp || {};

inspireApp.thanks ={
	reset:false,
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_THANKS){
			// draw start screen
			//this.resetTimeout();
			this.drawDisplayText();
		}
	},
	drawDisplayText:function(){
		var app = inspireApp.main;
		ctx.save();
		ctx.textAlign = app.uiFont.align;
		ctx.textBaseline = "middle";
		ctx.font = app.uiFont.weight + " " + app.uiFont.size + "px " + app.uiFont.font;
		ctx.fillStyle = app.uiFont.color;
		ctx.fillText("THANK YOU FOR USING INSPIRE", inspireApp.main.CANVAS_WIDTH/2, inspireApp.main.CANVAS_HEIGHT/2);
		ctx.restore();
	}/*,
	resetTimeout:function(){
		if(!this.reset){
			var timer;
			function timeOut(){
				
				timer = setTimeout(function(){
				inspireApp.main.changeGameState(inspireApp.main.GAME_STATE_START); 
				//clearTimeout(timer); /*inspireApp.main.resetInspireApp();
				}, inspireApp.connection.screenStateTimeOut*1000);	
			}
			timeOut();
			//inspireApp.main.resetInspireApp();
			//this.reset = true;
		}
	}*/
};