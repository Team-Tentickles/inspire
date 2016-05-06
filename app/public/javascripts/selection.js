"use strict"
var inspireApp = inspireApp || {};

inspireApp.selection ={
	totalDecades:6, // # of decades
	totalArtists:5, // # of artists per decade
	// Center coords of the canvas
	canvasCenterX:inspireApp.main.CANVAS_WIDTH/2,
	canvasCenterY:inspireApp.main.CANVAS_HEIGHT/2,
	// UI
	uiFont: inspireApp.main.uiFont,
	draggedArtists:[],
	// Center of decades ui
	decadesUIradius:250,
	// array of decadeCircle objects
	decadeCircles:[],
	decadeCircleAnimate:4,
	decadeCircleImages: undefined,
	decadeCirclesRadius:44,
	decadeCirclesRadiusSelected:64,
	// artist circle vars
	artistCirclesRadius:10, // radius of artist circles
	artistCircleTextPadding:18,
	artistCircleImages: undefined,
	artistCircleFont: {font: "Brandon_light", size: 16, color: "white", weight: "normal"},
	artistUIradius:20, // distance from decadeCircles
	artistUIradians:(Math.PI)/1.8,
	artistImages:undefined, // Array of preloaded & resized artist images
	// Drag and Drop Circles
	dropZones:[],
	dropZoneRadius:150,
	dropZonePadding:80, // padding between drop zones and edge of viewport
	dropZoneBorderRad:20, // Border radius of rectange when occupied with artist
	// Artist Panel Vars
	dropZoneStateSelect:0,
	dropZoneStateConfirm:1,
	dropZoneStateLocked:2,
	dropZoneArtistImages: [], // Stores properties of the image (passed on to connection)
	dropZoneArtistCards: [], // Store card properties (passed on to connection)
	dropZoneArtistNames: [], // Store artist names (passed on to connection)
	dropZoneArtistButton: [], // Store button properties (passed on to connection)
	dropZoneDimensions:{w:380, h:480},
	dropZoneExitPadding:50, // Exit button padding from artist pannel when drop zone is occupied
	dropZoneExitRadius:20, // Size of exit button
	dropZoneContentPadding:25,
	dropZoneContentHeight:.7, // percent of Artist Card Height
	dropZoneContentNameHeight:.20, // percent of Content Height
	dropZoneContentNameFont: {font: "Brandon_bld", size: 18, color: "black", weight: "bold", align: "left"},
	dropZoneContentBioHeight:.42, // percent of Content Height
	dropZoneContentBioFont: {font: "Athelas", size: 12, color: "#656464", weight: "normal", lineHeight: 20},
	dropZoneContentSongHeight:.38, // percent of Content Height
	dropZoneContentSongHeaderFont: {font: "Brandon_bld", size: 14, color: "black", weight: "bold", align: "left"},
	dropZoneContentSongFont: {font: "Brandon_light", size: 12, color: "#656464", weight: "normal", align: "left"},
	dropZoneContentSongHeaderHeight:.40, // percent of Song Content Height
	dropZoneContentSongHeaderYOffset:8,
	dropZoneContentSongLineHeight:.16, // percent of Song Content Height
	dropZoneContentPromptFont: {font: "Athelas", size: 36, color: "#656464", weight: "normal", align: "center"},
	dropZoneContentPromptTextPad:24, // Padding between each line of font of the prompt
	dropZoneButtonHeight:80, // percent of Artist Card Height
	dropZoneButtonFont: {font: "Brandon_bld", size: 18, color: "white", weight: "bold", align: "center"},
	dropZoneBackButtonFont: {font: "Brandon_med", size: 18, color: "#acabab", weight: "normal", align: "center"},
	dropZoneContentColor:"white",
	dropZoneUnoccupiedFont: {font: "Brandon_light", size: 30, color: "black", weight: "normal", align: "center"},
	// Assets
	purpleButton:undefined,
	greyButton:undefined,

	
	dropZoneArtist:"",
	// Vars for drag function
	//mouseIsDown:false,
	lastClick:undefined,
    artistsSentToSpire:0,
	
	// Functions
	ready:function(artists){
		// create decade circles
		inspireApp.selection.createDecadesUI(artists);
		inspireApp.selection.createArtistUI(artists);
		inspireApp.selection.createDropZones();
	},
	draw:function(){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_SELECTION){
			// draw selection screen
			ctx.save();
			this.drawText("SELECT A DECADE", canvas.width/2, canvas.height/2, this.uiFont.weight, this.uiFont.size, this.uiFont.color, this.uiFont.font, this.uiFont.align);
			ctx.restore();
			this.drawDropZones();
			this.drawDecadeCircles();
			this.drawArtistCircles();
			// update functions
			
			this.drag();
			
		}
	},
	createDecadesUI:function(artists){
		var radians = (2*Math.PI)/this.totalDecades; // findRads divides total radians in a circle by num of decades
		var startRad = 5*radians;
		
		for(var i = 0; i < this.totalDecades; i++){
			var decadeCircle = {};
			decadeCircle.x = this.decadesUIradius*Math.cos(startRad) + this.canvasCenterX;
			decadeCircle.y = this.decadesUIradius*Math.sin(startRad) + this.canvasCenterY;
			decadeCircle.radius = this.decadeCirclesRadius;
			decadeCircle.minRadius = this.decadeCirclesRadius;
			decadeCircle.maxRadius = this.decadeCirclesRadiusSelected;
			decadeCircle.radians = radians;
			decadeCircle.startRad = startRad;
			decadeCircle.image = this.decadeCircleImages[i];
			decadeCircle.year = String(artists.decade[i].year);
			decadeCircle.selected = false;
			decadeCircle.artists = [];
			this.decadeCircles.push(decadeCircle);
			startRad += radians;
			if(startRad > (2*Math.PI)) startRad = startRad - (2*Math.PI);
		}
	},
	drawDecadeCircles:function(){
		for(var i = 0; i < this.decadeCircles.length; i++){
			var circle = this.decadeCircles[i];
			if(circle.selected){ 
				circle.radius = this.animate(circle.radius, circle.maxRadius, true, this.decadeCircleAnimate);
			}
			if(!circle.selected){
				circle.radius = this.animate(circle.radius, circle.minRadius, false, this.decadeCircleAnimate);
			}
			// Circle
			ctx.drawImage(circle.image, circle.x - circle.radius, circle.y - circle.radius, circle.radius*2, circle.radius*2); 
		}
	},
	createArtistUI:function(artists){
		var imageIndex = 0; // increments artistImages array index
		for(var i = 0; i < this.decadeCircles.length; i++){
			var decadeCircle = this.decadeCircles[i];
			var radians = this.artistUIradians/this.totalArtists;
			// var startRad = decadeCircle.radians - 2*radians;
			var factor = 2;
			var startRad; // Starting radian will either be pi radians or 2pi radians
			var textStyle = {}
			if(decadeCircle.startRad > decadeCircle.radians && decadeCircle.startRad < 5*decadeCircle.radians){
				// Right side
				startRad = Math.PI - factor*radians;
				textStyle.align = "right";
				textStyle.padding = -1*this.artistCircleTextPadding;
			}else{
				// Left side
				startRad = 2*Math.PI - factor*radians;
				textStyle.align = "left";
				textStyle.padding = this.artistCircleTextPadding;		
			}			
			var radius = decadeCircle.maxRadius + this.artistUIradius;
			var x = decadeCircle.x;
			var y = decadeCircle.y;	
			
			for(var j = 0; j < this.totalArtists; j++){
				var artistCircle = {};

				artistCircle.x = radius*Math.cos(startRad) + x;
				artistCircle.y = radius*Math.sin(startRad) + y;
				artistCircle.radius = this.artistCirclesRadius;
				artistCircle.lastX = artistCircle.x;
				artistCircle.lastY = artistCircle.y;
				artistCircle.circleImage = this.artistCircleImages;
				artistCircle.info = artists.decade[i].artistsArray[j];
				artistCircle.images = this.artistImages[imageIndex];
				artistCircle.textStyle = textStyle;
				artistCircle.used = false;
				decadeCircle.artists.push(artistCircle);
				
				imageIndex++;
				startRad += radians;
			}
		}	
	},
	drawArtistCircles:function(){
		for(var i = 0; i < this.decadeCircles.length; i++){
			if(this.decadeCircles[i].selected){
				for(var j = 0; j < this.decadeCircles[i].artists.length; j++){
					var circle = this.decadeCircles[i].artists[j];
					var stroke = "black";
					ctx.save();
					if(circle.used) stroke="gray";
					ctx.drawImage(circle.circleImage, circle.x - circle.radius, circle.y - circle.radius, circle.radius*2, circle.radius*2);
					/*ctx.strokeStyle = stroke;
					ctx.beginPath();
					ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
					ctx.stroke();*/
					this.drawText(circle.info.name, circle.x + circle.textStyle.padding, circle.y, this.artistCircleFont.weight, this.artistCircleFont.size, this.artistCircleFont.color, this.artistCircleFont.font, circle.textStyle.align);
					ctx.restore();
				}					
			}
		}
	},
	createDropZones:function(){ // Create both drop zone objects {x, y, radius, occupied}
		var dropA = {x:this.dropZoneRadius + this.dropZonePadding};
		var dropB = {x:canvas.width - (this.dropZoneRadius+this.dropZonePadding)};
		this.dropZones.push(dropA, dropB);
		for(var i = 0; i < this.dropZones.length; i++){
			var drops = this.dropZones[i];
			drops.y = this.canvasCenterY;
			drops.radius = this.dropZoneRadius;
			drops.windowState = this.dropZoneStateSelect;
			drops.w = this.dropZoneDimensions.w;
			drops.h = this.dropZoneDimensions.h;
			drops.br = this.dropZoneBorderRad;
			drops.font = this.dropZoneUnoccupiedFont;
			drops.occupied = false;
			drops.artist = "";
			drops.content = {
				h: this.dropZoneContentHeight*drops.h, 
				backgroundColor: this.dropZoneContentColor, 
				padding: this.dropZoneContentPadding, 
				artistName: {h: this.dropZoneContentNameHeight*(this.dropZoneContentHeight*drops.h), font: this.dropZoneContentNameFont},
				artistBio: {
                    x: (drops.x - drops.w/2) + this.dropZoneContentPadding,
                    y: (drops.y - drops.h/2) + (drops.h - (this.dropZoneContentHeight*drops.h)) + this.dropZoneContentNameHeight*(this.dropZoneContentHeight*(drops.h)),
                    w: drops.w - (this.dropZoneContentPadding*2),
                    h: this.dropZoneContentBioHeight*(this.dropZoneContentHeight*drops.h),
					font: this.dropZoneContentBioFont
                },
				artistSong: {
					h: this.dropZoneContentSongHeight*(this.dropZoneContentHeight*drops.h),
					headerHeight: this.dropZoneContentSongHeaderHeight*(this.dropZoneContentSongHeight*(this.dropZoneContentHeight*drops.h)),
					lineHeight: this.dropZoneContentSongLineHeight*(this.dropZoneContentSongHeight*(this.dropZoneContentHeight*drops.h)),
					headerFont: this.dropZoneContentSongHeaderFont,
					font: this.dropZoneContentSongFont
				},
				prompt: {
					h: (this.dropZoneContentHeight*drops.h) - (this.dropZoneContentNameHeight*(this.dropZoneContentHeight*drops.h) + this.dropZoneButtonHeight),
					font: this.dropZoneContentPromptFont,
					textPadding: this.dropZoneContentPromptTextPad
				}
			};

			drops.button = [
				{	// Select / Confirm Button
					x: drops.x - drops.w/2,
					y: drops.y + drops.h/2,
					w: drops.w, 
					h: this.dropZoneButtonHeight,
					font: this.dropZoneButtonFont
				},
				{	// Go Back Button
					x: drops.x - drops.w/2,
					y: (drops.y + drops.h/2) - this.dropZoneButtonHeight,
					w: drops.w,
					h: this.dropZoneButtonHeight,
					font: this.dropZoneBackButtonFont
				}
			];
			
			// Buttons
			// Exit
			drops.exit = {x: drops.x, y: drops.y - (drops.h/2 + this.dropZoneExitPadding), radius: this.dropZoneExitRadius, enabled:false};
			// Artist Card Button
			
			// Artist Bio
			var bioFont = drops.content.artistBio.font;
			var bio = document.createElement("div");
			$(bio).offset({top: drops.content.artistBio.y, left: drops.content.artistBio.x});
			bio.style.width = drops.content.artistBio.w + "px";
			bio.style.height = drops.content.artistBio.h + "px";
			bio.style.fontFamily = bioFont.font;
			bio.style.fontSize = bioFont.size + "px";
			bio.style.color = bioFont.color;
			bio.style.lineHeight = bioFont.lineHeight + "px";
			$(bio).attr("id","div" + i)
			document.body.appendChild(bio);
		}
	},
	drawDropZones:function(){
	
		ctx.save();
		ctx.textBaseline = "middle";		
		for(var i = 0; i < this.dropZones.length; i++){
			var drops = this.dropZones[i];
			var bio = "#div"+i; // ID of each Artist Card Bio div
			if(drops.occupied){
				
				// ARTIST CARD		
				var topLeft = {x:drops.x - drops.w/2, y:drops.y - drops.h/2}; // Top left corner coords of artist card
				var overWidth = (drops.artistImage.width - drops.w)/2; // Centers image if width is larger than card
				var y = topLeft.y;
				  
				ctx.save();
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				
				// Artist Card Shape
				this.roundRect(topLeft.x, topLeft.y, drops.br, drops.w, drops.h + drops.button[0].h);
					// Store artist card properties
					this.dropZoneArtistCards[i] = {x: topLeft.x, y: topLeft.y, br: drops.br, w: drops.w, h: drops.h + drops.button[0].h};
				ctx.clip(); // crops artist card in the shape of roundRect
					
				// Artist Image
				ctx.drawImage(drops.artistImage,topLeft.x - overWidth,topLeft.y,drops.artistImage.width, drops.artistImage.height);
					// Store artist image properties
					this.dropZoneArtistImages[i] = {image: drops.artistImage, x: topLeft.x - overWidth, y: topLeft.y, w: drops.artistImage.width, h: drops.artistImage.height};
				
				// Content Section	
				if(drops.windowState == this.dropZoneStateSelect || drops.windowState == this.dropZoneStateConfirm){
					y += (drops.h - drops.content.h); // y = top of artist content
					// Background
					ctx.fillStyle = drops.content.backgroundColor;
					ctx.fillRect(topLeft.x, y, drops.w, drops.content.h);
					// Artist Name
					var nameFont = drops.content.artistName.font;
					this.drawText(drops.artist.name.toUpperCase(), topLeft.x + drops.content.padding, y + drops.content.artistName.h/2, nameFont.weight, nameFont.size, nameFont.color, nameFont.font, nameFont.align);
						
					y += drops.content.artistName.h; // y = top of artist bio content
					if(drops.windowState == this.dropZoneStateSelect){
                       
						// Artist Bio
						var text = drops.artist.bio[0];
						if($(bio).html() != text){
							$(bio).html(text);							
						}
						$(bio).css("visibility", "visible");
						
						y += drops.content.artistBio.h; // y = top of artist songs content
						// Artist Top Songs
						// Header
						var headerFont = drops.content.artistSong.headerFont;
						var songFont = drops.content.artistSong.font;
						this.drawText("POPULAR SONGS", topLeft.x + drops.content.padding, y + drops.content.artistSong.headerHeight/2 + this.dropZoneContentSongHeaderYOffset, headerFont.weight, headerFont.size, headerFont.color, headerFont.font, headerFont.align);
						// Songs
						var currentY = y + drops.content.artistSong.headerHeight; 
						for(var j = 0; j < drops.artist.songs.length; j++){
							this.drawText(drops.artist.songs[j], topLeft.x + drops.content.padding, currentY + drops.content.artistSong.lineHeight/2, songFont.weight, songFont.size, songFont.color, songFont.font, songFont.align);
							currentY += drops.content.artistSong.lineHeight;
						}
					}
					// Artist Card Prompt
					else{
						// Hide Artist Bio
						$(bio).css("visibility", "hidden");						
						// Prompt
						var promptFont = drops.content.prompt.font;
						this.drawText("Send this artist to", drops.x, y + drops.content.prompt.h/2 - drops.content.prompt.textPadding, promptFont.weight, promptFont.size, promptFont.color, promptFont.font, promptFont.align);
						this.drawText("The Spire?", drops.x, y + drops.content.prompt.h/2 + drops.content.prompt.textPadding, promptFont.weight, promptFont.size, promptFont.color, promptFont.font, promptFont.align);
						
						// Go Back Button
                        var b = drops.button[1];
				        this.drawText("GO BACK", drops.x, b.y + b.h/2, b.font.weight, b.font.size, b.font.color, b.font.font, b.font.align);					
					}		
				}
						
				// Button 
				var b = drops.button[0];
					// Store button properties
					this.dropZoneArtistButton[i] = {x: b.x, y: b.y, w: b.w, h: b.h, image: this.greyButton};
				if(drops.windowState == this.dropZoneStateSelect){
					// Purple Button
					ctx.drawImage(this.purpleButton, b.x, b.y);
					// Button Text Select
					this.drawText("SELECT THIS ARTIST", b.x + b.w/2, b.y + b.h/2, b.font.weight, b.font.size, b.font.color, b.font.font, b.font.align);	
				}
				else if(drops.windowState == this.dropZoneStateConfirm){
					// Purple Button
					ctx.drawImage(this.purpleButton, b.x, b.y);
					// Button Text Confirm
                    this.drawText("CONFIRM", b.x + b.w/2, b.y + b.h/2, b.font.weight, b.font.size, b.font.color, b.font.font, b.font.align);
					// Stores artist card name & properties
						this.dropZoneArtistNames[i] = {name: drops.artist.name, x: b.x + b.w/2, y: b.y + b.h/2, font: b.font};
				}
                else if(drops.windowState == this.dropZoneStateLocked){
					ctx.drawImage(this.greyButton, b.x, b.y);
					// Button Text Locked
                    this.drawText(drops.artist.name.toUpperCase(), b.x + b.w/2, b.y + b.h/2, b.font.weight, b.font.size, b.font.color, b.font.font, b.font.align);			
                }
				
				// Stroke the Artist Card
				ctx.stroke();
				ctx.restore();
				
				// Exit Button
                if(drops.exit.enabled){
                    ctx.beginPath();
                    ctx.arc(drops.exit.x, drops.exit.y, drops.exit.radius, 0, 2*Math.PI);
                    ctx.stroke();
                    this.drawText("X",drops.exit.x, drops.exit.y, "normal",  20, "black", "Arial", "center");
                }
			}
			if(!drops.occupied){
				// Hide Artist Bio
				$(bio).css("visibility", "hidden");
				// Draw Drop Circle
				this.drawText("DROP", drops.x, drops.y, drops.font.weight, drops.font.size, drops.font.color, drops.font.font, drops.font.align);
				ctx.beginPath();
				ctx.arc(drops.x, drops.y, drops.radius, 0, 2*Math.PI);
				ctx.stroke();
			}	
		}
		ctx.restore();
	},
	checkClicks:function(x,y){
		// decade circles
		for(var i = 0; i < this.totalDecades; i++){
			var decadeCircle = this.decadeCircles[i];
			if(this.pointInsideCircle(x, y, decadeCircle.x, decadeCircle.y, decadeCircle.radius)){
				// if clicked do ....
				if(decadeCircle.selected){
					decadeCircle.selected = false;
				}else{
					decadeCircle.selected = true;
				}
			}
		}
		// drop zones
		for(var j = 0; j < this.dropZones.length; j++){
			var drops = this.dropZones[j];
			// Exit Button
            if(drops.exit.enabled){
                if(this.pointInsideCircle(x, y, drops.exit.x, drops.exit.y, drops.exit.radius)){
                    inspireApp.selection.checkArtists(undefined, drops.artist);
                    drops.exit.enabled = false;
                    drops.occupied = false;
                    drops.artist = "";
                }
            }
			// Select & Confirm Button
			var b = drops.button[0];
			if(this.pointInsideRect(b.x, b.y, b.w, b.h, x, y)){
				if(drops.windowState == this.dropZoneStateSelect){
					drops.windowState = this.dropZoneStateConfirm;
				}else if(drops.windowState == this.dropZoneStateConfirm){
                    drops.exit.enabled = false;
					drops.windowState = this.dropZoneStateLocked;
                    this.artistsSentToSpire ++;
                    if(this.artistsSentToSpire == this.dropZones.length){
						// SEND ARTIST TO SPIRE CODE
						// store button images in object	
						var artistCards = {dimensions: this.dropZoneArtistCards, artistImages: this.dropZoneArtistImages, artistNames: this.dropZoneArtistNames, button: this.dropZoneArtistButton};
						console.log(artistCards);
						socketHandler.submit(artistCards.artistNames[0].name, artistCards.artistNames[1].name);
						inspireApp.connection.artistCards = artistCards;
						inspireApp.connection.screenState = inspireApp.connection.SCREEN_STATE_ROCK;
						// Change game state to Connection State
						inspireApp.main.changeGameState();
					}
				}
			}

            var b = drops.button[1];
            if(this.pointInsideRect(b.x, b.y, b.w, b.h, x, y)){
                drops.windowState = this.dropZoneStateSelect;
            }
		}
		
		this.lastClick = {x: x, y: y}; // keep track of coords where the mouse was last clicked
	},
	drag:function(){
			for(var i = 0; i < this.decadeCircles.length; i++){
				var decadeCircle = this.decadeCircles[i];
				if(decadeCircle.selected){
					for(var j = 0; j < decadeCircle.artists.length; j++){
						var artistCircle = decadeCircle.artists[j];
						if(!artistCircle.used){
							if(this.pointInsideCircle(this.lastClick.x, this.lastClick.y, artistCircle.lastX, artistCircle.lastY, artistCircle.radius)){
								for(var k = 0; k < inspireApp.main.len; k++){
									artistCircle.x = inspireApp.main.canX[k];
									artistCircle.y = inspireApp.main.canY[k];
									this.draggedArtists[k] = artistCircle;
									
								}
							}/*
							else if(!inspireApp.main.mouseIsDown){
								// Check to see if artist circle is in drop zone
								inspireApp.selection.checkDropZones(artistCircle);	
								// Else return to original location
								artistCircle.x = artistCircle.lastX;
								artistCircle.y = artistCircle.lastY;		
							}*/
						}
					}
				}
			}
	},
		checkDropZones:function(){
			//console.log(this.draggedArtists);
			for(var j = 0; j < this.draggedArtists.length; j++){
				var artist  = this.draggedArtists[j];
				
				for(var i = 0; i < this.dropZones.length; i++){
					var drops = this.dropZones[i];
					var bio = "#div"+i;
					if(drops.occupied){
						var leftBound = drops.x - drops.w/2;
						var rightBound = drops.x + drops.w/2;
						var topBound = drops.y - drops.h/2;
						var bottomBound = drops.y + drops.h/2;
						if(artist.x >= leftBound && artist.x <= rightBound && artist.y >= topBound && artist.y <= bottomBound){
							if(drops.windowState == this.dropZoneStateSelect || drops.windowState == this.dropZoneStateConfirm){
								inspireApp.selection.checkArtists(artist, drops.artist);
								drops.windowState = this.dropZoneStateSelect;
								drops.artist = artist.info;
								drops.artistImage = artist.images;
								$(bio).scrollTop(0);
							}
						}
					}
					else if(!drops.occupied){
					//console.log(artist);
						if(this.pointInsideCircle(artist.x, artist.y, drops.x, drops.y, drops.radius)){
							inspireApp.selection.checkArtists(artist);
							drops.windowState = this.dropZoneStateSelect;
							drops.occupied = true;
							drops.artist = artist.info;
							drops.artistImage = artist.images;
							drops.exit.enabled = true;
							$(bio).scrollTop(0);
						}
					}
				}
				this.returnArtist(artist);
			}
		},
		checkArtists:function(artist, lastArtist){
			for(var i = 0; i < this.decadeCircles.length; i++){
				for(var j = 0; j < this.decadeCircles[i].artists.length; j++){
					var a = this.decadeCircles[i].artists[j];
					if(artist){
						if(artist.info.name == a.info.name){
							a.used = true;
						}
					}
					if(lastArtist){
						if(lastArtist.name == a.info.name){
							a.used = false;
						}
					}
				}
			}
		},
	returnArtist:function(artist){
		for(var i = 0; i < this.decadeCircles.length; i++){
			for(var j = 0; j < this.decadeCircles[i].artists.length; j++){
				var a = this.decadeCircles[i].artists[j];
				if(artist.info.name == a.info.name){
					a.x = a.lastX;
					a.y = a.lastY;
				}
			}
		}
	},
	animate:function(ov, nv, grow, inc){
		if(grow){
			if(ov >= nv) return nv;
			ov += inc;
			return ov;
		}else{
			if(ov <= nv) return nv;
			ov -= inc;
			return ov;
		}
	},
	roundRect:function(x, y, radius, width, height){
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.closePath();
	},
	pointInsideCircle:function(aX, aY, bX, bY, radius){
		var dx = aX - bX;
		var dy = aY - bY;
		return dx * dx + dy * dy <= radius * radius;
	},
	pointInsideRect:function(aX, aY, w, h, bX, bY){
		var left, right, top, bottom;
		left = aX;
		right = aX + w;
		top = aY;
		bottom = aY + h;
		return bX > left && bX < right && bY > top && bY < bottom;
	},
	drawText:function(string, x, y, weight, size, color, font, align){
		ctx.textAlign = align;
		ctx.textBaseline = "middle";	
		ctx.font = weight + " " + size + "px " + font;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);	
	}
};