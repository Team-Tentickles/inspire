"use strict"
var inspireApp = inspireApp || {};

inspireApp.selection ={
	totalDecades:6, // # of decades
	totalArtists:5, // # of artists per decade
	// Center coords of the canvas
	canvasCenterX:inspireApp.main.CANVAS_WIDTH/2,
	canvasCenterY:inspireApp.main.CANVAS_HEIGHT/2,
	// Center of decades ui
	decadesUIradius:250,
	// array of decadeCircle objects
	decadeCircles:[],
	decadeCirclesRadius:50,
	// artist circle vars
	artistCirclesRadius:12, // radius of artist circles
	artistUIradius:30, // distance from decadeCircles
	artistUIradians:(Math.PI)/2,
	
	dropZones:[],
	dropZoneRadius:150,
	dropZonePadding:40,
	dropZoneDimensions:{w:300, h:500},
	
	mouseIsDown:false,
	lastClick:undefined,
	
	// Functions
	ready:function(artists,width){
		// create decade circles
		inspireApp.selection.createDecadesUI(artists);
		inspireApp.selection.createArtistUI(artists);
		inspireApp.selection.createDropZones(width);
	},
	draw:function(mouse,mouseIsDown){
		var app = inspireApp.main;
		if(app.gameState == app.GAME_STATE_SELECTION){
			// draw selection screen
			this.drawText();
			this.drawDecadeCircles();
			this.drawArtistCircles();
			this.drawDropZones();
			// update functions
			this.drag(mouse, mouseIsDown);
		}
	},
	createDecadesUI:function(artists){
		var radians = (2*Math.PI)/this.totalDecades; // findRads divides total radians in a circle by num of decades
		var startRad = 5*radians;
		
		for(var i = 0; i < this.totalDecades; i++){
			var decadeCircle = {};
			// set decadeCircle x, y, and radius
			decadeCircle.x = this.decadesUIradius*Math.cos(startRad) + this.canvasCenterX;
			decadeCircle.y = this.decadesUIradius*Math.sin(startRad) + this.canvasCenterY;
			decadeCircle.radius = this.decadeCirclesRadius;
			decadeCircle.radians = startRad;
			decadeCircle.year = String(artists.decade[i].year);
			decadeCircle.selected = false;
			decadeCircle.artists = [];
			this.decadeCircles.push(decadeCircle);
			startRad += radians;
			if(startRad > (2*Math.PI)) startRad = startRad - (2*Math.PI);
		}
	},
	drawDecadeCircles:function(){
		for(var i = 0; i < this.totalDecades; i++){
			// Circle
			var circle = this.decadeCircles[i];
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle="black";
			ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
			ctx.stroke();
			// Text
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = "30px Arial";
			ctx.fillStyle = "black";
			ctx.fillText(circle.year, circle.x, circle.y);
			ctx.restore();
		}
	},
	createArtistUI:function(artists){
		for(var i = 0; i < this.totalDecades; i++){
			var decadeCircle = this.decadeCircles[i];
			var radians = this.artistUIradians/this.totalArtists;
			var startRad = decadeCircle.radians - 2*radians;
			var radius = decadeCircle.radius+ this.artistUIradius;
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
				decadeCircle.artists.push(artistCircle);
				startRad += radians;
			}
		}	
	},
	drawArtistCircles:function(){
		for(var i = 0; i < this.totalDecades; i++){
			if(this.decadeCircles[i].selected){
				for(var j = 0; j < this.totalArtists; j++){
					var circle = this.decadeCircles[i].artists[j];
					ctx.save();
					ctx.beginPath();
					ctx.strokeStyle="black";
					ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
					ctx.stroke();
				}					
			}
		}
	},
	createDropZones:function(width){ // Create both drop zone objects {x, y, radius, occupied}
		var dropA = {x:this.dropZoneRadius + this.dropZonePadding};
		var dropB = {x:width - (this.dropZoneRadius+this.dropZonePadding)};
		this.dropZones.push(dropA, dropB);
		for(var i = 0; i < this.dropZones.length; i++){
			var drops = this.dropZones[i];
			drops.y = this.canvasCenterY;
			drops.radius = this.dropZoneRadius;
			drops.w = this.dropZoneDimensions.w;
			drops.h = this.dropZoneDimensions.h;
			drops.occupied = false
			drops.artists = "";
		}
	},
	drawDropZones:function(){
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		for(var i = 0; i < this.dropZones.length; i++){
			var drops = this.dropZones[i];
			if(drops.occupied){
				ctx.fillText(drops.artist.name, drops.x, drops.y);
				ctx.rect(drops.x - drops.w/2, drops.y - drops.h/2, drops.w, drops.h);
			}
			else if(!drops.occupied){
				ctx.fillText("DROP", drops.x, drops.y);
				ctx.beginPath();
				ctx.arc(drops.x, drops.y, drops.radius, 0, 2*Math.PI);	
			}
			ctx.stroke();
		}
		ctx.restore();
	},
	checkClicks:function(mouse){
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
		this.lastClick = {x:mouse.x, y:mouse.y}; // keep track of coords where the mouse was last clicked
	},
	drag:function(mouse,mouseIsDown){	
			for(var i = 0; i < this.totalDecades; i++){
				if(this.decadeCircles[i].selected){
					for(var j = 0; j < this.totalArtists; j++){
						var artistCircle = this.decadeCircles[i].artists[j];
						if(this.pointInsideCircle(this.lastClick.x, this.lastClick.y, artistCircle.lastX, artistCircle.lastY, artistCircle.radius)){
							if(mouseIsDown){
								//console.log(artistCircle.info);
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
			var drops = this.dropZones;
			for(var i = 0; i < drops.length; i++){
				if(this.pointInsideCircle(artist.x, artist.y, drops[i].x, drops[i].y, drops[i].radius)){
					drops[i].occupied = true;
					drops[i].artist = artist.info;
					console.log(drops[i].artist);
				}
			} 
		},
	drawText:function(){
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("SELECT A DECADE", inspireApp.main.CANVAS_WIDTH/2, inspireApp.main.CANVAS_HEIGHT/2);
		ctx.restore();
	},
	pointInsideCircle:function(aX, aY, bX, bY, radius){
		var dx = aX - bX;
		var dy = aY - bY;
		return dx * dx + dy * dy <= radius * radius;
	}
};