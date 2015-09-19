var mongoose = require('mongoose');
var dishwasherSchema = new mongoose.Schema({
	brand_name: String,
	model_name: String,
	model_number: String,
	type: String,
	gallons_per_cycle: String,
	energy_factor: String,
	kwh_per_year: String
});

mongoose.model('Dishwasher', dishwasherSchema);

// var clotheswasherSchema = new mongoose.Schema({
// 	brand_name: String;
// 	model_name: String;
// 	model_number: String;
// 	volume_cubic_feet: String;
// 	meets_most_efficient_criteria: boolean;
// });

// var displaysSchema = new mongoose.Schema({
// 	brand_name: String;
// 	model_name: String;
// 	model_number: String;
// 	screen_size: String;
// 	off_mode_pwr_watts: String;
// 	on_mode_pwr_watts: String;
// 	sleep_mode_pwr_watts: String;
// 	panel_tech: String;
// 	backlight_tech: String;
// 	resolution: String;
// });