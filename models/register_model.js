var methods = require('./methods_mysql');
var user_model = require('./users_model');

exports.signup = function(data, callback){
	return methods.insert(user_model.table_name, data, callback);
}