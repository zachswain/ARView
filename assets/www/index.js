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
	    },
	    
	    mask: function(message) {
	    	if( this.loadingMask ) {
	    		console.log("Loading mask already exists");
	    		return;
	    	}
	    	if( !message ) message = "Loading...";
	    	this.loadingMask = new Ext.LoadMask(Ext.getBody(), {
                msg: message
            });
	    	this.loadingMask.show();
	    },
	    
	    unmask : function() {
	    	if( this.loadingMask ) this.loadingMask.hide();
	    	this.loadingMask = null;
	    }
	});
}

if( PhoneGap.available ) {
	document.addEventListener("deviceready", deviceReady, false);
} else {
	deviceReady();
}