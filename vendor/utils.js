"use strict";
const constans = require('../vendor/constants.js');
const fileSys = require('fs');
const _  = require('lodash');

const _firstLetterUppercase = Symbol('firstLetterUppercase');
const _rulesModel = Symbol('rulesModel');
const _fileCreator = Symbol('fileCreator');
const _createModel = Symbol('createModel');
const _createController = Symbol('createController');
const _dirCreator = Symbol('dirCreator');
const _createControlllerCrud = Symbol('createControlllerCrud');
const _createViewsCrud = Symbol('createViewsCrud');

class Utils{
	constructor() {
		this._error = null;
	}

	/* array = fields */
	fields(array){ //auxiliar function for get querys fields 
		if(array.length > 0)
			return array.toString();
		else
			return "*";
	}

	/* attributes = conditoons for add */
	condition(attributes){ // auxiliar function for get all query conditionals
		var str = " WHERE ";
		var keys = Object.keys(attributes);

		//if any condition exist 
		if(keys.length < 1)
			return "";

		//generate coditionals string 
		for(var i = 0; i < keys.length; i++){
			str += keys[i] + " = '" + attributes[keys[i]] + "'";
			if(i < keys.length - 1)
				str += " AND ";
		}

		return str;
	}
	/*
		err = any error
		result = query result
		callback = return function
	*/
	resultQuery(err, result, callback){ //function for get query result
		callback(err, result);
	}
	/*
		data = form data 
		fields = fields selected
		callback = return function
	*/
	renderModel(data, fields, callback){ //public function for create model
		this[_createModel](data, fields, callback);
	}

	/*
		data = form data
		callback = return function
	*/
	renderController(data, callback){// public function for create controller
		this[_createController](data, callback);	
	}

	renderCrud(data, fields, callback){

		data.name = data.name.toLowerCase();

		this[_createModel]({model_name: data.name, table_name: data.table}, fields, function(err){
			if(err){
				this._error = err;
				console.log(err);
			}
		});

		this[_createControlllerCrud](data, fields, function(err){
			if(err){
				this._error = err;
				console.log(err);
			}
		});


		this[_createViewsCrud](data, fields, function(err){
			if(err){
				this._error = err;
				console.log(err);
			}
		});

	}

	/*
		data = form data 
		fields = fields selected
		callback = return function
	*/
	[_createModel](data, fields, callback){ //private function for create model

		var key = "id"; //auxialiar variable for get table primary key
		// begin model body
		var str = "\"use strict\";\n\n";
		str += "const Mysql = require('../vendor/mysql');\n";
		str += "const _  = require('lodash');\n";
		str += "const _attributes = Symbol('attributes');\n";
		str += "const _validation = Symbol('validation');\n\n";
		str += "class " + this[_firstLetterUppercase](data.model_name) + " extends Mysql{\n\n";
	
		str += "\tconstructor(){\n";
		str += "\t\tsuper();\n";
		str += "\t\tthis._table_name = '" + data.table_name + "';\n";

		//add all fields in contructor
		for (var i = 0; i < fields.length; i++) {
			str += "\t\tthis._" + fields[i][this._column_name] + " = '" + fields[i][this._column_name] + "';\n";
		}

		str += "\t\tthis[_attributes]();\n";
		str += "\t\tthis[_validation]();\n";
		str += "\t}\n\n";

		str += "\t[_attributes](){\n";
		str += "\t\tthis._attributes = {\n";
		//add al fields with comments
		for (var i = 0; i < fields.length; i++) {
			str += "\t\t\t" + fields[i][this._column_name] + ": '" + fields[i][this._column_comment] + "';\n";
		}

		str += "\t\t};\n";
		str += "\t}\n\n";

		//add fields rules
		str += "\t[_validation](){\n";
		str += "\t\tthis._rules = {\n";
		str += this[_rulesModel](fields);
		str += "\t\t};\n";
		str += "\t}\n\n";

		//get table primary key
		for (var i = 0; i < fields.length; i++) {
			if(fields[i][this._column_key] == constans.option_key_primary){
				key = fields[i][this._column_name];
			}
		}

		str += "\tdataGrid(callback){\n";
		str += "\t\tsuper.findAll(callback);\n";
		str += "\t}\n\n";

		str += "\tdataUpdate(" + key + ", callback){\n";
		str += "\t\tsuper.where({" + key + ": " + key + "});\n";
		str += "\t\tsuper.findOne(callback);\n";
		str += "\t}\n\n";

		str += "\tupdateData(" + key + ", data, callback){\n";
		str += "\t\tsuper.where({" + key + ": " + key + "});\n";
		str += "\t\tsuper.update(data, callback);\n";
		str += "\t}\n\n";

		str += "\ttrashData(" + key + ", callback){\n";
		str += "\t\tsuper.where({" + key + ": " + key + "});\n";
		str += "\t\tsuper.delete(callback);\n";
		str += "\t}\n\n";


		str += "}\n\n";

		str += "module.exports = " + this[_firstLetterUppercase](data.model_name) + ";";

		//call function that creates file
		this[_fileCreator](constans.path_models + data.model_name + ".js", str, callback);
	}

