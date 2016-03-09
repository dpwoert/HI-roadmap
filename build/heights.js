var fs = require('fs');
var hgt = require('node-hgt');

//get JSON object from data file
var points = fs.readFileSync(__dirname + '/../data/vertices.json');
points = JSON.parse(points);

//do for all points
var tileDownloader = new hgt.ImagicoElevationDownloader(__dirname + '/../data/heights/');
var tileset = new hgt.TileSet(__dirname + '/../data/heights/', {downloader:tileDownloader});

points.forEach(function(point){

	// point = [Math.abs(point.lon), Math.abs(point.lat)];
	point = [point.lon, point.lat];
	// point = [-50,50];

	if(point[1] > 50){
		// return false;
	}

	tileset.getElevation(point, function(err, elevation) {
		if (err) {
			// console.trace('getElevation failed: ' + err.message, this.point);
		} else {
			console.log('elevation', elevation, this.point);
		}
	}.bind({point: point}));

})
