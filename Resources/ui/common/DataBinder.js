var TABLES = [
	"drop table expirations",
	"create table if not exists expirations (_id TEXT,name TEXT, expireOn INTEGER, category TEXT)"
];

var SQL = {
	INSERT_EXPIRATION:"insert into expirations (_id,name,expireOn,category) values (?,?,?,?)",
	SELECT_EXPIRATIONS:"select _id,name,expireOn,category from expirations order by expireOn asc",
	SELECT_EXPIRATION:"select _id,name,expireOn,category from expirations where _id = ?",
	UPDATE_EXPIRATION:"update expirations set name = ?, expireOn = ?, category = ? where _id = ?",
	DELETE_EXPIRATION:"delete from expirations where _id = ?"
};

DataBinder = function(){
	
	this.DB_NAME = "Expired";
	
	this.initialize = function(){
		this.checkTables();
		this.insertDummyData();
	};
	
	this.openSession = function(){
		return Ti.Database.open(this.DB_NAME);
	};
	
	this.closeSession = function(db){
		db.close();
	};
	
	this.checkTables = function(){
		var db = this.openSession();
		for(var i=0; i<TABLES.length; i++){
			try{
				db.execute(TABLES[i]);
			}catch(e){
				console.error("Error executing script: " + TABLES[i]);
			}
		}
		this.closeSession(db);
	};
	
	this.getExpirations = function(){
		var db = this.openSession();
		var rows = db.execute(SQL.SELECT_EXPIRATIONS);
		this.closeSession(db);
		var array = [];
		while (rows.isValidRow()){
		  var json = {
		  		_id:rows.fieldByName('_id'),
		  		name:rows.fieldByName('name'),
		  		expireOn:rows.fieldByName('expireOn'),
		  		category:rows.fieldByName('category')
		  };
		  array.push(json);
		  rows.next();
		}
		rows.close();
		
		return array;
	};
	
	this.getItem = function(itemId){
		var db = this.openSession();
		var rows = db.execute(SQL.SELECT_EXPIRATION, itemId);
		this.closeSession(db);
	  	var json = {
	  		_id:rows.fieldByName('_id'),
	  		name:rows.fieldByName('name'),
	  		expireOn:rows.fieldByName('expireOn'),
	  		category:rows.fieldByName('category')
	  	};
		rows.close();
		return json;
	};
	
	this.insertExpiration = function(json){
		var db = this.openSession();
		
		json._id = ""+new Date().getTime();
			
		var values = [json._id, json.name, json.expireOn, json.category];
		
		db.execute(SQL.INSERT_EXPIRATION, values);
		
		this.closeSession(db);
	};
	
	this.updateExpiration = function(json){
		var db = this.openSession();
		
		var values = [json.name, json.expireOn, json.category, json._id];
		
		db.execute(SQL.UPDATE_EXPIRATION, values);
		
		this.closeSession(db);
	
	};
	
	this.deleteExpiration = function(_id){
		var db = this.openSession();
		
		db.execute(SQL.DELETE_EXPIRATION, _id);
		
		this.closeSession(db);
	};
	
	
	this.insertDummyData = function(){
		this.insertExpiration({
			_id:null,
			name:"Latte",
			expireOn:new Date("2013","03","24").getTime(),
			category:"Bevande"
		});
		this.insertExpiration({
			_id:null,
			name:"Pane",
			expireOn:new Date("2013","10","01").getTime(),
			category:"Panetteria"
		});
	};
	
	return this;
};


module.exports = DataBinder;