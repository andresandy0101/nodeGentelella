const constans = require('../vendor/constants.js');
const mysql = require('mysql');

exports.insert = function(table, data, callback){
	var sqlQuery = "INSERT INTO " + table + " SET ?";
	return execute(sqlQuery, data, callback);
}

exports.find = function(table, condition, callback){
	condition = condition == null || condition == "" ? "" : " WHERE " + condition;
	var sqlQuery = "SELECT * FROM " + table + condition;
	execute(sqlQuery, null, callback);
}

exports.delete = function(table, condition, callback){
	//var sqlQuery = "SELECT * FROM " + table + " WHERE " + condition;
	condition = condition == null || condition == "" ? "" : " WHERE " + condition;
	var sqlQuery = "DELETE FROM " + table + condition;
	execute(sqlQuery, null, callback);	
}

exports.query = function(query, callback){
	execute(query, null, callback);
}

function execute(sqlQuery, data, callback){
	console.log(sqlQuery);

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
			throw err;
		else{
			console.log("Connect !!");
		    db.query(sqlQuery, data, (err, res) => {
				if(err)
					console.log(err);
				else
					console.log(res);
				callback(err, res);
				db.end();
			});
		}
	});

	
}