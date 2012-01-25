function UserDataPlugin() {
}

UserDataPlugin.prototype.getUserData = function(win, fail) {
	return PhoneGap.exec(win, fail, "UserDataPlugin", "getUserData", [ ]);
};

PhoneGap.addConstructor(function() {
	PhoneGap.addPlugin("UserDataPlugin", new UserDataPlugin());
});