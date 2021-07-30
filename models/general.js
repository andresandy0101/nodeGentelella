"use strict";

const Mysql = require('../vendor/mysql');
const _  = require('lodash');
const _attributes = Symbol('attributes');
const _validation = Symbol('validation');

class General extends Mysql{

	constructor(){	
		super();

		this._table_name = 't01_general';
		this._t01_id = 't01_id';
		this._t01_text = 't01_text';
		this._t01_area = 't01_area';
		this._t01_number = 't01_number';
		this._t01_password = 't01_password';
		this._t01_email = 't01_email';
		this._t01_date = 't01_date';
		this._t01_time = 't01_time';
		this._t01_timestamp = 't01_timestamp';

		this[_attributes]();
		this[_validation]();
	}

	[_attributes](){
		
		this._attributes = {
			t01_id : 'ID',
			t01_text : 'Texto',
			t01_area: 'Text area',
			t01_number : 'Numerico',
			t01_password : 'Contraseña',
			t01_email : 'Correo electronico',
			t01_date : 'Date',
			t01_time: 'Time', 
			t01_timestamp: 'Full date'
		};
	}

	[_validation](){

		this._rules = {
			required: [this._t01_id, this._t01_number, this._t01_text, this._t01_password, this._t01_email,this._t01_date],
			text: [this._t01_text],
			textarea: [this._t01_area],
			password: [this._t01_password],
			email: [this._t01_email],
			number: [this._t01_id, this._t01_number],
			date: [this._t01_date],
			time: [this._t01_time],
			timestamp: [this._t01_timestamp]
		};
	}

	dataGrid(callback){
		super.findAll(callback);
	}

	dataUpdate(t01_id, callback){
		super.where({t01_id: t01_id});
		super.findOne(callback);
	}

	updateData(t01_id, data, callback){
		super.where({t01_id: t01_id});
		super.update(data, callback);
	}

	trashData(t01_id, callback){
		super.where({t01_id: t01_id});
		super.delete(callback);
	}
}

module.exports = General;
//exports.model = new General();