var CATEGORIES = {
	
};	


CategoriesList = function(){
	
	var self = Ti.UI.createView({
		layout:"vertical",
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		top:0
	});
	
	self.reload = CategoriesList.reloadData;
	
	self.reload(); //FIXME: move this on the tab activation
	
	
	return self;
};

CategoriesList.reloadData = function(){
	
	CONTROLLER.showProgress(L('msgloadingdata'));
	
	var data = CategoriesList.getData();
	
	var section = Ti.UI.createListSection();
	
	var items = [];
	CATEGORIES = {};
	this.removeAllChildren();
	
	if(data && data.length > 0){
		
		for(var i=0, ilen=data.length; i<ilen; i++){
			 var item = data[i];
			 
			 var row = Ti.UI.createView({
			 	height:100,
				layout:"composite",
				touchEnabled:false
			 });
			 
			CATEGORIES[item._id] = Ti.UI.createTextField({value:item.name,left:5, width:"50%",focusable:true});
			row.add(CATEGORIES[item._id]);
			var saveButton = Ti.UI.createButton({title:"Save", left:"50%", rowIndex:item._id});
			saveButton.addEventListener("click", CategoriesList.saveItem);
			row.add(saveButton);
			
			var deleteButton = Ti.UI.createButton({title:"Delete", left:"70%", rowIndex:item._id});
			deleteButton.addEventListener("click", CategoriesList.deleteItem);
			row.add(deleteButton);
			
			this.add(row);
			
		}
	}
	
	 var row = Ti.UI.createView({
	 	height:100,
		layout:"composite",
		touchEnabled:false
	 });
	  
	  CATEGORIES.NEW = Ti.UI.createTextField({left:5, width:"50%",focusable:true});
	  
	  row.add(CATEGORIES.NEW);
	  var addButton = Ti.UI.createButton({title:"Add", rowIndex:"NEW",left:"50%"});
	  addButton.addEventListener("click", CategoriesList.addItem);
	  
	  row.add(addButton);
	
	  this.add(row);
	
		
	CONTROLLER.hideProgress();
	
};

CategoriesList.addItem = function(e){
	var rowIndex = e.source.rowIndex;
	var _name = CATEGORIES[rowIndex].getValue();
	CONTROLLER.getDataBinder().insertCategory({
		name:_name
	});
	CONTROLLER.toast(L('msgitemsaved'));
	
	CONTROLLER.onCategoriesChange();
	
};

CategoriesList.saveItem = function(e){
	var rowIndex = e.source.rowIndex;
	var _name = CATEGORIES[rowIndex].getValue();
	CONTROLLER.getDataBinder().updateCategory({
		_id:rowIndex,
		name:_name
	});
	CONTROLLER.toast(L('msgitemsaved'));
	
	CONTROLLER.onCategoriesChange();
};

CategoriesList.deleteItem = function(e){
	var rowIndex = e.source.rowIndex;
	CONTROLLER.getDataBinder().deleteCategory(rowIndex);
	CONTROLLER.toast(L('msgitemsaved'));
	
	CONTROLLER.onCategoriesChange();
};


CategoriesList.getData = function(){
	return CONTROLLER.getDataBinder().getCategories();
};

module.exports = CategoriesList;
