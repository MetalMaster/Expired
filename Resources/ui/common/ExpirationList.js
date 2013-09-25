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
	                font: { fontFamily:'Arial', fontSize: '20dp', fontWeight:'bold' }
	            }
	        },
	        {
	            type: 'Ti.UI.Label', 
	            bindId: 'expireOn',
	            properties:{
	            	color:"gray",
	            	font: { fontFamily:'Arial', fontSize: '10dp' },
	            	left:'10dp',
	            	top:'35dp'
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
        	swipe: ExpirationList.onSwipe 
        }       
	};
	
	return self;
};

parseDate = function(inputString){
	var parts = inputString.split('-');
	return new Date(parts[0], parts[1]-1, parts[2]);
};

ExpirationList.onClick = function(e){
	CONTROLLER.onExpirationEdit({itemId:e.itemId});
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
	    	CONTROLLER.onExpirationDelete({itemId:e.itemId});
	    	CONTROLLER.toast(L('msgitemremoved'));
	    }
	  });
    dialog.show();
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
			var expiredOn = parseDate(item.expireOn).getTime();
			var now = new Date().getTime();
			var warnDate = now + 172800000;
			if(now > expiredOn)
				_icon = "/images/icon_expired.png";
			else if(warnDate > expiredOn)
				_icon = "/images/icon_warning.png";
			
			items.push(
				{
					name:{text:item.name},
					expireOn:{text:item.expireOn},
					icon:{image:_icon},
					properties : {
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
