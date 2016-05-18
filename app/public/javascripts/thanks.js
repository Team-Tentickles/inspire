
"use strict"
var inspireApp = inspireApp || {};

inspireApp.thanks ={
    
    /*
        Draw Thank You screen
    */
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_THANKS){
			this.drawDisplayText(app);
		}
	},
	drawDisplayText:function(app){
		ctx.save();
		ctx.textAlign = app.uiFont.align;
		ctx.textBaseline = "middle";
		ctx.font = app.uiFont.weight + " " + app.uiFont.size + "px " + app.uiFont.font;
		ctx.fillStyle = app.uiFont.color;
		ctx.fillText("THANK YOU FOR USING INSPIRE", inspireApp.main.CANVAS_WIDTH/2, inspireApp.main.CANVAS_HEIGHT/2);
		ctx.restore();
	}
};