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
	Ti.API.info("Cliccked item : " + e.itemId);
	Ti.App.fireEvent("expirations.edit", {itemId:e.itemId});
	
};

ExpirationList.onSwipe = function(e){
	Ti.API.info("Swiped item: " + e.itemId);
};

ExpirationList.reloadData = function(){
	
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
	
};

ExpirationList.getData = function(){
	/*
	var dummy = [
		{
			_id:"AABB",
			name:"Latte",
			expireOn:"2013-05-01",
			tags:["Colazione", "Bevande"]
		},
		{
			_id:"BBCC",
			name:"Parmiggiano",
			expireOn:"2013-09-25",
			tags:["Formaggi"]
		},
		{
			_id:"DDEE",
			name:"Prosciutto cotto",
			expireOn:"2013-12-01",
			tags:["Affettati"]
		}
	];
	
	return dummy;
	*/
	
	return DATA_BINDER.getExpirations();
	
	
};

module.exports = ExpirationList;
