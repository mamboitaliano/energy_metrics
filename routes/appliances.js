var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

router.use(bodyParser.urlencoded( { extended: true }));
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
				// console.log("W T F ---------------");
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
	// POST a new dishwasher
	.post(function(req, res) {
		// Gets the values from a post request. This can be done through forms or REST calls. They rely on the "name" attribute for forms
		var b_name = req.body.b_name;
		var m_name = req.body.m_name;
		var m_number = req.body.m_number;
		var m_type = req.body.m_type;
		var gpc = req.body.gpc;
		var ef = req.body.ef;
		var kpy = req.body.kpy;

		// this is where we tell mongoose to create the model and assign the above variables to the respective db fields
		mongoose.model('Dishwasher').create({
			brand_name : b_name,
			model_name : m_name,
			model_number : m_number,
			type : m_type,
			gallons_per_cycle : gpc,
			energy_factor : ef,
			kwh_per_year : kpy
		},
		function(err, dishwasher) {
			// if response not valid, handle error
			if (err) {
				res.send("Couldn't add record to the database");
			}
			// if response is valid, create a dishwasher entry
			else {
				console.log('POST successful. dishwasher entry created: ' + dishwasher);
				res.format({
					// make HTML response set location and redirect back to home page
					html: function(){
						// if success, set header so address bar doesn't still say /add
						res.location("dishwashers");
						// then forward to success page
						res.redirect("/dishwashers");
					},
					// handle json
					json: function(){
						res.json(dishwasher);
					}
				});
			}
		})
	});

// GET a new Dishwasher page
router.get('/new',  (req, res) {
	res.render('dishwashers/new', { title: 'Add new dishwasher' });
});

// Route middleware to validate :id
router.param('id', function(req, res, next, id) {
	// console.log('making sure that ' + id + ' exists');
	// this finds the ID in the mongo database
	mongoose.model('Dishwasher').findById(id, function (err, dishwasher) {
		// if no dishwasher found for this id, respond with the ol'404
		if (err) {
			console.log(id + ' not found');
			// set the response status to 404
			res.status(404);
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				// handle html
				html: function(){
					next(err);
				},
				// handle json
				json: function(){
					res.json( {message : err.status + ' ' + err} );
				}
			});
		// if a dishwasher IS found for this id, continue
		}
		else {
			// uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            // console.log(blob);
            // once validation is complete, save the new item in the request
			req.id = id;
			// on to the next one
			next();
		}
	});
});

// GET an individual dishwasher item by ID in order to display it
router.route('/:id').get(function(req, res) {
	mongoose.model('Dishwasher').findById(req.id, function (err, dishwasher) {
		if (err) {
			console.log("GET error while retrieving " + err);
		}
		else {
			console.log("GET retrieving ID: " + dishwasher._id);
			res.format({
				// handle HTML
				html: function(){
					res.render('dishwashers/show', {"dishwasher" : dishwasher } );
				},
				// handle JSON
				json: function(){
					res.json(dishwasher);
				}
			});
		}
	});
});

// route to edit/update document through standard web form
// GET the individual dishwasher by mongo ID
router.route('/:id/edit').get(function(req, res) {
	// search for the dishwasher entry within mongodb
	mongoose.model('Dishwasher').findById(req.id, function (err, dishwasher) {
		if (err) {
			// handle error
			console.log('GET error while retrieving ' + err);
		}
		else {
			// return the dishwasher
			console.log('GET retrieved ID ' + dishwasher._id);
			res.format({
				// handle HTML response to render 'edit.jade'
				html: function() {
					res.render('dishwashers/edit', { title: 'Dishwasher' + dishwasher._id, "dishwasher" : dishwasher });
				},
				// handle JSON response by returning JSON output
				json: function() {
					res.json(dishwasher);
				}
			});
		}
	});
})
// PUT route to update a dishwasher by ID
.put(function(req, res) {
	// Get our REST or form values. These rely on the "name" attributes
	var b_name = req.body.brand_name;
	var m_name = req.body.model_name;
	var m_number = req.body.model_number;
	var m_type = req.body.type;
	var m_gpc = req.body.gallons_per_cycle;
	var m_ef = req.body.energy_factor;
	var m_kpy = req.body.kwh_per_year;

	// find the doc by its ID
	mongoose.model('Dishwasher').findById(req.id, function(err, dishwasher) {
		// update entry
		dishwasher.update({
			brand_name : b_name,
			model_name : m_name,
			model_number : m_number,
			type : m_type,
			gallons_per_cycle : m_gpc,
			energy_factor : m_ef,
			kwh_per_year : m_kpy
		},
		function(err, dishwasherID) {
			if(err) {
				// handle error
				res.send("Couldn't update record: " + err);
			}
			else {
				// respond by redirecting back to the page
				res.format({
					// handle HTML response
					html: function() {
						res.redirect("/dishwashers/" + dishwasher._id);
					},
					// handle JSON response
					json: function() {
						res.json(dishwasher);
					}
				});
			}
		})
	});
})

// DELETE route to delete a dishwasher entry by ID
.delete(function(req, res){
	// find dishwasher by id
	mongoose.model('Dishwasher').findById(req.id, function (err, dishwasher) {
		if(err) {
			// if there's an error, print it to the console
			return console.error(err); 
		}
		else {
			// delete it from the Mongo database
			dishwasher.remove(function(err, dishwasher) {
				if(err) {
					return console.error(err);
				}
				else {
					// return a successful deletion message \
					console.log('Removing dishwasher with ID ' + dishwasher._id);
					// respond by redirecting back to the dishwashers page
					res.format({
						// handle HTML response
						html: function(){
							res.redirect('/dishwashers');
						},
						json: function(){
							res.json( {message : 'deleted', 
								item : dishwasher
							});
						}
					});
				}
			});
		}
	});
});


// time to export the routes
module.exports = router;




