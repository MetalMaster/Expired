Controller = function(){
	
	this.components = {
		EXPIRATION_LIST:null,
		CATEGORIES_LIST:null,
		TAB_GROUP:null,
		ITEM_FORM:null,
		DATA_BINDER:null
	};
	
	this.events = {
		EXPIRATIONS_CHANGE:"expirations.change",
		CATEGORIES_CHANGE:"categories.change",
		EXPIRATION_EDIT:"expiration.edit",
		EXPIRATION_DELETE:"expiration.delete"
	};
	
	this.initComponents = function(Window){
		var DataBinder = require('ui/common/DataBinder');
		this.setDataBinder(new DataBinder());
		this.getDataBinder().initialize();
		
		var NewItem = require('ui/common/NewItem');
		this.setItemForm(new NewItem());
		
		var ExpirationList = require('ui/common/ExpirationList');
		this.setExpirationList(new ExpirationList());
		
		var CategoriesList = require('ui/common/CategoriesList');
		this.setCategoriesList(new CategoriesList());
		
		var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		this.setTabGroup(new ApplicationTabGroup(Window));
		
		this.initEvents();
	};
	
	this.initEvents = function(){
		var self = this;
		Ti.App.addEventListener(this.events.EXPIRATIONS_CHANGE,function(){
			self.components.EXPIRATION_LIST.reload();	
		});
		
		Ti.App.addEventListener(this.events.CATEGORIES_CHANGE,function(){
			self.components.CATEGORIES_LIST.reload();
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
	
	this.onCategoriesChange = function(payLoad){
		this.fireEvent(CONTROLLER.events.CATEGORIES_CHANGE);
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
	
	this.getCategoriesList = function(){
		return this.components.CATEGORIES_LIST;
	};
	
	this.setCategoriesList = function(categoriesList){
		this.components.CATEGORIES_LIST = categoriesList;
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
	
	this.toast = function(msg){
		var toast = Ti.UI.createNotification({
		    message:msg,
		    duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		toast.show();
	};
	
	this.alert = function(msg, title){
		var alert = Ti.UI.createAlertDialog({
		    message:msg,
		    title:title,
		    ok:'Ok'
		});
		alert.show();
	};
	
	this.showProgress = function(msg){
		this.progressIndicator = Ti.UI.Android.createProgressIndicator({
		  message: msg,
		  location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
		  type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
		  cancelable: false
		});
		
		this.progressIndicator.show();
	};
	
	this.hideProgress = function(){
		this.progressIndicator.hide();
	};
	
	this.parseDate = function(inputString){
		return new Date(inputString);
	};

	this.formatDate = function(_date){
		return _date.getDate() + "/" + (_date.getMonth()+1) + "/" + _date.getFullYear();
	};
	
	
};

module.exports = Controller;