	/*
		data = form data
		callback = return function
	*/
	[_createController](data, callback){
		var str = ""; //auxialiar varibale for returns

		var nameLower = data.controller_name.toLowerCase(); // change all string for lowercase
		var fistUpper = nameLower.charAt(0).toUpperCase() + nameLower.slice(1); //chanse the string fist latler for upercase

		//begin controller body
		str += "var express = require('express');\n";
		str += "var router = express.Router();\n";
		str += "var authentify = require(\"../vendor/authentify\");\n\n";

		str += "router.get('/', function(req, res, next) {\n";
		str += "\tauthentify.beforeRender(res, '" + nameLower + "/index',{\n";
		str += "\t\ttitle:'" + fistUpper + "',\n";
		str += "\t});\n";
		str += "});\n\n";

		str += "module.exports = router;";

		//call function that creates file
		this[_fileCreator](constans.path_controllers + nameLower + ".js", str, function(err){
			if(err){
				this._error = err;
				console.log(err);
			}
		});

		//call function that creates dir views
		this[_dirCreator](constans.path_views + nameLower, function(err){
			if(err)
				this._error = err;
				console.log(err)
		});

		//begin view index body
		str = "extends ../layout/layout\n\n";
		str += "block content\n\n";
		str += "\th3 Hola mundo !";

		//call function that creates file
		this[_fileCreator](constans.path_views + nameLower + "/index.pug", str, callback);

	}

