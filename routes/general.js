var express = require('express');
var router = express.Router();
var General = require("../models/general");
var authentify = require("../vendor/authentify");
var model = new General();

router.get('/', function(req, res, next) {
	model.dataGrid(function(err, result){
		authentify.beforeRender(res, 'general/index',{
			title:'General', 
			database: result,
			model: model.database
		});
	});
});

router.get('/nuevo', function(req, res, next) {
	authentify.beforeRender(res, 'general/nuevo',{
		title:'Nuevo General',
		model: model.database
	});
});

router.post('/nuevo', function(req, res, next) {
	model.insert(req.body, function(err, result){
		if(err)
			res.redirect('/general/nuevo');	
		res.redirect('/general');
	});
	
});

router.get('/modifica/:id', function(req, res, next) {
	model.dataUpdate(req.params.id, function(err, result){
		model.valuesUpdate = result;
		authentify.beforeRender(res, 'general/modifica',{
			title:'Update General',
			model: model.database
		});
	});
});

router.post('/modifica', function(req, res, next) {
	
	var t01_id = model.database.values.t01_id;

	model.updateData(model.database.values.t01_id, req.body, function(err, result){
		if(result)
			res.redirect('/general');
		else
			res.redirect('/general/modifica/' + model.database.values.t01_id);
	});

});

router.get('/delete/:id', function(req, res, next) {
	model.trashData(req.params.id, function(err, result){
		res.redirect('/general');
	});
});

module.exports = router;