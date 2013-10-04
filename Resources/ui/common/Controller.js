/**
 * Manage events and app interactions
 */
Controller = function(){
	
	//The app components
	this.components = {
		EXPIRATION_LIST:null,
		CATEGORIES_LIST:null,
		TAB_GROUP:null,
		ITEM_FORM:null,
		DATA_BINDER:null
	};
	
	//The app shared events
	this.events = {
		EXPIRATIONS_CHANGE:"expirations.change",
		CATEGORIES_CHANGE:"categories.change",
		EXPIRATION_EDIT:"expiration.edit",
		EXPIRATION_DELETE:"expiration.delete"
	};
	
	//Initialize components
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
	
	//Initialize events
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
	
	/**
	 * Fires a single generic event
	 */
	this.fireEvent = function(event, payLoad){
		Ti.App.fireEvent(event, payLoad);
	};
	
	/**
	 * Firss the expirations change event
	 */
	this.onExpirationsChange = function(payLoad){
		this.fireEvent(CONTROLLER.events.EXPIRATIONS_CHANGE, payLoad);
	};
	
	/**
	 * Fires the category change event
	 */
	this.onCategoriesChange = function(payLoad){
		this.fireEvent(CONTROLLER.events.CATEGORIES_CHANGE);
	};
	
	/**
	 * Fires the expiration edit event
	 */
	this.onExpirationEdit = function(payLoad){
		this.fireEvent(CONTROLLER.events.EXPIRATION_EDIT, payLoad);
	};
	
	/**
	 * Fires the expiration delete event
	 */
	this.onExpirationDelete = function(payLoad){
		this.fireEvent(CONTROLLER.events.EXPIRATION_DELETE, payLoad);
	};
	
	/**
	 * Sets the ExpirationList component
	 */
	this.setExpirationList = function(expirationList){
		this.components.EXPIRATION_LIST = expirationList;
	};
	
	/**
	 * Gets the CategoriesList component
	 */
	this.getCategoriesList = function(){
		return this.components.CATEGORIES_LIST;
	};
	
	/**
	 * Sets the CategoriesList component
	 */
	this.setCategoriesList = function(categoriesList){
		this.components.CATEGORIES_LIST = categoriesList;
	};
	
	/**
	 * Gets the CategoriesList component
	 */
	this.getExpirationList = function(){
		return this.components.EXPIRATION_LIST;
	};
	
	/**
	 * Sets the TabGroup component
	 */
	this.setTabGroup = function(tabGroup){
		this.components.TAB_GROUP = tabGroup;
	},
	
	/**
	 * Gets the TabGroup component
	 */
	this.getTabGroup = function(){
		return this.components.TAB_GROUP;
	};
	
	/**
	 * Sets the ItemForm component
	 */
	this.setItemForm = function(itemForm){
		this.components.ITEM_FORM = itemForm;
	};
	
	/**
	 * Gets the ItemForm component
	 */
	this.getItemForm = function(){
		return this.components.ITEM_FORM;
	};
	
	/**
	 * Sets the DataBinder
	 */
	this.setDataBinder = function(dataBinder){
		this.components.DATA_BINDER = dataBinder;
	};
	
	/**
	 * Gets the DataBinder
	 */
	this.getDataBinder = function(){
		return this.components.DATA_BINDER;
	};
	
	/**
	 * Display a Toast message
	 * @param msg The Message to display
	 */
	this.toast = function(msg){
		var toast = Ti.UI.createNotification({
		    message:msg,
		    duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		toast.show();
	};
	
	/**
	 * Display an alert message
	 * @param msg The message to display
	 * @param title The title of the alert dialog
	 */
	this.alert = function(msg, title){
		var alert = Ti.UI.createAlertDialog({
		    message:msg,
		    title:title,
		    ok:'Ok'
		});
		alert.show();
	};
	
	/**
	 * Shows the progress bar
	 * @param msg The Message to display in progress bar
	 */
	this.showProgress = function(msg){
		this.progressIndicator = Ti.UI.Android.createProgressIndicator({
		  message: msg,
		  location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
		  type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
		  cancelable: false
		});
		
		this.progressIndicator.show();
	};
	
	/**
	 * Hides the progress bar
	 */
	this.hideProgress = function(){
		this.progressIndicator.hide();
	};
	
	/**
	 * Parse a date in a string format
	 * @return The Date Object
	 */
	this.parseDate = function(inputString){
		return new Date(inputString);
	};

	/**
	 * Formats a date object
	 * @param _date The Date object
	 * @return A String with the pattern dd/MM/yyyy
	 */
	this.formatDate = function(_date){
		return _date.getDate() + "/" + (_date.getMonth()+1) + "/" + _date.getFullYear();
	};
	
	/**
	 * Merges a json with defaults values
	 */
	this.JMerge = function(defaults, newJson){
		if(!newJson)
			return defaults;
		for(val in newJson)
			defaults[val] = newJson[val];
		return defaults;
		
	};
	
	
};

module.exports = Controller;


