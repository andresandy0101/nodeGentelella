var express = require('express');
var router = express.Router();
var model = require("../models/register_model");
var modelLogin = require("../models/login_model");
var crypto = require("../vendor/crypto");


/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Express' , alert: message});

	if(message != null)
		message = null;
});

router.post('/access', function(req, res, next){
	req.body.g01_password = crypto.encrypt(req.body.g01_password);
	modelLogin.access(req.body, function(err, result){
		if(err){
			res.redirect('/login');
			message = { 
				title: 'Oops...',
				text: 'Something went wrong!!',
  				type: 'error'
			};
		}
		else
			if(result.length > 0)
				res.redirect('/');
			else{
				res.redirect('/login');
				message = { 
					title: 'Oops...',
					text: "User doesn't exist !!",
	  				type: 'error'
				};
			}
	});
});

router.post('/register', function(req, res, next){
	req.body.g01_password = crypto.encrypt(req.body.g01_password);
	model.signup(req.body, function(err, result){
		if(err){
			res.redirect('/login#signup');
			message = { 
				title: 'Oops...',
				text: 'Something went wrong!!',
  				type: 'error'
			};
		}
		else
			res.redirect('/login');
	});
});

module.exports = router;
