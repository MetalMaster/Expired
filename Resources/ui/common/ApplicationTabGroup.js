
function ApplicationTabGroup(Window,expirationList) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	self.win1 = new Window(L('expirationlist'));
	self.win2 = new Window(L('add'));
	self.win3 = new Window(L('categories'));
	
	self.win1.add(CONTROLLER.getExpirationList());
	self.win2.add(CONTROLLER.getItemForm());
	self.win3.add(CONTROLLER.getCategoriesList());
	
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
	
	var tab3 = Ti.UI.createTab({
		title: L('categories'),
		icon: '/images/icon_categories.png',
		window: self.win3
	});
	self.win3.containingTab = tab3;
	
	tab3.addEventListener("click", function(){
		CONTROLLER.getItemForm().reloadCategories();
	});
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	
	return self;
};

module.exports = ApplicationTabGroup;
