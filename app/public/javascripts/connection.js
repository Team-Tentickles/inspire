"use strict"
var inspireApp = inspireApp || {};

inspireApp.connection ={

	uiFont: inspireApp.main.uiFont,
	// Artist Card Vars
	artistCards: undefined,
	artistCardsCenter: [], // Artist Cards center coordinates
	artistCardsAnimation: undefined, // Animation object for Artist Cards
	artistImagesAnimation: undefined, // Animation object for Artist Images
	artistButtonAnimation: undefined, // Animation object for Buttons
	artistNameAnimation: undefined,
	// Artist Card Animation Vars
	newSize: .66, // (percentage) New artist card size after animation
	animationTime: 35,
	// Screen States
	SCREEN_STATE_ROCK: 0,
	SCREEN_STATE_CONNECTIONS: 1,
	screenState: undefined,
	
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_CONNECTION){
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
			
			var card = this.artistCards.dimensions[i];
			var artistImages = this.artistCards.artistImages[i];
			var button = this.artistCards.button[i];
			var artistNames = this.artistCards.artistNames[i];
			if(this.screenState == this.SCREEN_STATE_ROCK){
				this.artistCardsCenter[i] = {x: card.x + card.w/2, y: card.y + card.h/2};
				this.artistCardsAnimation = {minWidth: card.w*this.newSize, minHeight: card.h*this.newSize, decW: (card.w-(card.w*this.newSize))/this.animationTime, decH: (card.h-(card.h*this.newSize))/this.animationTime};
				
				this.artistImagesAnimation = {minWidth: artistImages.w*this.newSize, minHeight: artistImages.h*this.newSize, decW: (artistImages.w-(artistImages.w*this.newSize))/this.animationTime, decH: (artistImages.h-(artistImages.h*this.newSize))/this.animationTime};
				
				this.artistButtonAnimation = {minWidth: button.w*this.newSize, minHeight: button.h*this.newSize, decW: (button.w-(button.w*this.newSize))/this.animationTime, decH: (button.h-(button.h*this.newSize))/this.animationTime};
				
				this.artistNameAnimation = {minSize: artistNames.font.size*this.newSize, decSize: (artistNames.font.size-(artistNames.font.size*this.newSize))/this.animationTime};
			}
			if(this.screenState == this.SCREEN_STATE_CONNECTION){
				var cardCenter = this.artistCardsCenter[i];
				var animateCard = this.artistCardsAnimation;
				var animateImage = this.artistImagesAnimation;
				var animateButton = this.artistButtonAnimation;
				var animateName = this.artistNameAnimation;
				// Animate		
				card.w = inspireApp.selection.animate(card.w, animateCard.minWidth, false, animateCard.decW);
				card.h = inspireApp.selection.animate(card.h, animateCard.minHeight, false, animateCard.decH);
				card.x = cardCenter.x - card.w/2;
				card.y = cardCenter.y - card.h/2;
				
				artistImages.w = inspireApp.selection.animate(artistImages.w, animateImage.minWidth, false, animateImage.decW);
				artistImages.h = inspireApp.selection.animate(artistImages.h, animateImage.minHeight, false, animateImage.decH);
				artistImages.x = cardCenter.x - artistImages.w/2;
				artistImages.y = card.y;
				
				button.w = inspireApp.selection.animate(button.w, animateButton.minWidth, false, animateButton.decW);
				button.h = inspireApp.selection.animate(button.h, animateButton.minHeight, false, animateButton.decH);
				button.x = cardCenter.x - button.w/2;
				button.y = card.y + artistImages.h;
				
				artistNames.font.size = inspireApp.selection.animate(artistNames.font.size, animateName.minSize, false, animateName.decSize);
				artistNames.y = card.y + artistImages.h + button.h/2;
			}
			
			// ARTIST CARD
			ctx.save();
				//ctx.strokeStyle = 'rgba(0,0,0,0)';
			inspireApp.selection.roundRect(card.x, card.y, card.br, card.w, card.h);
			ctx.clip();
			
			// Artist Image
			ctx.drawImage(artistImages.image, artistImages.x, artistImages.y, artistImages.w, artistImages.h);
			
			// Button
			ctx.drawImage(button.image, button.x, button.y, button.w, button.h);
			
			// Artist Name
			inspireApp.selection.drawText(artistNames.name, artistNames.x, artistNames.y, artistNames.font.weight, artistNames.font.size, artistNames.font.color, artistNames.font.font, artistNames.font.align);
			
			ctx.stroke();
			ctx.restore();	
		}
		ctx.restore();
	}
};