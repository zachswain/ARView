app.views.MainOverlayPanel = Ext.extend(Ext.Panel, {
	xtype : "container",
	id : "mainOverlay",
	flex : 16,
	style : {
		background : "transparent"
	},
	html : "<canvas id='hud'></canvas><div id='overlay'></div>",
	styleHtmlContent : false,
	
	listeners : {
		afterlayout : function() {			
			HUD.init({
				canvasId : "hud",
				containerId : "mainOverlay",
				radius : Math.floor(Ext.get("mainOverlay").getWidth() * .10)
			});
			
			PhoneGapEvents.onOrientationChange(function() {
				HUD.onOrientationChange();
			});
			
			PhoneGapEvents.onGeolocationChange(function() {
				HUD.onLocationChange();
			});
			
			Ext.get("hud").setXY([10, 30]);
			
//			PhoneGapEvents.onOrientationChange(function() {
//				HUD.redraw();
//			});
			
			console.log("calling userdataplugin");
	    	window.plugins.UserDataPlugin.getUserData(function(result) {
	    		if( result ) {
	    			if( result.data ) {				
	    				$_userData = result.data;
	    				console.log("userData: " + JSON.stringify($_userData));
	    				if( typeof $_userData != undefined ) {
	    					if( $_userData[0] ) {
	    						var pois = $_userData[0];
	    						var set = new POISet();
	    						for( var index=0 ; index<pois.length ; index++ ) {
	    							var poi = pois[index];
	    							set.addPOI(poi);
	    							//HUD.addPOI(poi);
	    						}
	    						HUD.addPOISet(set);
	    					}
	    				}
	    			}
	    		}
	    	}, function(error) {
	    		console.log("Error reading user data: " + error);
	    	});
			
			var set = new POISet({ label : "haymarket" });
			
			var poi = new POI({
				label : "PB Smith Elem.",
				latitude : 38.736730451,
				longitude : -77.76138851
			});
			set.addPOI(poi);
			
			var poi = new POI({
				label : "American Red Cross",
				latitude : 38.711566508,
				longitude : -77.7947386603
			});
			set.addPOI(poi);
			
			var poi = new POI({
				label : "Amerisist of Warrenton",
				latitude : 38.7190873669,
				longitude : -77.7902348287
			});
			set.addPOI(poi);
			
			HUD.addPOISet(set);
		}
	},

	initComponent : function() {		
		app.views.MainOverlayPanel.superclass.initComponent.apply(this, arguments);
	}
});