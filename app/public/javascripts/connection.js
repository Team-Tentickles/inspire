"use strict"
var inspireApp = inspireApp || {};

inspireApp.connection ={

	uiFont: inspireApp.main.uiFont,
	// Artist Card Vars
	artistCards: undefined,
	artistCardsCenter: [], // Artist Cards center coordinates
	artistCardsMoveX: [],
	artistCardsTranslateX: 350,
	artistCardsAlpha: 0,
	artistCardsNewAlpha: .6,
	artistCardsCenterAnimation: undefined,
	artistCardsAnimation: undefined, // Animation object for Artist Cards
	artistImagesAnimation: undefined, // Animation object for Artist Images
	artistButtonAnimation: undefined, // Animation object for Buttons
	artistNameAnimation: undefined,	
	artistNameSize: undefined,
	newArtist: undefined,
	newArtistImage: undefined,
	newArtistProperties: undefined,
	newArtistCardSize: 1,
	displayTextPadding: 90,
	loaded: false,
	// Artist Card Animation Vars
	newSize: .6, // (percentage) New artist card size after animation
	animationTime: 35,
	// Screen States
	SCREEN_STATE_ROCK: 0,
	SCREEN_STATE_CONNECTIONS: 1,
	screenState: undefined,
	screenStateTimeOut: 10, // seconds before window times out
	
    /*
            draw:
            Called in main game loop, but only executes inner functions if in the 'Connection' game state.
            Constantly running checkForConnection and drawing the artist cards.
    
    */
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_CONNECTION){

			this.checkForConnection();
			this.drawArtistCards(this.artistCards);
		}
	},
	
    /*
            drawArtistCards:
            Draws the two artists picked by the users.
            Once a connection is found, animations move the artist cards and a timer is triggered which eventually pushes the app to the final game state.
    
    */
	drawArtistCards:function(cards){
		if(this.loaded){
			var timer;
			function timeOut(){
				window.clearTimeout(timer);
				timer = window.setTimeout(function(){inspireApp.main.changeGameState(inspireApp.main.GAME_STATE_THANKS);}, inspireApp.connection.screenStateTimeOut*1000);
				inspireApp.connection.loaded = false;
			}
			timeOut();
		}
		ctx.save();
		ctx.textBaseline = "middle";
		
		for(var i = 0; i < inspireApp.selection.dropZones.length; i++){
			
			var card = cards.dimensions[i];
			var artistImages = cards.artistImages[i];
			var button = cards.button[i];
			var artistNames = cards.artistNames[i];
			var center = {};
			center.x = cards.dimensions[i].x + card.w/2;
			center.y = cards.dimensions[i].y + card.h/2;

			if(this.screenState == this.SCREEN_STATE_ROCK){
				
				ctx.save();
				inspireApp.selection.drawText("READY TO ROCK", canvas.width/2, canvas.height/2, this.uiFont.weight, this.uiFont.size, this.uiFont.color, this.uiFont.font, this.uiFont.align);
				ctx.restore();
				
				if(i == 0){
					var x = this.artistCardsTranslateX;
					var increase = true;
				}
				if(i == 1){
					var x = -1*(this.artistCardsTranslateX);
					var increase = false;
				}
				this.artistCardsMoveX[i] = {oldX: cards.dimensions[i].x + cards.dimensions[i].w/2, newX: cards.dimensions[i].x + cards.dimensions[i].w/2 + x, grow: increase}
				this.newArtistProperties = {
					x: canvas.width/2 - (cards.dimensions[0].w*this.newArtistCardSize)/2, 
					y: canvas.height/2 - (cards.dimensions[0].h*this.newArtistCardSize)/2, 
					w: cards.dimensions[0].w,
					h: cards.dimensions[0].h,
					name: undefined, 
					image: {w: undefined, h: cards.artistImages[0].h},
					button: {
						image: cards.button[0].image, 
						font: cards.artistNames[0].font,
						fontSize: cards.artistNames[0].font.size,
						w: cards.button[0].w, 
						h: cards.button[0].h
					}			
				};
				
				this.artistCardsAnimation = {minWidth: card.w*this.newSize, minHeight: card.h*this.newSize, decW: (card.w-(card.w*this.newSize))/this.animationTime, decH: (card.h-(card.h*this.newSize))/this.animationTime};
				
				this.artistImagesAnimation = {minWidth: artistImages.w*this.newSize, minHeight: artistImages.h*this.newSize, decW: (artistImages.w-(artistImages.w*this.newSize))/this.animationTime, decH: (artistImages.h-(artistImages.h*this.newSize))/this.animationTime};
				
				this.artistButtonAnimation = {minWidth: button.w*this.newSize, minHeight: button.h*this.newSize, decW: (button.w-(button.w*this.newSize))/this.animationTime, decH: (button.h-(button.h*this.newSize))/this.animationTime};
				
				this.artistNameAnimation = {origSize: artistNames.font.size, minSize: artistNames.font.size*this.newSize, decSize: (artistNames.font.size-(artistNames.font.size*this.newSize))/this.animationTime};
			}
			if(this.screenState == this.SCREEN_STATE_CONNECTION){
				var cardCenter = this.artistCardsCenter;
				var animateCard = this.artistCardsAnimation;
				var animateImage = this.artistImagesAnimation;
				var animateButton = this.artistButtonAnimation;
				var animateName = this.artistNameAnimation;
			
				center.x = inspireApp.selection.animate(center.x, this.artistCardsMoveX[i].newX, this.artistCardsMoveX[i].grow, Math.abs(this.artistCardsMoveX[i].newX - this.artistCardsMoveX[i].oldX)/this.animationTime);
				
				card.w = inspireApp.selection.animate(card.w, animateCard.minWidth, false, animateCard.decW);
				card.h = inspireApp.selection.animate(card.h, animateCard.minHeight, false, animateCard.decH);
				card.x = center.x - card.w/2;
				card.y = center.y - card.h/2;		
				
				artistImages.w = inspireApp.selection.animate(artistImages.w, animateImage.minWidth, false, animateImage.decW);
				artistImages.h = inspireApp.selection.animate(artistImages.h, animateImage.minHeight, false, animateImage.decH);
				artistImages.x = center.x - artistImages.w/2;
				artistImages.y = card.y;
				
				button.w = inspireApp.selection.animate(button.w, animateButton.minWidth, false, animateButton.decW);
				button.h = inspireApp.selection.animate(button.h, animateButton.minHeight, false, animateButton.decH);
				button.x = center.x - button.w/2;
				button.y = card.y + artistImages.h;
				
				artistNames.font.size = inspireApp.selection.animate(artistNames.font.size, animateName.minSize, false, animateName.decSize);
				artistNames.x = center.x;
				artistNames.y = card.y + artistImages.h + button.h/2;
				
				this.artistCardsAlpha = inspireApp.selection.animate(this.artistCardsAlpha, this.artistCardsNewAlpha, true, (this.artistCardsNewAlpha - this.artistCardsAlpha)/this.animationTime);
			}
			console.log(this.artistNameAnimation.origSize);
			// ARTIST CARD
			ctx.save();
			ctx.strokeStyle = 'rgba(0,0,0,0)';
			inspireApp.selection.roundRect(card.x, card.y, card.br, card.w, card.h);
			ctx.clip();
			
			// Artist Image
			ctx.drawImage(artistImages.image, artistImages.x, artistImages.y, artistImages.w, artistImages.h);
			
			// Button
			ctx.drawImage(button.image, button.x, button.y, button.w, button.h);
			
			// Artist Name
			inspireApp.selection.drawText(artistNames.name.toUpperCase(), artistNames.x, artistNames.y, artistNames.font.weight, artistNames.font.size, artistNames.font.color, artistNames.font.font, artistNames.font.align);
			
			// Alpha Mask
			if(this.screenState == this.SCREEN_STATE_CONNECTION){
				ctx.save();
				ctx.fillStyle = 'rgba(0,0,0,'+this.artistCardsAlpha+')';
				ctx.fillRect(card.x, card.y, card.w, card.h);
				ctx.restore();
			}
			
			ctx.stroke();
			ctx.restore();	
				
		}
			if(this.screenState == this.SCREEN_STATE_CONNECTION){
				// NEW ARTIST CARD
				ctx.save();
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				var newArtist = this.newArtistProperties;
				var overWidth = (newArtist.image.w - newArtist.w)/2;
				
				inspireApp.selection.roundRect(canvas.width/2 - newArtist.w/2, canvas.height/2 - newArtist.h/2, this.artistCards.dimensions[0].br, newArtist.w, newArtist.h);
				ctx.clip();
				
				// Artist Image
				ctx.drawImage(this.newArtistImage, newArtist.x - overWidth, newArtist.y, newArtist.image.w, newArtist.image.h);
				
				// Button
				ctx.drawImage(newArtist.button.image, canvas.width/2 - newArtist.w/2, (canvas.height/2 - newArtist.h/2) + newArtist.image.h);
				
				// Artist Name
				inspireApp.selection.drawText(newArtist.name.toUpperCase(), canvas.width/2, (canvas.height/2 - newArtist.h/2) + newArtist.image.h + newArtist.button.h/2, newArtist.button.font.weight, newArtist.button.fontSize, newArtist.button.font.color, newArtist.button.font.font, newArtist.button.font.align);
				
				ctx.stroke();
				ctx.restore();
				
				// Display Text
				ctx.save();
				inspireApp.selection.drawText("YOUR ROCK", canvas.width/2, canvas.height/2 - (newArtist.h/2 + this.displayTextPadding), this.uiFont.weight, this.uiFont.size, this.uiFont.color, this.uiFont.font, this.uiFont.align);
				inspireApp.selection.drawText("CONNECTION", canvas.width/2, canvas.height/2 - (newArtist.h/2 + this.displayTextPadding) + this.uiFont.size, this.uiFont.weight, this.uiFont.size, this.uiFont.color, this.uiFont.font, this.uiFont.align);
				ctx.restore();	
			}
		ctx.restore();
	},
	
    /*
           
           Checks for returned artist from socket.io and creates image object from data.
   
   */
	checkForConnection:function(){
		
		if(this.newArtist != undefined){
			var source = this.newArtist.image.url;
			this.newArtistImage = new Image();
			this.newArtistProperties.name = this.newArtist.name;
			this.newArtistImage.onload = function(){
				var oldWidth = inspireApp.connection.newArtistImage.width;
				var oldHeight = inspireApp.connection.newArtistImage.height;
				inspireApp.connection.newArtistProperties.image.w = (inspireApp.connection.newArtistProperties.image.h * oldWidth)/oldHeight;
				inspireApp.connection.loaded = true;
				inspireApp.connection.screenState = inspireApp.connection.SCREEN_STATE_CONNECTION;
			};	
			this.newArtistImage.src = source;
		}
	},
    
    /*
    
            Called by main when application is reset.
    
    */
	resetConnection:function(){
		this.artistCards = undefined;
		this.artistCardsCenter = [];
		this.artistCardsMoveX = [];
		this.artistCardsCenterAnimation = undefined;
		this.artistCardsAnimation = undefined;
		this.artistImagesAnimation = undefined;
        this.artistButtonAnimation = undefined;
        this.artistNameAnimation = undefined;
        this.newArtist = undefined;
        this.newArtistImage = undefined;
        this.newArtistProperties = undefined;
		this.screenState = undefined;
	}
};   