"use strict";

const _  = require('lodash');
const constans = require('../vendor/constants.js');
const mysql = require('mysql');
const _execute = Symbol('execute');

const Utils = require('../vendor/utils');

class Mysql extends Utils{

	constructor() {
		super();
		this._values = {};
		this._fields = [];
		this._conditionals = {};
    }

    findOne(callback){
    	var sqlQuery = "SELECT " + super.fields(this._fields) + " FROM " + this._table_name + super.condition(this._conditionals) + " LIMIT 1";
		this[_execute](sqlQuery, null, callback);	
    }

    findAll(callback){
    
    	var sqlQuery = "SELECT " + super.fields(this._fields) + " FROM " + this._table_name + super.condition(this._conditionals);
		this[_execute](sqlQuery, null, callback);
    }

	insert(data, callback){
		var sqlQuery = "INSERT INTO " + this._table_name + " SET ?";
		this[_execute](sqlQuery, data, callback);
	}

	update(data, callback){
		var sqlQuery = "UPDATE " + this._table_name + " SET ? " + super.condition(this._conditionals);
		this[_execute](sqlQuery, data, callback);
	}

	delete(callback){
		var sqlQuery = "DELETE FROM " + this._table_name + super.condition(this._conditionals);
		this[_execute](sqlQuery, null, callback);	
	}

	executeQuery(sqlQuery, callback){
		this[_execute](sqlQuery, null, callback);		
	}

	[_execute](sqlQuery, data, callback){

	 	this._values = data;
	 	this.fields([]);
		this.where({});

		// create connection to database
		// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
		const db = mysql.createConnection ({
		    host : constans.mysql_host,
		    user : constans.mysql_user,
		    password : constans.mysql_password,
		    database : constans.mysql_database
		});

		// connect to database
		db.connect((err) => {
		    if (err)
				console.log(err);
			else{
				console.log("Connect !!");
			    var q = db.query(sqlQuery, data, (err, res) => {
			    	console.log(q.sql);
					if(err)
						console.log(err);
					//super.resultQuery(err, res, callback);
					callback(err, res);
					db.end();
				});
			}
		});

	}

	get database(){
		return { attributes: this._attributes, validations : this._rules, values: this._values};
	}

	set valuesUpdate(values){
		this._values = values[0];
	}

	fields(fields){
    	this._fields = fields;
    }

    where(conditionals){
    	this._conditionals = conditionals;
    }
}

module.exports = Mysql;