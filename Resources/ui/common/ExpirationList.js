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
	            type: 'Ti.UI.ImageView',  // Use an image view
	            bindId: 'icon',            // Bind ID for this image view
	            properties: {             // Sets the ImageView.image property
	            	width: '46px', height: '46px', right: '20dp'
	            }
	        }                 
	        // {
	            // type: 'Ti.UI.Button',   // Use a button
	            // bindId: 'button',       // Bind ID for this button
	            // properties: {           // Sets several button properties
	                // width: '80dp',
	                // height: '30dp',                        	
	                // right: '10dp',
	                // title: 'press me'
	            // }
	            // //events: { click : report }  // Binds a callback to the button's click event
	        // }
	    ]
	};
	
	return self;
};

parseDate = function(inputString){
	var parts = inputString.split('-');
	return new Date(parts[0], parts[1]-1, parts[2]);
};

ExpirationList.reloadData = function(){
	
	var data = ExpirationList.getData();
		
	var section = Ti.UI.createListSection();
	
	var items = [];
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
		
		Ti.API.info("Icon: " + _icon);
		
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
	
	section.setItems(items);
	if(this.getSectionCount() > 0)
		this.replaceSectionAt(0, section);				
	else
		this.appendSection(section);
	
};

ExpirationList.getData = function(){
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
};

module.exports = ExpirationList;
