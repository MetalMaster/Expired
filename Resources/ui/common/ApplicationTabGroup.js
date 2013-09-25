
function ApplicationTabGroup(Window,expirationList) {
	//create module instance
	var self = Ti.UI.createTabGroup({title:"Expired"});
	
	//create app tabs
	var win1 = new Window(),
		win2 = new Window();
	
	
	win1.add(expirationList);
	expirationList.reload();
	
	var NewItem = require('ui/common/NewItem');
	win2.add(new NewItem());
	
	
	var tab1 = Ti.UI.createTab({
		title: L('expirationlist'),
		icon: '/images/icon_list.png',
		window: win1
	});
	win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: L('add'),
		icon: '/images/icon_add.png',
		window: win2
	});
	win2.containingTab = tab2;
	
	self.addTab(tab1);
	self.addTab(tab2);
	
	return self;
};

module.exports = ApplicationTabGroup;
