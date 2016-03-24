var fs = require('fs');
var turf = require('turf');
var csv = require('dank-csv');

//get JSON object from data file
var points = fs.readFileSync(__dirname + '/../data/faces.json');
var world = fs.readFileSync(__dirname + '/../data/world.geojson');
var uber = fs.readFileSync(__dirname + '/../data/uber.json');
world = JSON.parse(world);
uber = JSON.parse(uber);
var WO1 = ['United States of America', 'Brazil', 'Belgium', 'France', 'Germany', 'Austria', 'Hungary', 'United Kingdom','China','Greece','Italy','Japan','Liberia','Montenegro','Turkey','Russia','Portugal','Romania','Serbia','Thailand','Bulgaria','Ukraine','Belarus','Estonia','Latvia','Lithuania','Belarus','Poland','Croatia','Serbia','India','Pakistan','Bangladesh','Canada','Bulgaria','Slovakia','Czech Republic','Romania','Slovenia','Australia','Ireland','Canada'];
var WO2 = ['Spain','Portugal','Switzerland','Sweden','Mozambique','Angola','Afganistan','Tibet'];
var Oil = ['Netherlands','United States of America','Japan','Canada','United Kingdom','Israel'];
var Oil2 = ['Egypt','Syria','Algeria','Bahrein','United Arab Immirates','Iraq','Kuweit','Libya','Qatar','Tunesia','Saudi Arabia'];
var Oil3 = ['Saudi Arabia','Venezuela','Russia','Nigeria','United States of America','Mexico'];

points = JSON.parse(points);
var retrieve = function(year){

	var map = fs.readFileSync(__dirname + '/../data/travel-times-'+ year +'.geojson');
	map = JSON.parse(map);

	points.forEach(function(point, key){

		var closest = undefined;
		var _closest = undefined;
		var _inside = false;

		point.travelTime = point.travelTime || {};

		//get center point
		var face = turf.polygon([[
			[point.a.lon, point.a.lat],
			[point.b.lon, point.b.lat],
			[point.c.lon, point.c.lat],
			[point.a.lon, point.a.lat]
		]]);

		var center = turf.centroid(face);
		point._center = center;

		map.features.forEach(function(feature){

			var inside = turf.inside(center, feature);

			//inside
			if(inside){
				_inside = true;
				point.travelTime[year] = feature.properties.travelTime;
			}

			//see if this point is closer
			feature.geometry.coordinates[0].forEach(function(coord){

				var distance = turf.distance(center, turf.point(coord));

				if(!closest || distance < closest){
					closest = distance;
					_closest = feature;
				}

			});

		});

		if(!_inside){
			point.travelTime[year] = _closest.properties.travelTime;
		}

		point.center = center.geometry.coordinates;
		console.log('done for gridpoint ' + key + ' of ' + points.length + ' for year ' + year);

	});

};

retrieve(1881);
retrieve(2016);

console.log(csv);

//clean
points.forEach(function(point){

	world.features.forEach(function(feature){

		if(turf.inside(point._center, feature) && WO1.indexOf(feature.properties.name) > -1){
			point.WO1 = true;
			console.log('involved in war war 1: ', feature.properties.name);
		}

		if(turf.inside(point._center, feature) && WO2.indexOf(feature.properties.name) === -1){
			point.WO2 = true;
			console.log('involved in war war 2: ', feature.properties.name);
		}

		if(turf.inside(point._center, feature) && Oil.indexOf(feature.properties.name) > -1){
			point.oil = true;
			console.log('involved in oil crisis: ', feature.properties.name);
		}
		if(turf.inside(point._center, feature) && Oil2.indexOf(feature.properties.name) > -1){
			point.oil2 = true;
			console.log('involved in oil crisis: ', feature.properties.name);
		}
		if(turf.inside(point._center, feature) && Oil3.indexOf(feature.properties.name) > -1){
			point.oil3 = true;
			console.log('involved in oil crisis 2003: ', feature.properties.name);
		}

	});

	delete point._center;
	delete point.a;
	delete point.b;
	delete point.c;
});

//save again
var data = JSON.stringify(points);
fs.writeFileSync( __dirname + '/../data/travel-times.json', data);
