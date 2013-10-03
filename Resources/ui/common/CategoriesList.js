CategoriesList = function(){
	var self = Ti.UI.createListView({
		templates: { 'plain': CategoriesList.getTemplates() },
    	defaultItemTemplate: 'plain'               
	});
	
	self.reload = CategoriesList.reloadData;
	
	self.reload(); //FIXME: move this on the tab activation
	
	
	return self;
};

CategoriesList.getTemplates = function(){
	
	var self = {
	    childTemplates: [
	        {
	            type: 'Ti.UI.TextField',
	            bindId: 'name',  
	            properties: {
	                left: '10dp',
	                color:"black",
	                top:"5dp",
	                font: { fontFamily:'Arial', fontSize: '15dp', fontWeight:'bold' },
	                verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	                width:"50%"
	            }
	        },
	        {
	        	type:"Ti.UI.Button",
	        	properties:{
	        		title:"Save",
	        		verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	        		right:"50dp"
	        	}
	        },
	        {
	        	type:"Ti.UI.Button",
	        	properties:{
	        		title:"Delete",
	        		width:"20%",
	        		verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	        		right:"5dp"
	        	}
	        }
	    ],
	};
	
	return self;
};


CategoriesList.reloadData = function(){
	
	CONTROLLER.showProgress(L('msgloadingdata'));
	
	var data = CategoriesList.getData();
	
	var section = Ti.UI.createListSection();
	
	var items = [];
	
	if(data){
		for(var i=0, ilen=data.length; i<ilen; i++){
			var item = data[i];
			items.push(
				{
					name:{value:item.name},
					properties : {
			            itemId: item._id
			        }
				});
		}
	}
	
	items.push({
		name:{value:null},
		properties:{
			itemId:null
		}
	});
	
	section.setItems(items);
	if(this.getSectionCount() > 0)
		this.replaceSectionAt(0, section);				
	else
		this.appendSection(section);
		
	CONTROLLER.hideProgress();
	
};

CategoriesList.getData = function(){
	return CONTROLLER.getDataBinder().getCategories();
};

module.exports = CategoriesList;
