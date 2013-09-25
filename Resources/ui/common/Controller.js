Controller = function(){
	
	this.components = {
		EXPIRATION_LIST:null,
		TAB_GROUP:null,
		ITEM_FORM:null,
		DATA_BINDER:null
	};
	
	this.events = {
		EXPIRATIONS_CHANGE:"expirations.change",
		EXPIRATION_EDIT:"expiration.edit",
		EXPIRATION_DELETE:"expiration.delete"
	};
	
	this.initComponents = function(Window){
		var DataBinder = require('ui/common/DataBinder');
		this.setDataBinder(new DataBinder());
		
		var NewItem = require('ui/common/NewItem');
		this.setItemForm(new NewItem());
		
		var ExpirationList = require('ui/common/ExpirationList');
		this.setExpirationList(new ExpirationList());
		
		var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		this.setTabGroup(new ApplicationTabGroup(Window));
		
		this.initEvents();
	};
	
	this.initEvents = function(){
		var self = this;
		Ti.App.addEventListener(this.events.EXPIRATIONS_CHANGE,function(){
			self.components.EXPIRATION_LIST.reload();	
		});
		
		Ti.App.addEventListener(this.events.EXPIRATION_EDIT,function(e){
			self.components.TAB_GROUP.setActiveTab(1);
			var item = self.components.DATA_BINDER.getItem(e.itemId);
			self.components.ITEM_FORM.bindValues(item);
		});
		
		Ti.App.addEventListener(this.events.EXPIRATION_DELETE,function(e){
			self.components.DATA_BINDER.deleteExpiration(e.itemId);
			self.components.EXPIRATION_LIST.reload();
		});
	};
	
	this.fireEvent = function(event, payLoad){
		Ti.App.fireEvent(event, payLoad);
	};
	
	this.onExpirationsChange = function(payLoad){
		this.fireEvent(CONTROLLER.events.EXPIRATIONS_CHANGE, payLoad);
	};
	
	this.onExpirationEdit = function(payLoad){
		this.fireEvent(CONTROLLER.events.EXPIRATION_EDIT, payLoad);
	};
	
	this.onExpirationDelete = function(payLoad){
		this.fireEvent(CONTROLLER.events.EXPIRATION_DELETE, payLoad);
	};
	
	this.setExpirationList = function(expirationList){
		this.components.EXPIRATION_LIST = expirationList;
	};
	
	this.getExpirationList = function(){
		return this.components.EXPIRATION_LIST;
	};
	
	this.setTabGroup = function(tabGroup){
		this.components.TAB_GROUP = tabGroup;
	},
	
	this.getTabGroup = function(){
		return this.components.TAB_GROUP;
	};
	
	this.setItemForm = function(itemForm){
		this.components.ITEM_FORM = itemForm;
	};
	
	this.getItemForm = function(){
		return this.components.ITEM_FORM;
	};
	
	this.setDataBinder = function(dataBinder){
		this.components.DATA_BINDER = dataBinder;
	};
	
	this.getDataBinder = function(){
		return this.components.DATA_BINDER;
	};
	
	
	
};

module.exports = Controller;


