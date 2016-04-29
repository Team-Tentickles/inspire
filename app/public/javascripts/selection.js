"use strict"
var inspireApp = inspireApp || {};

inspireApp.selection ={
	totalDecades:6, // # of decades
	totalArtists:5, // # of artists per decade
	// Center coords of the canvas
	canvasCenterX:inspireApp.main.CANVAS_WIDTH/2,
	canvasCenterY:inspireApp.main.CANVAS_HEIGHT/2,
	// Center of decades ui
	decadesUIradius:220,
	// array of decadeCircle objects
	decadeCircles:[],
	decadeCircleAnimate:4,
	decadeCirclesRadius:45,
	decadeCirclesRadiusSelected:70,
	// artist circle vars
	artistCirclesRadius:8, // radius of artist circles
	artistCircleTextPadding:18,
	artistUIradius:20, // distance from decadeCircles
	artistUIradians:(Math.PI)/1.8,
	artistImages:undefined, // Array of preloaded & resized artist images
	// Drag and Drop Circles
	dropZones:[],
	dropZoneRadius:150,
	dropZonePadding:70, // padding between drop zones and edge of viewport
	dropZoneBorderRad:20, // Border radius of rectange when occupied with artist
	// Artist Panel Vars
	dropZoneStateSelect:0,
	dropZoneStateConfirm:1,
	dropZoneStateLocked:2,
	dropZoneDimensions:{w:350, h:500},
	dropZoneExitPadding:50, // Exit button padding from artist pannel when drop zone is occupied
	dropZoneExitRadius:20, // Size of exit button
	dropZoneContentPadding:15,
	dropZoneContentHeight:.55, // percent of Artist Card Height
	dropZoneContentNameHeight:.25, // percent of Content Height 
	dropZoneContentBioHeight:.40, // percent of Content Height
	dropZoneContentSongHeight:.35, // percent of Content Height
	dropZoneContentSongHeaderHeight:.3, // percent of Song Content Height
	dropZoneContentSongLineHeight:.18, // percent of Song Content Height
	dropZoneButtonHeight:.15, // percent of Artist Card Height
	dropZoneButtonColor:"black",
	dropZoneContentColor:"white",
	dropZoneContentFontSizeL:24,
	dropZoneContentFontSizeM:18,
	dropZoneContentFontSizeS:14,
	dropZoneContentFontBodySize:12,
	
	dropZoneArtist:"",
	// Vars for drag function
	mouseIsDown:false,
	lastClick:undefined,
    artistsSentToSpire:0,
	
	// Functions
	ready:function(artists){
		// create decade circles
		inspireApp.selection.createDecadesUI(artists);
		inspireApp.selection.createArtistUI(artists);
		inspireApp.selection.createDropZones();
	},
	draw:function(mouse,mouseIsDown){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_SELECTION){
			// draw selection screen
			ctx.save();
			this.drawText("SELECT A DECADE", canvas.width/2, canvas.height/2, 30, "black", "Arial", "center");
			ctx.restore();
			this.drawDropZones();
			this.drawDecadeCircles();
			this.drawArtistCircles();
			// update functions
			this.drag(mouse, mouseIsDown);
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
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle="black";
			ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
			ctx.stroke();
			// Text
			this.drawText(circle.year, circle.x, circle.y, 30, "black", "Arial", "center");
			ctx.restore();
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
					ctx.strokeStyle = stroke;
					ctx.beginPath();
					ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
					ctx.stroke();
					this.drawText(circle.info.name, circle.x + circle.textStyle.padding, circle.y, 16, stroke, "Arial", circle.textStyle.align);
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
			drops.occupied = false;
			drops.artist = "";
			drops.content = {
				h: this.dropZoneContentHeight*drops.h, 
				backgroundColor: this.dropZoneContentColor, 
				padding: this.dropZoneContentPadding, 
				artistName: {h: this.dropZoneContentNameHeight*(this.dropZoneContentHeight*drops.h)},
				artistBio: {h: this.dropZoneContentBioHeight*(this.dropZoneContentHeight*drops.h)},
				artistSong: {
					h: this.dropZoneContentSongHeight*(this.dropZoneContentHeight*drops.h),
					headerHeight: this.dropZoneContentSongHeaderHeight*(this.dropZoneContentSongHeight*(this.dropZoneContentHeight*drops.h)),
					lineHeight: this.dropZoneContentSongLineHeight*(this.dropZoneContentSongHeight*(this.dropZoneContentHeight*drops.h))
				},
				prompt: {
					h: (this.dropZoneContentHeight*drops.h) - (this.dropZoneButtonHeight*drops.h) - (this.dropZoneContentNameHeight*(this.dropZoneContentHeight*drops.h))
				}
			};

			drops.button = [
			{	// Select / Confirm Button
				x: drops.x - drops.w/2,
				y: (drops.y - drops.h/2) + (drops.h - this.dropZoneButtonHeight*drops.h),
				w: drops.w, 
				h: this.dropZoneButtonHeight*drops.h, 
				color: this.dropZoneButtonColor
			},
			{	// Go Back Button
				x: drops.x - drops.w/2,
				y: (drops.y+drops.h/2) - (this.dropZoneButtonHeight*drops.h*2),
				w: drops.w,
				h: this.dropZoneButtonHeight*drops.h
			}
			];
			
			drops.exit = {x: drops.x, y: drops.y - (drops.h/2 + this.dropZoneExitPadding), radius: this.dropZoneExitRadius, enabled:false};
		}
	},
	drawDropZones:function(){
	
		ctx.save();
		ctx.textBaseline = "middle";		
		for(var i = 0; i < this.dropZones.length; i++){
			var drops = this.dropZones[i];
			
			if(drops.occupied){
				
				// ARTIST CARD
				
				var topLeft = {x:drops.x - drops.w/2, y:drops.y - drops.h/2}; // Top left corner coords of artist card
				var overWidth = (drops.artistImage.width - drops.w)/2; // Centers image if width is larger than card
				var y = topLeft.y;
				
				ctx.save();
				//ctx.strokeStyle = 'rgba(0,0,0,0)';
				
				this.roundRect(topLeft.x, topLeft.y, drops.br, drops.w, drops.h);	
				ctx.clip(); // crops artist card in the shape of roundRect
				
				// Artist Image
				ctx.drawImage(drops.artistImage,topLeft.x - overWidth,topLeft.y,drops.artistImage.width, drops.artistImage.height);	
				
				// Content Section	
				if(drops.windowState == this.dropZoneStateSelect || drops.windowState == this.dropZoneStateConfirm){
					y += (drops.h - (drops.content.h + drops.button[0].h)); // y = top of artist content
					// Background
					ctx.fillStyle = drops.content.backgroundColor;
					ctx.fillRect(topLeft.x, y, drops.w, drops.content.h);
					// Artist Name
					this.drawText(drops.artist.name, topLeft.x + drops.content.padding, y + drops.content.artistName.h/2, this.dropZoneContentFontSizeM, "black", "Arial", "left");
					// Artist Bio
					y += drops.content.artistName.h; // y = top of artist bio content
					if(drops.windowState == this.dropZoneStateSelect){
						// Artist Bio Content Code 
						//..
						//..
						y += drops.content.artistBio.h; // y = top of artist songs content
						// Artist Top Songs
						// Header
						this.drawText("Popular Songs", topLeft.x + drops.content.padding, y + drops.content.artistSong.headerHeight/2, this.dropZoneContentFontSizeS, "black", "Arial", "left");
						// Songs
						var currentY = y + drops.content.artistSong.headerHeight; 
						for(var j = 0; j < drops.artist.songs.length; j++){
							this.drawText(drops.artist.songs[j], topLeft.x + drops.content.padding, currentY + drops.content.artistSong.lineHeight/2, this.dropZoneContentFontBodySize, "black", "Arial", "left");
							currentY += drops.content.artistSong.lineHeight;
						}
						//y += drops.content.artistSong.h; // y = top of button
					}
					// Artist Card Prompt
					else{
						// Prompt
						this.drawText("Send this artist to The Spire?", drops.x, y + drops.content.prompt.h/2, this.dropZoneContentFontSizeL, "black", "Arial", "center");
						
						// Go Back Button
						y += drops.content.prompt.h; // y = top of back button
                        var b = drops.button[1];
				        this.drawText("Go Back", drops.x, y + b.h/2, this.dropZoneContentFontSizeM, "gray", "Arial", "center");
					}		
				}
				
				
				
				
				// Button 
				var b = drops.button[0];
				ctx.fillStyle = b.color;
				ctx.fillRect(b.x, b.y, b.w, b.h);	
				if(drops.windowState == this.dropZoneStateSelect){
					// Button Text Select
					this.drawText("Select This Artist", b.x + b.w/2, b.y + b.h/2, this.dropZoneContentFontSizeM, "white", "Arial", "center");
				}
				else if(drops.windowState == this.dropZoneStateConfirm){
					// Button Text Confirm
                    this.drawText("Confirm", b.x + b.w/2, b.y + b.h/2, this.dropZoneContentFontSizeM, "white", "Arial", "center");
				}
                else if(drops.windowState == this.dropZoneStateLocked){
					// Button Text Locked
                    this.drawText(drops.artist.name, b.x + b.w/2, b.y + b.h/2, this.dropZoneContentFontSizeM, "white", "Arial", "center");
                }
				
				// Stroke the Artist Card
				ctx.stroke();
				ctx.restore();
				
				// Exit Button
                if(drops.exit.enabled){
                    ctx.beginPath();
                    ctx.arc(drops.exit.x, drops.exit.y, drops.exit.radius, 0, 2*Math.PI);
                    ctx.stroke();
                    this.drawText("X",drops.exit.x, drops.exit.y, 20, "black", "Arial", "center");
                }
			}
			if(!drops.occupied){
				this.drawText("DROP", drops.x, drops.y, 30, "black", "Arial", "center");
				ctx.beginPath();
				ctx.arc(drops.x, drops.y, drops.radius, 0, 2*Math.PI);
				ctx.stroke();
			}	
		}
		ctx.restore();
	},
	checkClicks:function(mouse){
		// decade circles
		for(var i = 0; i < this.totalDecades; i++){
			var decadeCircle = this.decadeCircles[i];
			if(this.pointInsideCircle(mouse.x, mouse.y, decadeCircle.x, decadeCircle.y, decadeCircle.radius)){
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
                if(this.pointInsideCircle(mouse.x, mouse.y, drops.exit.x, drops.exit.y, drops.exit.radius)){
                    inspireApp.selection.checkArtists(undefined, drops.artist);
                    drops.exit.enabled = false;
                    drops.occupied = false;
                    drops.artist = "";
                }
            }
			// Select & Confirm Button
			var b = drops.button[0];
			if(this.pointInsideRect(b.x, b.y, b.w, b.h, mouse.x, mouse.y)){
				if(drops.windowState == this.dropZoneStateSelect){
					drops.windowState = this.dropZoneStateConfirm;
				}else if(drops.windowState == this.dropZoneStateConfirm){
                    drops.exit.enabled = false;
					drops.windowState = this.dropZoneStateLocked;
                    this.artistsSentToSpire ++;
                    if(this.artistsSentToSpire == 2) inspireApp.main.changeGameState();
					// SEND ARTIST TO SPIRE CODE		
				}
			}

            var b = drops.button[1];
            if(this.pointInsideRect(b.x, b.y, b.w, b.h, mouse.x, mouse.y)){
                console.log("true")
                drops.windowState = this.dropZoneStateSelect;
            }
		}
		
		this.lastClick = {x:mouse.x, y:mouse.y}; // keep track of coords where the mouse was last clicked
	},
	drag:function(mouse,mouseIsDown){	
			for(var i = 0; i < this.decadeCircles.length; i++){
				var decadeCircle = this.decadeCircles[i];
				if(decadeCircle.selected){
					for(var j = 0; j < decadeCircle.artists.length; j++){
						var artistCircle = decadeCircle.artists[j];
						if(!artistCircle.used){
							if(this.pointInsideCircle(this.lastClick.x, this.lastClick.y, artistCircle.lastX, artistCircle.lastY, artistCircle.radius) && mouseIsDown){
								artistCircle.x = mouse.x;
								artistCircle.y = mouse.y;	
							}
							else if(!mouseIsDown){
								// Check to see if artist circle is in drop zone
								inspireApp.selection.checkDropZones(artistCircle);	
								// Else return to original location
								artistCircle.x = artistCircle.lastX;
								artistCircle.y = artistCircle.lastY;		
							}
						}
					}
				}
			}
	},
		checkDropZones:function(artist){
			for(var i = 0; i < this.dropZones.length; i++){
				var drops = this.dropZones[i];
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
						}
					}
				}
				else if(!drops.occupied){
					if(this.pointInsideCircle(artist.x, artist.y, drops.x, drops.y, drops.radius)){
						inspireApp.selection.checkArtists(artist);
						drops.windowState = this.dropZoneStateSelect;
						drops.occupied = true;
						drops.artist = artist.info;
						drops.artistImage = artist.images;
                        drops.exit.enabled = true;
					}
				}
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
		//ctx.stroke();
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
	drawText:function(string, x, y, size, color, font, align){
		
		ctx.textAlign = align;
		ctx.textBaseline = "middle";	
		ctx.font = size+'px '+font;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		
	}
};