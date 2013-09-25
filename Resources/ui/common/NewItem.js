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
	tags:null
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
	self.add(NewItem.getTags());
	self.add(NewItem.getButtons());
	
	return self;
	
};

NewItem.getName = function(){
	
	var self = Ti.UI.createView(JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(JMerge(LABEL_COMMONS, {
		text:L('labelname')
	}));
	
	
	var field = Ti.UI.createTextField(JMerge(FIELD_COMMONS));
	
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
		var picker = Ti.UI.createPicker({
		  type:Ti.UI.PICKER_TYPE_DATE,
		  minDate:new Date(2009,0,1),
		  maxDate:new Date(2014,11,31),
		  locale:"it-IT"
		});
		picker.showDatePickerDialog({
			value:new Date(),
			callback:function(event){
				if(!event.cancel){
					field.value = event.value;
					field.text = event.value.getFullYear() + "-" + (event.value.getMonth()+1) + '-' + event.value.getDate();	
				}
			}
		});
	});
	
	self.add(label);
	self.add(field);
	
	return self;
};

NewItem.getTags = function(){
	var self = Ti.UI.createView(JMerge(ROW_COMMONS));
	
	var label = Ti.UI.createLabel(JMerge(LABEL_COMMONS, {
		text:L('labeltags')
	}));
	
	var field = Ti.UI.createPicker(JMerge(FIELD_COMMONS));
	
	FIELDS.tags = field;
	
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

NewItem.getValues = function(){
	
};


NewItem.getButtons = function(){
	var self = Ti.UI.createView({
		layout:"horizontal",
		height:Ti.UI.SIZE,
		width:Ti.UI.FILL
	});
	
	var buttonSave = Ti.UI.createButton({
		bottom:5,
		title:L("buttonsave"),
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		left:10,
		right:10,
		top:5
	});
	
	buttonSave.addEventListener("click", function(e){
		
		DATA_BINDER.insertExpiration({_id:null,name:FIELDS.name.getValue(), expireOn:FIELDS.expireOn.getText(), tags:FIELDS.tags.getValue()});
		
		var toast = Ti.UI.createNotification({
		    message:"Item saved",
		    duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		toast.show();
		
		Ti.App.fireEvent("expirations.change");
		
	});
	
	self.add(buttonSave);
	
	return self;
};

module.exports = NewItem;
