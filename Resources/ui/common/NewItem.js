var ROW_COMMONS = {
	height:100,
	layout:"composite",
	touchEnabled:false
};

var LABEL_COMMONS = {
	left:10,
	font: { fontSize:30 },
	textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT
};

var FIELD_COMMONS = {
	right:10,
	height:100,
	width: 300,
	bottom:0,
	font: { fontSize:30 },
	textAlign:Ti.UI.TEXT_ALIGNMENT_LEFT,
	focusable:true
};

var FIELDS = {
	_id:null,
	name:null,
	expireOn:null,
	category:null,
	categoryId:null,
	categories:null,
	quantity:null
};


/**
 * Expiration Item form component
 */
NewItem = function(){
	
	var self = Ti.UI.createView({
		layout:"vertical",
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		top:0
	});
	
	self.add(NewItem.getName());
	self.add(NewItem.getQuantity());
	self.add(NewItem.getExpireOn());
	FIELDS.categoryRow = NewItem.getCategory();
	self.add(FIELDS.categoryRow);
	self.add(NewItem.getButtons());
	
	self.bindValues = NewItem.bindValues;
	
	self.reloadCategories = NewItem.reloadCategories;
	
	self.reloadCategories(); //FIXME
	
	return self;
	
};

/**
 * Binds the Item form with the values provided
 * @param json The values to bind the form to
 */
NewItem.bindValues = function(json){
	FIELDS._id = json._id;
	FIELDS.name.setValue(json.name);
	FIELDS.quantity.setValue(json.quantity);
	FIELDS.expireOn.value = CONTROLLER.parseDate(json.expireOn);
	FIELDS.expireOn.setText(CONTROLLER.formatDate(CONTROLLER.parseDate(json.expireOn)));
	FIELDS.categoryId = json.category;
	FIELDS.categories = CONTROLLER.getDataBinder().getCategories();
	for(var i=0; i<FIELDS.categories.length; i++){
		var cat = FIELDS.categories[i];
		if(cat._id == FIELDS.categoryId){
			FIELDS.category.setValue(cat.name);
			FIELDS.category.setSelectedRow(0,i);
		}
	}
};

/**
 * Gets the "Name" row
 * @return A View that displays the "name" input field
 */
