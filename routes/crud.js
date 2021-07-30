var express = require('express');
var router = express.Router();
const constans = require('../vendor/constants.js');
var Crud = require("../models/crud");
const model = new Crud();


/* GET home page. */
router.get('/', function(req, res, next) {
	model.getTables(function(err, result){
		res.render('crud/index', {
			tables: result, 
			row: 'Tables_in_' + constans.mysql_database,
			alert: message
		});	

		if(message != null)
			message = null;
	});
	
});

router.post('/generatorModel', function(req, res, next){

	model.getColums(req.body.table_name, function(err, result){
		if(!err)
			if(result.length < 1){
				message = { 
					title: 'Oops...',
					text: "Something went wrong!!",
	  				type: 'error'
				};
				res.redirect('/crud');
			}else{
				model.renderModel(req.body, result, function(err){
					if(err){
						message = { 
							title: 'Oops...',
							text: "Something went wrong!!",
			  				type: 'error'
						};
					}else{
						message = { 
							title: 'Yeah !! :) ',
							text: "Model created !!",
			  				type: 'success'
						};

						res.redirect('/crud');
					}
				});
			}
		else{
			message = { 
					title: 'Oops...',
					text: "Something went wrong!!",
	  				type: 'error'
				};

			res.redirect('/crud');
		}
	});
});

router.post('/generatorController', function(req, res, next){
	model.renderController(req.body, function(err){
		if(err){
			message = { 
				title: 'Oops...',
				text: "Something went wrong!!",
  				type: 'error'
			};
		}else{
			message = { 
				title: 'Yeah !! :) ',
				text: "Controller created !!",
  				type: 'success'
			};

			res.redirect('/crud');
		}
	});
});

router.post('/generator', function(req, res, next){

	model.getColums(req.body.table, function(err, result){
		if(!err)
			if(result.length < 1){
				message = { 
					title: 'Oops...',
					text: "Something went wrong!!",
	  				type: 'error'
				};
				res.redirect('/crud');
			}else{
				model.renderCrud(req.body, result, function(err){
					if(err){
						message = { 
							title: 'Oops...',
							text: "Something went wrong!!",
			  				type: 'error'
						};
					}else{
						message = { 
							title: 'Yeah !! :) ',
							text: "Model created !!",
			  				type: 'success'
						};

						res.redirect('/crud');
					}
				});
			}
		else{
			message = { 
					title: 'Oops...',
					text: "Something went wrong!!",
	  				type: 'error'
				};

			res.redirect('/crud');
		}
	});
});

module.exports = router;