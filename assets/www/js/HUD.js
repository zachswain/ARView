HUD = {
	canvasId : null,
	canvas : null,
	ctx : null,
	containerId : null,
	poisets : [],
	pois : [],
	width : 100,
	height : 100,
	radius : 50,
	scale : 1,
	cx : 50,
	cy : 50,
	r : 20,
	g : 128,
	b : 20,
	alpha : 1,
	hudCoverage : 10, // miles
	borderWidth : 2,
	redrawIntervalId : null,
	redrawInterval : 50,
	viewAngle : 45.0,
	pxPerDeg : 0,
	maxSets : 10,
	overlayOffset : 0,
	
	init : function(options) {
		if( options ) {
			if( options.canvasId ) {
				this.canvasId = options.canvasId;
			}
			if( options.containerId ) {
				this.containerId = options.containerId;
			}
			if( options.radius ) {
				this.scale = options.radius / this.radius;
			}
		}
		
		this.pxPerDeg = Ext.get("mainOverlay").getWidth() / this.viewAngle;
		
		var width = Math.ceil(this.pxPerDeg * 360 + 2 * Ext.get("mainOverlay").getWidth());
		var height = Ext.get("mainOverlay").getHeight();
		this.overlayOffset = Ext.get("mainOverlay").getWidth();
		Ext.get("overlay").setWidth(width);
		Ext.get("overlay").setHeight(height);

		this.canvas = document.getElementById(this.canvasId);
		this.canvas.setAttribute("width", Math.ceil(this.width * this.scale) * 2);
		this.canvas.setAttribute("height", Math.ceil(this.height * this.scale) * 2);
		
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(this.scale, this.scale);
		
		this.redraw();
		
		var self = this;
		this.redrawIntervalId = setInterval(function() {
			self.redraw();
		}, this.redrawInterval);
		
		return this;
	},
	
	onOrientationChange : function() {
		var heading = Math.floor(PhoneGapEvents.getOrientation().x);
		var x = Math.floor(
				-heading * this.pxPerDeg + 
				Ext.get("mainOverlay").getWidth() / 2
			) - this.overlayOffset;
		Ext.get("overlay").setXY([x, 20]);
		//console.log("overlay x = " + x);
	},
	
	onLocationChange : function() {
		//console.log("HUD.js: Location changing, updating all POIs");
		
		for( var index = 0 ; index < this.pois.length ; index++ ) {
			this._updatePOIPopup(this.pois[index]);
		}
	},
	
	redraw : function() {
		//var time = new Date().getTime();
		this.draw();
		//console.log("redraw took " + (new Date().getTime() - time) + "ms");
	},
	
	draw : function() {
		this.drawHUD();
	},
	
	drawHUD : function() {
		if( typeof this.ctx == undefined || !this.ctx ) return;
		
		this.clear();
		
		this.ctx.save();
		
		// fill HUD
		this.ctx.beginPath();
		this.ctx.arc(this.cx, this.cy, this.radius - 2, 0, Math.PI*2, true);
		this.ctx.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
		this.ctx.closePath();
		this.ctx.fill();+
		
		// draw view
		this.ctx.beginPath();
		this.ctx.moveTo(this.cx, this.cy);
		this.ctx.arc(this.cx, this.cy, this.radius - 2, - Math.PI / 2 + (this.viewAngle / 2) * Math.PI / 180, -Math.PI / 2 - this.viewAngle / 2 * Math.PI / 180, true);
		this.ctx.closePath();
		this.ctx.fillStyle = "rgba(255,255,255,.5)";
		this.ctx.fill();
		
		// outline HUD
		this.ctx.beginPath();
		this.ctx.arc(this.cx, this.cy, this.radius - this.borderWidth, 0, Math.PI*2, true);
		this.ctx.strokeStyle = "#000000"; //"rgba(0,0,0,1)"
		this.ctx.lineWidth = this.borderWidth;
		this.ctx.closePath();
		this.ctx.stroke();
		
		// draw POIs
		for( var index = 0 ; index < this.pois.length ; index++ ) {			
			this._drawPOI(this.pois[index], 2);
			//this._updatePOIPopup(this.pois[index]);
		}
		
		// draw enabled POI sets
		for( var index =0 ; index < this.poisets.length ; index++ ) {
			for( var index2=0 ; index2 < this.poisets[index].pois.length ; index2++ ) {
				this._drawPOI(this.poisets[index].pois[index2], 2);
				//this._updatePOIPopup(this.poisets[index].pois[index2]);
			}
		}
		this.ctx.restore();
		
		return this;
	},
	
	clear : function() {
		this.ctx.clearRect(0,0,this.width, this.height);
	},
	
	addPOISet : function(set) {
		for( var index=0 ; index<set.pois.length ; index++ ) {
			this._initPOI(set.pois[index], {
				cls : "poi-set-" + this.poisets.length
			});
			this._updatePOIPopup(set.pois[index]);
			this.pois.push(set.pois[index]);
		}
		
        var btn = new Ext.Button({
        	cls : "poi-set-0-btn"
        });
        
        //btn.addCls("disabled");
        btn.setBadge(set.pois.length);
        
        var toolbar = Ext.getCmp("toolbar");
        toolbar.add(btn);
        toolbar.doLayout();
		
		this.poisets.push(set);
	},
	
	addPOI : function(poi) {
		this._initPOI(poi, {
			cls : "poi-set-generic"
		});
		this._updatePOIPopup(poi);
		this.pois.push(poi);
	},
	
	_initPOI : function(poi, options) {
		poi.div = document.createElement("div");
		poi.div.className = "poiPopup";
		
		var el = new Ext.Element(poi.div);
		//el.addCls("easeOut");
		
		if( typeof options != undefined ) {
			if( typeof options.cls != undefined ) {
				el.addCls(options.cls);
			}
		}
		
		var label = document.createElement("div");
		label.className = "label";
		label.innerHTML = poi.label;
		el.appendChild(label);
		
		el.dom.addEventListener("click", function() {
			alert("foo");
		}, false);
		
//		Ext.get(this.containerId).appendChild(el.dom);
		Ext.get("overlay").appendChild(el.dom);
		
		var x = Math.floor((Ext.get("mainOverlay").getWidth() - el.getWidth()) / 2); 
		var y = Ext.get("main").getHeight();
		
		el.setTop(y);
		el.setLeft(x);
	},	
	
	_drawPOI : function(poi, pointRadius) {
		// If we don't have a current location, just return
		if( null==PhoneGapEvents.getLocation() ) return;
		
		var deviceOrientationAdjustment = 0;
		if( window.orientation ) deviceOrientationAdjustment = window.orientation;
		
		var heading;
		if( null==PhoneGapEvents.getOrientation() ) {
			heading = 0;
		} else {
			heading = PhoneGapEvents.getOrientation().x;
		}
		
		// Make sure we have a point radius to draw
		if( !pointRadius ) pointRadius = 5;
		
		// Do some distance/bearing calculations
		var currentPosition = PhoneGapEvents.getLocation();
		var lat1 = new LatLon(currentPosition.coords.latitude, currentPosition.coords.longitude);
		var lat2 = new LatLon(poi.latitude, poi.longitude);
		
		// Calculate the distance between us and the poi
		var relativeDistance = lat1.distanceTo(lat2);
		
		// Convert it to miles
		relativeDistance = _KMtoMI(relativeDistance);
		
		// Check if it's larger than the HUD's coverage; if so, set it to the 
		// max coverage - the size of the point so it's inside the HUD
		if( relativeDistance > this.hudCoverage ) relativeDistance = this.hudCoverage;
		
		// Convert to distance on the screen
		var hudDistance = Math.floor((relativeDistance / this.hudCoverage) * (this.radius - this.borderWidth - (pointRadius / 2)) );
		
		// Calculate the bearing between us and the poi
		var relativeBearing = lat1.bearingTo(lat2);
		
		// Adjust for the device bearing
		relativeBearing -= heading - deviceOrientationAdjustment; 
			
		if( relativeBearing < 0 ) relativeBearing += 360;
		
		//console.log("drawing " + poi.label + " at " + hudDistance + " pixels at " + relativeBearing + " degrees");
		
		// Start drawing
		this.ctx.save();		
		
		this.ctx.translate(this.cx, this.cy);
		this.ctx.rotate(Math.PI / 180 * (relativeBearing - 180)); //this.targetBearing
		this.ctx.beginPath();
		this.ctx.arc(0, hudDistance, pointRadius, 0, 2*Math.PI, false);
		this.ctx.fillStyle = "#ffffff";
		this.ctx.closePath();
		this.ctx.fill();
		
		this.ctx.restore();
	},
	
	_updatePOIPopup : function(poi) {
		// Check if we have a geolocation yet
		if( PhoneGapEvents.getLocation()==null ) {
			//console.log("HUD.js: No geolocation, returning.");
			return;
		}
		
		//console.log("HUD.js: Updating poi");
		
		// Determine our adjustment for the device's orientation
		var deviceOrientationAdjustment = 0;
		if( window.orientation ) deviceOrientationAdjustment = window.orientation;
		
		var heading;
		if( null==PhoneGapEvents.getOrientation() ) {
			heading = 0;
		} else {
			heading = PhoneGapEvents.getOrientation().x;
		}
		
		// Do some distance/bearing calculations
		var currentPosition = PhoneGapEvents.getLocation();
		var lat1 = new LatLon(currentPosition.coords.latitude, currentPosition.coords.longitude);
		var lat2 = new LatLon(poi.latitude, poi.longitude);
		
		var relativeBearing = lat1.bearingTo(lat2);
		
		// Adjust for the device bearing
//		relativeBearing -= heading; 
//			
		if( relativeBearing < 0 ) relativeBearing += 360;
		
//		var x = (
//				Ext.get("mainOverlay").getWidth() / 2) // center 
//			+	(normalize180(0, relativeBearing - deviceOrientationAdjustment) / (this.viewAngle/2)) // half the relative angle 
//			* (Ext.get("mainOverlay").getWidth() / 2); // screen width multiplier
		var x = Math.floor(
				relativeBearing * this.pxPerDeg + 
				//Ext.get("mainOverlay").getWidth() / 2 +
				this.overlayOffset
				);
		var y = Math.floor(Ext.get("mainOverlay").getHeight() / 2);
		
		//console.log(poi.label + " set to (" + x + "," + y + ") for rb=" + relativeBearing);
		
		// Draw the poi div on the viewscreen
		var el = Ext.get(poi.div);
		//el.setXY([x,y]);
		el.setTop(y);
		el.setLeft(x);
	}
}