const constans = require('../vendor/constants.js');
const Mysql = require('../vendor/mysql');

class Crud extends Mysql{

	constructor(){	
		super();
		this._table_name = 'INFORMATION_SCHEMA.COLUMNS';

		this._table_catalog = 'TABLE_CATALOG';
		this._table_schema = 'TABLE_SCHEMA';
		this._table_name_row = 'TABLE_NAME';
		this._column_name = 'COLUMN_NAME';
		this._ordinal_position = 'ORDINAL_POSITION';
		this._column_default = 'COLUMN_DEFAULT';
		this._is_nullable = 'IS_NULLABLE';
		this._data_type = 'DATA_TYPE';
		this._character_maximum_length = 'CHARACTER_MAXIMUM_LENGTH';
		this._character_octet_length = 'CHARACTER_OCTET_LENGTH';
		this._numeric_precision = 'NUMERIC_PRECISION';
		this._numeric_scale = 'NUMERIC_SCALE';
		this._datetime_precision = 'DATETIME_PRECISION';
		this._character_set_name = 'CHARACTER_SET_NAME';
		this._collation_name = 'COLLATION_NAME';
		this._column_type = 'COLUMN_TYPE';
		this._column_key = 'COLUMN_KEY';
		this._extra = 'EXTRA';
		this._privileges = 'PRIVILEGES';
		this._column_comment = 'COLUMN_COMMENT';
	}

	getTables(callback){
		super.executeQuery("show tables", callback)
	}

	getColums(table,callback){
		super.where({TABLE_SCHEMA: constans.mysql_database, TABLE_NAME: table});
		super.findAll(callback);
	}

}

module.exports = Crud;

/*exports.get_tables = function(callback){
	methods.query("show tables", callback);
}

exports.get_colums = function (data, callback){
	var sqlQuery = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '" + constans.mysql_database + "' AND TABLE_NAME = '" + data.table_name +"'";
	methods.query(sqlQuery, callback);
}
*/