	/*
		data = form data 
		fields = fields selected
		callback = return function
	*/
	[_createControlllerCrud](data, fields, callback){
		var str = "";
		str = "var express = require('express');\n";
		str += "var router = express.Router();\n";
		str += "var " + this[_firstLetterUppercase](data.name) + " = require(\"../models/" + data.name + "\");\n";
		str += "var authentify = require(\"../vendor/authentify\");\n";
		str += "var model = new " + this[_firstLetterUppercase](data.name) + "();\n\n";

		str += "router.get('/', function(req, res, next) {\n";
		str += "\tmodel.dataGrid(function(err, result){\n";
		str += "\t\tauthentify.beforeRender(res, '" + data.name + "/index',{\n";
		str += "\t\t\ttitle:'" + this[_firstLetterUppercase](data.name) + "',\n";
		str += "\t\t\tdatabase: result,\n";
		str += "\t\t\tmodel: model.database\n";
		str += "\t\t});\n";
		str += "\t});\n";
		str += "});\n\n";

		str += "router.get('/nuevo', function(req, res, next) {\n";
		str += "\tauthentify.beforeRender(res, '" + data.name + "/nuevo',{\n";
		str += "\t\ttitle:'Nuevo " + this[_firstLetterUppercase](data.name) + "',\n";
		str += "\t\tmodel: model.database\n";
		str += "\t});\n";
		str += "});\n\n";

		str += "router.post('/nuevo', function(req, res, next) {\n";
		str += "\tmodel.insert(req.body, function(err, result){\n";
		str += "\t\tif(err)\n";
		str += "\t\t\tres.redirect('/" + data.name + "/nuevo');\n";
		str += "\t\tres.redirect('/" + data.name + "');\n";
		str += "\t});\n";
		str += "});\n\n";

		str += "router.get('/modifica/:id', function(req, res, next) {\n";
		str += "\tmodel.dataUpdate(req.params.id, function(err, result){\n";
		str += "\t\tmodel.valuesUpdate = result;\n";
		str += "\t\tauthentify.beforeRender(res, '" + data.name + "/modifica',{\n";
		str += "\t\t\ttitle:'Update " + this[_firstLetterUppercase](data.name) + "',\n";
		str += "\t\t\tmodel: model.database\n"; 
		str += "\t\t});\n";
		str += "\t});\n";
		str += "});\n\n";

		var key;
		//get table primary key
		for (var i = 0; i < fields.length; i++) {
			if(fields[i][this._column_key] == constans.option_key_primary){
				key = fields[i][this._column_name];
			}
		}

		str += "router.post('/modifica', function(req, res, next) {\n";
		str += "\tvar " + key + " = model.database.values." + key + ";\n";
		str += "\tmodel.updateData(model.database.values." + key + ", req.body, function(err, result){\n";
		str += "\t\tif(result)\n";
		str += "\t\t\tres.redirect('/" + data.name + "');\n";
		str += "\t\telse\n";
		str += "\t\t\tres.redirect('/" + data.name + "/modifica/' + model.database.values." + key + ");\n";
		str += "\t});\n";
		str += "});\n";

		str += "router.get('/delete/:id', function(req, res, next) {\n";
		str += "\tmodel.trashData(req.params.id, function(err, result){\n";
		str += "\t\tres.redirect('/" + data.name + "');\n";
		str += "\t});\n";
		str += "});\n\n";

		str += "module.exports = router;\n";

		this[_fileCreator](constans.path_controllers + data.name + ".js", str, callback);
	}

	[_createViewsCrud](data, fields, callback){
		
		var str ="";
		var arrayFields = [];
		var key;

		for(var i = 0; i < fields.length; i++){
			if(fields[i][this._column_key] == constans.option_key_primary){
				key = fields[i][this._column_name];
			}
		}

		this[_dirCreator](constans.path_views + data.name, function(err){
			if(err){
				this._error = err;
				console.log(err)
			}
		});

		str += "extends ../layout/layout\n";
		str += "block content\n\n";
		str += "\ta(href='/" + data.name + "/nuevo' class=\"btn btn-success pull-right\")\n";
		str += "\t\t!= \"Agregar nuevo \"\n";
		str += "\t\ti(class=\"fa fa-plus\")\n\n";

		str += "\t+grid(\n";
		str += "\t\tmodel, \n";
		str += "\t\tdatabase,\n";
		str += "\t\t[\n";

		for(var i = 0; i < fields.length; i++){
			str += "\t\t\t\"" + fields[i][this._column_name] + "\"\n";
		}

		str += "\t\t],\n";
		str += "\t\t[\n";
		str += "\t\t\t{icon: 'fa fa-pencil', label: 'Update', url:'/" + data.name + "/modifica/', params:['" + key + "']},\n";
		str += "\t\t\t{icon: 'fa fa-trash', label: 'Delete', onclick:\"confirmaDelete\", url:'/" + data.name + "/delete/', params:['" + key + "']},\n";
		str += "\t\t]\n";
		str += "\t)\n";

		this[_fileCreator](constans.path_views + data.name + "/index.pug", str, function(err){
			if(err){
				this._error = err;
				console.log(err)
			}
		});

		str = "";

		str += "extends ../layout/layout\n";
		str += "block content\n";
		str += "\tform(method='POST' action='/" + data.name + "/nuevo' class=\"form-horizontal form-label-left\" novalidate)\n";
		str += "\t\tinclude form.pug\n";
		str += "\t\tbutton(type=\"submit\" class=\"btn btn-success pull-right\") Create\n";
		str += "\t\ta(href='/" + data.name + "' class=\"btn btn-primary pull-right\") Cancel\n";

		this[_fileCreator](constans.path_views + data.name + "/nuevo.pug", str, function(err){
			if(err){
				this._error = err;
				console.log(err)
			}
		});

		str = "";

		str += "extends ../layout/layout\n";
		str += "block content\n";
		str += "\tform(method='POST' action='/" + data.name + "/modifica' class=\"form-horizontal form-label-left\" novalidate)\n";
		str += "\t\tinclude form.pug\n";
		str += "\t\tbutton(type=\"submit\" class=\"btn btn-success pull-right\") Modificar\n";
		str += "\t\ta(href='/" + data.name + "' class=\"btn btn-primary pull-right\") Cancel\n";

		this[_fileCreator](constans.path_views + data.name + "/modifica.pug", str, function(err){
			if(err){
				this._error = err;
				console.log(err)
			}
		});

		str = "";

		this[_fileCreator](constans.path_views + data.name + "/form.pug", str, function(err){
			if(err){
				this._error = err;
				console.log(err)
			}
		});

	}

