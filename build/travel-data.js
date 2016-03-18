var fs = require('fs');
var turf = require('turf');

//get JSON object from data file
var points = fs.readFileSync(__dirname + '/../data/faces.json');
var world = fs.readFileSync(__dirname + '/../data/world.geojson');
world = JSON.parse(world);
var WO1 = ['United States of America', 'Brazil', 'Belgium', 'France', 'Germany', 'Austria', 'Hungary', 'United Kingdom','China','Greece','Italy','Japan','Liberia','Montenegro','Turkey','Russia','Portugal','Romania','Serbia','Thailand','Bulgaria','Ukraine','Belarus','Estonia','Latvia','Lithuania','Belarus','Poland'];

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

//clean
points.forEach(function(point){

	world.features.forEach(function(feature){

		if(turf.inside(point._center, feature) && WO1.indexOf(feature.properties.name) > -1){
			point.WO1 = true;
			console.log('involved in war war 1: ', feature.properties.name);
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
