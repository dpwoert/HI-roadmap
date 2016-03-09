var fs = require('fs');
var turf = require('turf');

//get JSON object from data file
var points = fs.readFileSync(__dirname + '/../data/faces.json');
points = JSON.parse(points);
var map = fs.readFileSync(__dirname + '/../data/world.geojson');
map = JSON.parse(map);

points.forEach(function(point){

	var inside = false;

	//get center point
	var face = turf.polygon([[
		[point.a.lon, point.a.lat],
		[point.b.lon, point.b.lat],
		[point.c.lon, point.c.lat],
		[point.a.lon, point.a.lat]
	]]);

	var center = turf.centroid(face);

	map.features.forEach(function(feature){

		var _inside = turf.inside(center, feature);
		if(!inside && _inside){
			inside = true;
			console.log('inside of', feature.properties.name);
		}

	});

	point.inside = inside;
	// point.inside = center.geometry.coordinates[0] > 0;
	// console.log('inside', inside);

});

//save again
var data = JSON.stringify(points);
fs.writeFileSync( __dirname + '/../data/map.json', data);
