app.views.Viewport = Ext.extend(Ext.Panel, {
	fullscreen : true,
	layout : "card",
	id : "viewport",
	cardSwitchAnimation : "slide",
	
//	consider putting this back in if we find another way to correct
//	background ghosting issues
//	style : {
//		background : "transparent"
//	},
	
	initComponent : function(arguments) {
		Ext.apply(app.views, {
			_main : new app.views.Main()
		});
		Ext.apply(this, {
			items : [
			     app.views._main
			]
		});
		
		app.views.Viewport.superclass.initComponent.apply(this, arguments);
	}
});