var app;
var $_userData = null;

function deviceReady() {

	PhoneGapEvents.init({
		monitorOrientationDelay : 500,
		monitorCompass : false
		//monitorCompassDelay : 50
	});
	
	PhoneGapEvents.onMenuButton = function() {
	}
	
	app = Ext.regApplication({
		name : "app",
		
	    launch: function() {
	    	this.views.viewport = new this.views.Viewport();
	    	console.log("launch");
	    }
	});
}

if( PhoneGap.available ) {
	document.addEventListener("deviceready", deviceReady, false);
} else {
	deviceReady();
}