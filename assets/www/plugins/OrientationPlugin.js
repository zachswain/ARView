function OrientationPlugin() {
}

OrientationPlugin.prototype.getOrientation = function(win, fail, options) {
	return PhoneGap.exec(win, fail, "OrientationPlugin", "getOrientation", [ options ]);
};

PhoneGap.addConstructor(function() {
	PhoneGap.addPlugin("OrientationPlugin", new OrientationPlugin());
});