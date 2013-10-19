var TABLES = [
	//Used for debug
	//"drop table expirations",
	//"drop table categories", 
	//FIXME: manage alter table to add quantity column
	"create table if not exists expirations (_id TEXT,name TEXT, expireOn INTEGER, category TEXT)",
	"create table if not exists categories (_id TEXT,name TEXT)"
];

var SQL = {
	INSERT_EXPIRATION:"insert into expirations (_id,name,quantity,expireOn,category) values (?,?,?,?,?)",
	INSERT_CATEGORY:"insert into categories (_id,name) values (?,?)",
	SELECT_EXPIRATIONS:"select _id,name,quantity,expireOn,category,(select name from categories C where C._id = E.category) as categoryDesc from expirations E order by expireOn asc",
	SELECT_CATEGORIES:"select _id,name from categories order by name asc",
	SELECT_EXPIRATION:"select _id,name,quantity,expireOn,category,(select name from categories C where C._id = E.category) as categoryDesc  from expirations E where _id = ?",
	UPDATE_EXPIRATION:"update expirations set name = ?, quantity = ?, expireOn = ?, category = ? where _id = ?",
	UPDATE_CATEGORY:"update categories set name = ? where _id = ?",
	DELETE_EXPIRATION:"delete from expirations where _id = ?",
	DELETE_CATEGORY:"delete from categories where _id = ?"
};

/**
 * DataBinder component
 */
DataBinder = function(){
	
	this.DB_NAME = "Expired";
	
	/**
	 * Initialize the component
	 */
	this.initialize = function(){
		this.checkTables();
		//Used for debug
		//this.insertDummyData();
	};
	
	/**
	 * Opens a session with the DB
	 * @return The session object
	 */
	this.openSession = function(){
		return Ti.Database.open(this.DB_NAME);
	};
	
	/**
	 * Close a session with the db
	 * @param db The db session
	 */
	this.closeSession = function(db){
		db.close();
	};
	
	/**
	 * Creates tables
	 */
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
	
	/**
	 * Gets the expirations list
	 * @return An array of expirations
	 */
	this.getExpirations = function(){
		var db = this.openSession();
		var rows = db.execute(SQL.SELECT_EXPIRATIONS);
		this.closeSession(db);
		var array = [];
		while (rows.isValidRow()){
		  var json = {
		  		_id:rows.fieldByName('_id'),
		  		name:rows.fieldByName('name'),
		  		quantity:rows.fieldByName('quantity'),
		  		expireOn:rows.fieldByName('expireOn'),
		  		category:rows.fieldByName('category'),
		  		categoryDesc:rows.fieldByName('categoryDesc')
		  };
		  array.push(json);
		  rows.next();
		}
		rows.close();
		
		return array;
	};
	
	/**
	 * Gets the categories list
	 * @return An array of categories
	 */
	this.getCategories = function(){
		var db =this.openSession();
		var rows = db.execute(SQL.SELECT_CATEGORIES);
		this.closeSession(db);
		var array = [];
		while (rows.isValidRow()){
		  var json = {
		  		_id:rows.fieldByName('_id'),
		  		name:rows.fieldByName('name'),
		  };
		  array.push(json);
		  rows.next();
		}
		rows.close();
		
		return array;
	};
	
	/**
	 * Gets a single expiration item
	 * @param itemId The expiration item id
	 * @return The Expiration item object
	 */
	this.getItem = function(itemId){
		var db = this.openSession();
		var rows = db.execute(SQL.SELECT_EXPIRATION, itemId);
		this.closeSession(db);
	  	var json = {
	  		_id:rows.fieldByName('_id'),
	  		name:rows.fieldByName('name'),
	  		quantity:rows.fieldByName('quantity'),
	  		expireOn:rows.fieldByName('expireOn'),
	  		category:rows.fieldByName('category'),
	  		categoryDesc:rows.fieldByName('categoryDesc')
	  	};
		rows.close();
		return json;
	};
	
	/**
	 * Insert a new Expiration
	 * @param json The Expiration json
	 * @return The New expiration id
	 */
	this.insertExpiration = function(json){
		var db = this.openSession();
		
		json._id = ""+new Date().getTime();
			
		var values = [json._id, json.name, json.quantity, json.expireOn, json.category];
		
		db.execute(SQL.INSERT_EXPIRATION, values);
		
		this.closeSession(db);
		
		return json._id;
	};
	
	/**
	 * Insert a new category
	 * @param json The Category json
	 * @return The new Category id
	 */
	this.insertCategory = function(json){
		var db = this.openSession();
		
		json._id = ""+new Date().getTime();
			
		var values = [json._id, json.name];
		
		db.execute(SQL.INSERT_CATEGORY, values);
		
		this.closeSession(db);
		
		return json._id;
	};
	
	/**
	 * Updates an expiration item
	 * @param json The expiration json
	 */
	this.updateExpiration = function(json){
		var db = this.openSession();
		
		var values = [json.name, json.quantity,json.expireOn, json.category, json._id];
		
		db.execute(SQL.UPDATE_EXPIRATION, values);
		
		this.closeSession(db);
	
	};
	
	/**
	 * Updates a category item
	 * @param json The category json
	 */
	this.updateCategory = function(json){
		var db = this.openSession();
		
		var values = [json.name, json._id];
		
		db.execute(SQL.UPDATE_CATEGORY, values);
		
		this.closeSession(db);
	
	};
	
	/**
	 * Deletes an expiration item
	 * @param _id The Expiration item id to delete
	 */
	this.deleteExpiration = function(_id){
		var db = this.openSession();
		
		db.execute(SQL.DELETE_EXPIRATION, _id);
		
		this.closeSession(db);
	};
	
	/**
	 * Deletes a category item
	 * @param _id The category item id to delete
	 */
	this.deleteCategory = function(_id){
		var db = this.openSession();
		
		db.execute(SQL.DELETE_CATEGORY, _id);
		
		this.closeSession(db);
	};
	
	/**
	 * Insert dummy data (just for debugging purposes)
	 */
	this.insertDummyData = function(){
		var bevandeId = this.insertCategory({
			_id:null,
			name:"Bevande"
		});
		
		var farinaceiId = this.insertCategory({
			_id:null,
			name:"Farinacei"
		});
		
		
		this.insertExpiration({
			_id:null,
			name:"Latte",
			expireOn:new Date("2013","03","24").getTime(),
			category:bevandeId
		});
		this.insertExpiration({
			_id:null,
			name:"Pane",
			expireOn:new Date("2013","10","01").getTime(),
			category:farinaceiId
		});
	};
	
	return this;
};


module.exports = DataBinder;