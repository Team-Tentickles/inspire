"use strict"
var inspireApp = inspireApp || {};

inspireApp.transition ={

	uiFont: inspireApp.main.uiFont,
	artistCards: undefined,
	
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_TRANSITION){
			ctx.save();
			inspireApp.selection.drawText("READY TO ROCK", canvas.width/2, canvas.height/2, this.uiFont.weight, this.uiFont.size, this.uiFont.color, this.uiFont.font, this.uiFont.align);
			ctx.restore();
			this.drawArtistCards();
		}
	},
	
	drawArtistCards:function(){
		ctx.save();
		ctx.textBaseline = "middle";
		for(var i = 0; i < inspireApp.selection.dropZones.length; i++){
			
			// ARTIST CARD
			var card = this.artistCards.dimensions[i];
			ctx.save();
				//ctx.strokeStyle = 'rgba(0,0,0,0)';
			inspireApp.selection.roundRect(card.x, card.y, card.br, card.w, card.h);
			ctx.clip();
			// Artist Image
			var artistImages = this.artistCards.artistImages[i];
			ctx.drawImage(artistImages.image, artistImages.x, artistImages.y, artistImages.w, artistImages.h);
			// Button
			var button = this.artistCards.button[i]
			ctx.drawImage(button.image, button.x, button.y);
			// Artist Name
			var artistNames = this.artistCards.artistNames[i];
			inspireApp.selection.drawText(artistNames.name, artistNames.x, artistNames.y, artistNames.font.weight, artistNames.font.size, artistNames.font.color, artistNames.font.font, artistNames.font.align);
			
			ctx.stroke();
			ctx.restore();
		}
		ctx.restore();
	}
};