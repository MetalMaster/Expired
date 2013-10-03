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
	category:null
};


JMerge = function(defaults, newJson){
	
	if(!newJson)
		return defaults;
	
	for(val in newJson)
		defaults[val] = newJson[val];
		
	return defaults;
	
};

NewItem = function(){
	
	var self = Ti.UI.createView({
		layout:"vertical",
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		top:0
	});
	
	self.add(NewItem.getName());
	self.add(NewItem.getExpireOn());
	self.add(NewItem.getCategory());
	self.add(NewItem.getButtons());
	
	self.bindValues = NewItem.bindValues;
	
	return self;
	
};

NewItem.bindValues = function(json){
	FIELDS._id = json._id;
	FIELDS.name.setValue(json.name);
	FIELDS.expireOn.value = CONTROLLER.parseDate(json.expireOn);
	FIELDS.expireOn.setText(CONTROLLER.formatDate(CONTROLLER.parseDate(json.expireOn)));
	FIELDS.category.setValue(json.category);
};

NewItem.getName = function(){
	
	var self = Ti.UI.createView(JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(JMerge(LABEL_COMMONS, {
		text:L('labelname')
	}));
	
	
	var field = Ti.UI.createTextField(JMerge(FIELD_COMMONS, {
		autocorrect:true,
		hintText:L('hintname')
	}));
	
	FIELDS.name = field;
	
	self.add(label);
	self.add(field);
	
	return self;
};

NewItem.getExpireOn = function(){
	
	var self = Ti.UI.createView(JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(JMerge(LABEL_COMMONS, {
		text:L('labelexpireon')
	}));
	
	var field = Ti.UI.createLabel(JMerge(FIELD_COMMONS,{
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

NewItem.getCategory = function(){
	var self = Ti.UI.createView(JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(JMerge(LABEL_COMMONS, {
		text:L('labelcategory')
	}));
	
	var field = Ti.UI.createPicker(JMerge(FIELD_COMMONS));
	
	FIELDS.category = field;
	
	var data = [];
	data[0]=Ti.UI.createPickerRow({title:'Latticini'});
	data[1]=Ti.UI.createPickerRow({title:'Formaggi'});
	data[2]=Ti.UI.createPickerRow({title:'Bibite'});
	data[3]=Ti.UI.createPickerRow({title:'Pasta'});
	
	field.add(data);
	field.selectionIndicator = true;
	
	self.add(label);
	self.add(field);
	
	return self;
};


NewItem.save = function(){
	if(!FIELDS.name.getValue()){
		CONTROLLER.toast(L('validationrequiredname'));
		return ;
	}
	
	if(!FIELDS.expireOn.value){
		CONTROLLER.toast(L('validationrequiredexpireon'));
		return ;
	}
	
	var values = {_id:FIELDS._id,name:FIELDS.name.getValue(), expireOn:FIELDS.expireOn.value.getTime(), category:FIELDS.category.getValue()};
	
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

NewItem.reset = function(){
	FIELDS._id = null;
	FIELDS.name.setValue(null);
	FIELDS.expireOn.setText(L('hintexpireon'));
	FIELDS.category.setValue(null);
};




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