	/*
		str = string for change
	*/
	[_firstLetterUppercase](str){ //auxiliar function that change the string fist latter for uppsercase
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	[_rulesModel](fields){
		var str = ""; //auxiliar variable for text return 

		//type variables rules
		var required = [];
		var text = [];
		var textarea = [];
		var number = [];
		var date = [];
		var time = [];
		var timestamp = [];

		for (var i = 0; i < fields.length; i++) {

			//get required fields
			if(fields[i][this._is_nullable] == constans.option_null_no)
				required.push("this._" + fields[i][this._column_name]);

			//get fields rules
			switch(fields[i][this._data_type]){
				case constans.type_integer: number.push("this._" + fields[i][this._column_name]); break;
				case constans.type_varchar: text.push("this._" + fields[i][this._column_name]); break;
				case constans.type_text: textarea.push("this._" + fields[i][this._column_name]); break;
				case constans.type_timestamp: timestamp.push("this._" + fields[i][this._column_name]); break;
				case constans.type_time: time.push("this._" + fields[i][this._column_name]); break;
				case constans.type_date: date.push("this._" + fields[i][this._column_name]); break;
			}
		}

		//begin body rules
		str += required.length > 0 ? "\t\t\trequired:[" + required.toString() + "],\n" : '';
		str += text.length > 0 ? "\t\t\ttext:[" + text.toString() + "],\n" : '';
		str += textarea.length > 0 ? "\t\t\ttextarea:[" + textarea.toString() + "],\n" : '';
		str += number.length > 0 ? "\t\t\tnumber:[" + number.toString() + "],\n" : '';
		str += date.length > 0 ? "\t\t\tdate:[" + date.toString() + "],\n" : '';
		str += time.length > 0 ? "\t\t\ttime:[" + time.toString() + "],\n" : '';
		str += timestamp.length > 0 ? "\t\t\ttimestamp:[" + timestamp.toString() + "],\n" : '';

		return str;
	}

	/*
		path = file url
		text = file content
		callback = return function
	*/
	[_fileCreator](path, text, callback){
		if(this._error != null){
			callback(this._error);
			this._error = null;
		}else{

			console.log("FileCreator ----------> " + path);

			if(fileSys.existsSync(path)){
				console.log("Exist ! :(");
				fileSys.unlink(path, function (err) {
					if(err)
						callback(err);
					else
						fileSys.appendFile(path, text, function (err) {
							if(err)
								callback(err);
							callback();
						});
				});
			}else{
				console.log("New file ! :)");
				fileSys.appendFile(path, text, function (err) {
					if(err)
						callback(err);
					callback();
				});
			}
		}
	}

	/*
		path = file dir
		callback = return function
	*/
	[_dirCreator](path, callback){

		if(this._error != null){
			callback(this._error);
			this._error = null;
		}else{
			console.log("DirCreator ----------> " + path);
			if(!fileSys.existsSync(path)){
				console.log("New dir ! :) ");
	 			fileSys.mkdirSync(path, function(err){
	 				callback(err);
	 			});
			}else{
				console.log("Exist ! :( ");
				callback();
			}
		}
	}
}

module.exports = Utils;