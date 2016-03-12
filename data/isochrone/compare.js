var left, right, image, markerLeft,markerRight, f0, f1;
var options = {
	map: '1881',
	legends: [],
	value: ''
};
var points = [];
var pointer = 0;

var saveFile = function(data, filename){

	if(!filename) {
		filename = 'data.json';
	}

	data = JSON.stringify(data);

	var blob = new Blob([data], {type: 'application/json'}),
	e    = document.createEvent('MouseEvents'),
	a    = document.createElement('a');

	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl =  ['application/json', a.download, a.href].join(':');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);

};

var pointTo = function(lat, lon){

	if(markerLeft){
		left.removeLayer(markerLeft);
		right.removeLayer(markerRight);
	}

	var geo = new L.LatLng(lat, lon);
	markerLeft = L.marker(geo);
	markerRight = L.marker(geo);
	markerLeft.addTo(left);
	markerRight.addTo(right);

	left.panTo(geo);
	right.panTo(geo);

};

options.setPoint = function(i){

	pointer = i;
	pointTo(points[pointer].center[0], points[pointer].center[1]);

};

options.next = function(){
	var next = pointer + 1 === points.length ? 0 : (pointer + 1);
	options.setPoint(pointer + 1);
}
options.previous = function(){
	var previous = pointer === 0 ? points.length - 1 : pointer - 1;
	options.setPoint(previous);
}

options.change = function(){
	points[pointer][options.map] = options.value;
};

options.load = function(){

	if(image){
		left.removeLayer(image);
	}
	if(markerLeft){
		left.removeLayer(markerLeft);
		right.removeLayer(markerRight);
	}

	switch(options.map){

		case '1881':

			var imageBounds = [[70,-160], [-40,180]];
			var url = '../../data/maps/Isochronic_Passage_Chart_Francis_Galton_1881.jpg';
			image = L.imageOverlay(url, imageBounds).addTo(left);

			options.legends = ['choose','green', 'yellow', 'pink', 'blue', 'brown'];

			var loader = new THREE.XHRLoader();
			loader.load('../map.json', function (res) {

				points = JSON.parse(res);
				options.setPoint(0);

			});

		break;

	}

	for (var i in f1.__controllers) {
		f1.__controllers[i].updateDisplay();
		if(f1.__controllers[i].property === 'value'){
			f1.__controllers[i].remove();
		}

	}

	f1.add(options, 'value', options.legends).name('value').onFinishChange(options.change);

};
options.save = function(){
	saveFile(points, 'travel-times.json');
};

var start = function(){

	var leftEl = document.querySelector('.map--left');
	var rightEl = document.querySelector('.map--right');

	left = L
			.map(leftEl)
			.setView([0,0], 3);
	right = L
			.map(rightEl)
			.setView([0,0], 3);

	var scale = window.devicePixelRatio > 1 ? '@2x' : '';

	var tiles = L
		.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}'+scale+'.png?access_token={accessToken}', {
			attribution: '',
			id: 'dpwoert.map-7fihcchk',
			accessToken: 'pk.eyJ1IjoiZHB3b2VydCIsImEiOiJOSF9GWUZvIn0.Y7PPbCkmFpSCAj7ew_ppwQ',
			zoomControl: false,
			// detectRetina: true
		})
	// tiles.addTo(left);
	tiles.addTo(right);

	//add DATGUI
	var gui = new dat.GUI();

	f0 = gui.addFolder('Map');
	f1 = gui.addFolder('Readings');

	f0.add(options, 'map', ['1881', '1906','1914','1920','2016']).name('year');
	f0.add(options, 'load').name('change map')
	f0.add(options, 'save').name('save map')

	f1.add(options, 'value', options.legends).name('value').onFinishChange(options.change);
	f1.add(options, 'next').name('next');
	f1.add(options, 'previous').name('previous');

	//set london as initial view
	pointTo(51.507351, -0.127758);
	options.load();

	window.setTimeout(left.invalidateSize);
	window.setTimeout(right.invalidateSize);

};

document.addEventListener("DOMContentLoaded", start);
