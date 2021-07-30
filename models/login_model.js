var methods = require('./methods_mysql');
var user_model = require('./users_model');


exports.access = function(data, callback){
	var condition = user_model.g01_user + " = '" + data[user_model.g01_user] + "' AND " + user_model.g01_password + " = '" + data[user_model.g01_password] + "' ";
	methods.find(user_model.table_name, condition, callback);
}