
function ApplicationTabGroup(Window,expirationList) {
	//create module instance
	var self = Ti.UI.createTabGroup({title:"Expired"});
	
	self.win1 = new Window();
	self.win2 = new Window();
	
	self.win1.add(CONTROLLER.getExpirationList());
	self.win2.add(CONTROLLER.getItemForm());
	
	var tab1 = Ti.UI.createTab({
		title: L('expirationlist'),
		icon: '/images/icon_list.png',
		window: self.win1
	});
	self.win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: L('add'),
		icon: '/images/icon_add.png',
		window: self.win2
	});
	self.win2.containingTab = tab2;
	
	self.addTab(tab1);
	self.addTab(tab2);
	
	return self;
};

module.exports = ApplicationTabGroup;
