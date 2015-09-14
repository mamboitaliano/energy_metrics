var express = require('express');
var router = express.router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyParser.urlencoded( {extended: true} ));
router.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}))

// build GET route for grabbing 'Dishwashers' from the database to display
// build POST route for creating new 'Dishwashers'

router.route('/')
	.get(function(req, res, next) {
		// retrieve all 'dishwashers' from mongo
		mongoose.model('Dishwasher').find({}, function(err, dishwashers) {
			if (err) {
				return console.error(err);
			}
			else {
				// respond to both HTML and JSON
				// JSON response requires 'Accept: application/json;' in Request Header
				res.format({
					// HTML response will render the index.jade file in the views/blobs folder. 
					// We are also setting "dishwashers" to be an accessible variable in our jade view
					html: function() {
						res.render('dishwashers/index', { title: 'All dishwashers', "dishwashers" : dishwashers });
					},
					// JSON responses will show all dishwashers in JSON format
					json: function() {
						res.json(dishwashers);
					}
				});
			}
		});
	})
	.post(function(req, res) {
		// Gets the values from a post request. This can be done through forms or REST calls. They rely on the "name" attribute for forms
		var b_name = req.body.brand_name;
		var m_name = req.body.model_name;
		var m_number = req.body.model_number;
		var m_type = req.body.type;
		var m_gpc = req.body.gallons_per_cycle;
		var m_ef = req.body.energy_factor;
		var m_kpy = req.body.kwh_per_year;

		// this is where we tell mongoose to create the model and assign the above variables to the respective db fields
		mongoose.model('Dishwasher').create( {
			brand_name: b_name;
			model_name: m_name;
			model_number: m_number;
			type: m_type;
			gallons_per_cycle: m_gpc;
			energy_factor: m_ef;
			kwh_per_year: m_kpy;
		}, function(err, dishwasher) {
			// if response not valid, handle error
			if (err) {
				res.send("Couldn't add record to the database");
			}
			// if response is valid, create a dishwasher entry
			else {
				console.log('POST successful. dishwasher entry created: ' + dishwasher);
				res.format( {
					// make HTML response set location and redirect back to home page
					html: function() {
						// if success, set header so address bar doesn't still say /add
						res.location('dishwashers');
						res.redirect('/dishwashers');
					},
					// handle json
					json: function() {
						res.json(dishwasher);
					}
				});
			}
		})
	});

// GET a new Dishwasher page
router.get('/new', function(req, res) {
	res.render('dishwashers/new', { title: 'Add new dishwasher' });
});