NewItem.getName = function(){
	
	var self = Ti.UI.createView(CONTROLLER.JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(CONTROLLER.JMerge(LABEL_COMMONS, {
		text:L('labelname')
	}));
	
	
	var field = Ti.UI.createTextField(CONTROLLER.JMerge(FIELD_COMMONS, {
		autocorrect:true,
		hintText:L('hintname')
	}));
	
	FIELDS.name = field;
	
	self.add(label);
	self.add(field);
	
	return self;
};

/**
 * Gets the "Quantity" row
 * @return A View that displays the "quantity" input field
 */
NewItem.getQuantity = function(){
	
	var self = Ti.UI.createView(CONTROLLER.JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(CONTROLLER.JMerge(LABEL_COMMONS, {
		text:L('labelquantity')
	}));
	
	//FIXME: use the right field type for quantity
	var field = Ti.UI.createTextField(CONTROLLER.JMerge(FIELD_COMMONS, {
		autocorrect:true,
		hintText:L('hintquantity')
	}));
	
	FIELDS.quantity = field;
	
	self.add(label);
	self.add(field);
	
	return self;
};

/**
 * Gets the expireOn row
 * @return a View that displays the expireOn field
 */
NewItem.getExpireOn = function(){
	
	var self = Ti.UI.createView(CONTROLLER.JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(CONTROLLER.JMerge(LABEL_COMMONS, {
		text:L('labelexpireon')
	}));
	
	var field = Ti.UI.createLabel(CONTROLLER.JMerge(FIELD_COMMONS,{
		text:L('hintexpireon')
	}));
	
	FIELDS.expireOn = field;
	
	field.addEventListener("click", function(e){
		FIELDS.name.blur();
		var picker = Ti.UI.createPicker({
		  type:Ti.UI.PICKER_TYPE_DATE,
		  minDate:new Date(2009,0,1),
		  maxDate:new Date(2014,11,31),
		  locale:"it-IT"
		});
		picker.showDatePickerDialog({
			value:(field.value ? field.value : new Date()),
			callback:function(event){
				if(!event.cancel){
					field.value = event.value;
					field.text = event.value.getDate() + "/" + (event.value.getMonth()+1) + '/' + event.value.getFullYear();	
				}
			}
		});
	});
	
	self.add(label);
	self.add(field);
	
	return self;
};

/**
 * Gets the category form row
 * @return a View that displays the category field
 */
NewItem.getCategory = function(){
	var self = Ti.UI.createView(CONTROLLER.JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(CONTROLLER.JMerge(LABEL_COMMONS, {
		text:L('labelcategory')
	}));
	
	var field = Ti.UI.createPicker(CONTROLLER.JMerge(FIELD_COMMONS,{type:Ti.UI.PICKER_TYPE_PLAIN}));
	
	FIELDS.category = field;
	
	self.add(label);
	self.add(field);
	
	return self;
};

/**
 * Reloads the categories field
 */
NewItem.reloadCategories = function(){
	FIELDS.categoryRow.remove(FIELDS.category);
	FIELDS.categories = CONTROLLER.getDataBinder().getCategories();
	FIELDS.category = Ti.UI.createPicker(CONTROLLER.JMerge(FIELD_COMMONS,{type:Ti.UI.PICKER_TYPE_PLAIN}));
	
	if(FIELDS.categories && FIELDS.categories.length > 0){
		var data = [];
		for(var i=0; i<FIELDS.categories.length; i++){
			var cat = FIELDS.categories[i];
			data.push(Ti.UI.createPickerRow({title:cat.name, itemId:cat._id}));
		}
		FIELDS.category.add(data);
		FIELDS.category.selectionIndicator = true;
		FIELDS.categoryRow.add(FIELDS.category);
	}
	
};

/**
 * Save the new/updated item
 */
NewItem.save = function(){
	if(!FIELDS.name.getValue()){
		CONTROLLER.toast(L('validationrequiredname'));
		return ;
	}
	
	if(!FIELDS.expireOn.value){
		CONTROLLER.toast(L('validationrequiredexpireon'));
		return ;
	}
	
	var categoryRow = FIELDS.category.getSelectedRow(0);
	
	if(!categoryRow){
		CONTROLLER.toast(L('validationrequiredcategory'));
		return;
	}
	
	var values = {
			_id:FIELDS._id,
			name:FIELDS.name.getValue(), 
			quantity:FIELDS.quantity.getValue(),
			expireOn:FIELDS.expireOn.value.getTime(), 
			category:categoryRow.itemId
	};
	
	var isInsert = !values._id;
	
	
	if(isInsert){
		CONTROLLER.getDataBinder().insertExpiration(values);
		NewItem.reset();
	}else
		CONTROLLER.getDataBinder().updateExpiration(values);
	
	
	CONTROLLER.toast(L('msgitemsaved'));
	
	CONTROLLER.onExpirationsChange();
	
	CONTROLLER.getTabGroup().setActiveTab(0);
};

/**
 * Reset the form values
 */
NewItem.reset = function(){
	FIELDS._id = null;
	FIELDS.name.setValue(null);
	FIELDS.quantity.setValue(1);
	FIELDS.expireOn.setText(L('hintexpireon'));
	FIELDS.category.setValue(null);
};



/**
 * Gets a row with the action buttons
 * @return a View that displays the action buttons in the form
 */
NewItem.getButtons = function(){
	var self = Ti.UI.createView({
		layout:"horizontal",
		height:Ti.UI.SIZE,
		width:Ti.UI.FILL,
		left:10,
		right:10,
		top:5,
		bottom:5
	});
	
	var buttonSave = Ti.UI.createButton({
		title:L('buttonsave'),
		height:Ti.UI.SIZE
	});
	
	var buttonReset = Ti.UI.createButton({
		title:L('buttonreset'),
		height:Ti.UI.SIZE
	});
	
	buttonSave.addEventListener("click", function(e){
		NewItem.save();
	});
	
	buttonReset.addEventListener("click", function(e){
		NewItem.reset();
	});
	
	self.add(buttonSave);
	self.add(buttonReset);
	
	return self;
};


module.exports = NewItem;
