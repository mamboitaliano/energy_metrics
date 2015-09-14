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
		var brand_name = req.body.brand_name;
		var model_name = req.body.model_name;
		var model_number = req.body.model_number;
		var type = req.body.type;
		var gallons_per_cycle = req.body.gallons_per_cycle;
		var energy_factor = req.body.energy_factor;
		var kwh_per_year = req.body.kwh_per_year;
	})