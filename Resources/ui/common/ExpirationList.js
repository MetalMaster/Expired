ExpirationList = function(){
	var self = Ti.UI.createListView({
		templates: { 'plain': ExpirationList.getTemplates() },
    	defaultItemTemplate: 'plain'               
	});
	
	self.reload = ExpirationList.reloadData;
	
	
	return self;
};

ExpirationList.getTemplates = function(){
	
	var self = {
	    childTemplates: [
	        {
	            type: 'Ti.UI.Label',
	            bindId: 'name',  
	            properties: {
	                left: '10dp',
	                color:"black",
	                top:"5dp",
	                font: { fontFamily:'Arial', fontSize: '20dp', fontWeight:'bold' },
	                verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	            }
	        },
	        {
	            type: 'Ti.UI.Label', 
	            bindId: 'expireOn',
	            properties:{
	            	color:"gray",
	            	font: { fontFamily:'Arial', fontSize: '10dp' },
	            	left:'10dp',
	            	top:'30dp',
	            	verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	            }
	        },
	        {
	            type: 'Ti.UI.Label', 
	            bindId: 'categoryDesc',
	            properties:{
	            	color:"blue",
	            	font: { fontFamily:'Arial', fontSize: '10dp' },
	            	left:'10dp',
	            	top:'45dp',
	            	verticalAlign:Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	            }
	        },
	        {
	            type: 'Ti.UI.ImageView', 
	            bindId: 'icon',            
	            properties: {             
	            	width: '46px', height: '46px', right: '20dp'
	            }
	        }
	    ],
	    events:{
        	click: ExpirationList.onClick,
        	swipe: ExpirationList.onSwipe,
        	longpress: ExpirationList.onLongPress 
        }       
	};
	
	return self;
};


ExpirationList.onClick = function(e){
	CONTROLLER.onExpirationEdit({itemId:e.itemId});
};

ExpirationList.onLongPress = function(e){
	var dialog = Ti.UI.createOptionDialog({
		  cancel: 2,
		  options: [L('actiondelete'), L('actionupdate'), L('actioncancel')],
		  selectedIndex: 2,
		  destructive: 0,
		  title: 'Options'
	});
	
	dialog.addEventListener("click", function(event){
		if(event.index === 0)
			ExpirationList.removeItem(e.itemId);
		else if (event.index === 1)
			CONTROLLER.onExpirationEdit({itemId:e.itemId});
	});
	
	dialog.show();
};

ExpirationList.onSwipe = function(e){
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 1,
	    buttonNames: [L('actionconfirm'), L('actioncancel')],
	    message: L('msgremoveitem'),
	    title: L('titleremoveitem')
  	});
  	dialog.addEventListener('click', function(event){
	    if (event.index === 0){
	    	ExpirationList.removeItem(e.itemId);
	    	
	    }
	  });
    dialog.show();
};

ExpirationList.removeItem = function(_itemId){
	CONTROLLER.onExpirationDelete({itemId:_itemId});
	CONTROLLER.toast(L('msgitemremoved'));
};

ExpirationList.reloadData = function(){
	
	CONTROLLER.showProgress(L('msgloadingdata'));
	
	var data = ExpirationList.getData();
	
	var section = Ti.UI.createListSection();
	
	var items = [];
	
	if(data){
		for(var i=0, ilen=data.length; i<ilen; i++){
			var item = data[i];
			var _icon = null;
			var expiredOn = item.expireOn;
			var now = new Date().getTime();
			var warnDate = now + 172800000;
			if(now > expiredOn)
				_icon = "/images/icon_expired.png";
			else if(warnDate > expiredOn)
				_icon = "/images/icon_warning.png";
			
			items.push(
				{
					name:{text:item.name},
					expireOn:{text:CONTROLLER.formatDate(CONTROLLER.parseDate(item.expireOn))},
					icon:{image:_icon},
					categoryDesc:{text:item.categoryDesc},
					properties : {
						category:item.category,
			            itemId: item._id,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
			        }
				});
		}
	}
	
	section.setItems(items);
	if(this.getSectionCount() > 0)
		this.replaceSectionAt(0, section);				
	else
		this.appendSection(section);
		
	CONTROLLER.hideProgress();
	
};

ExpirationList.getData = function(){
	return CONTROLLER.getDataBinder().getExpirations();
};

module.exports = ExpirationList;
