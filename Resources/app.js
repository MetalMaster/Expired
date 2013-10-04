//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

//This controller knows everything
var CONTROLLER = null;

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	}
	else {
		Window = require('ui/handheld/ApplicationWindow');
	}

	var Controller = require('ui/common/Controller');
	CONTROLLER = new Controller();
	CONTROLLER.initComponents(Window);

	var actionBar;

	//General menu item
	CONTROLLER.getTabGroup().addEventListener("open", function() {
	    if (Ti.Platform.osname === "android") {
	        if (! CONTROLLER.getTabGroup().activity) {
	            Ti.API.error("Can't access action bar on a lightweight window.");
	        } else {
	           var activity = CONTROLLER.getTabGroup().getActivity();
			    activity.onCreateOptionsMenu = function(e) {
			        var menuItem = e.menu.add({
			            title : L('abouttitle'),
			            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			            icon : "/images/icon_about.png" 
			        });
			        menuItem.addEventListener("click", function(e) {
			            CONTROLLER.alert(L('aboutcontent'), L('abouttitle'));
			        });
			    };
			    activity.invalidateOptionsMenu();
	        }
	    }
	});

	//Opens tabgroup
	CONTROLLER.getTabGroup().open();
	
	//Reload expirations
	CONTROLLER.onExpirationsChange();

	
})();
