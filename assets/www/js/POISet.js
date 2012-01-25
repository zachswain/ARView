function POISet(options) {
	this.pois = [];
	this.label = "";
	this.hudDotColor = "#ffffff";
	this.hudIconColor = "#ffffff";
	this.enabled = false;
	
	this.init(options);
	
	return this;
}

POISet.prototype.init = function(options) {
	if( options ) {
		if( options.label ) {
			this.label = options.label;
		}
	}
}

POISet.prototype.clear = function() {
	this.pois = [];
}

POISet.prototype.addPOI = function(poi) {
	this.pois.push(poi);
}