var map, background, drawnItems, image, f0, f1;
var options = {
	map: '1881',
	legends: [],
	value: ''
};

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

var getShapeColor = function(color){

	switch(color){
		case 'green': return '#1cb83a';
		case 'brown': return '#7e6026';
		case 'pink': return '#e90fb1';
		case 'yellow': return '#dfdd2f';
		case 'blue': return 'rgb(16, 106, 180)';
		default: return '#ffffff';
	}

};

var openGeoJSON = function(evt){

	var reader = new FileReader();
	var file = evt.target.files[0];

	reader.onload = function(){

		var geo = JSON.parse(reader.result);
		var layers = L.geoJson(geo, {
			style: function(feature) {
				return {color: getShapeColor(feature.properties.color)};
			}
		});

		layers.eachLayer(function(layer){
			// layer.color = layer.feature.properties.color;
			layer.travelTime = layer.feature.properties.color;
			layer.addTo(drawnItems);
		});
	};

	// Read in the image file as a data URL.
	reader.readAsText(file);

};

options.loadFile = function(){

	var picker = document.querySelector('#filepicker');
	picker.style.display = 'block';

	picker.click();
	picker.addEventListener('change', openGeoJSON, false);

	// picker.style.display = 'none';

};


options.load = function(){

	if(image){
		background.removeLayer(image);
	}

	switch(options.map){

		case '1881':

			var imageBounds = [[70,-160], [-40,180]];
			var url = '../../data/maps/Isochronic_Passage_Chart_Francis_Galton_1881.jpg';
			image = L.imageOverlay(url, imageBounds).addTo(background);
			// image.setOpacity(0.5);

			options.legends = ['choose', 'green', 'yellow', 'pink', 'blue', 'brown'];
			options.legendValues = [0, 24*10, 20*24, 30*24, 40*24, 50*24];

		break;

		case '2016':

			var imageBounds = [[78.75,-180], [-60,180]];
			var url = '../../data/maps/world-map-isochronic-2016-v2.jpg';
			image = L.imageOverlay(url, imageBounds).addTo(background);
			// image.setOpacity(0.4);

			options.legends = ['choose', 'dark-red', 'red', 'light-red', 'yellow', 'green', 'dark-blue', 'blue'];
			options.legendValues = [0, 12, 18, 24, 36, 48];

		break;

	}

	for (var i in f1.__controllers) {
		f1.__controllers[i].updateDisplay();
		if(f1.__controllers[i].property === 'value'){
			f1.__controllers[i].remove();
			delete f1.__controllers[i];
		}

	}

	f1.add(options, 'value', options.legends).name('value').onFinishChange(options.change);

};
options.save = function(){

	var geo = drawnItems.toGeoJSON();
	var layers = drawnItems.getLayers();

	//get properties
	layers.forEach(function(layer, key){

		var index = options.legends.indexOf(layer.travelTime);
		geo.features[key].properties.color = layer.travelTime;
		geo.features[key].properties.travelTime = options.legendValues[index];

	})

	saveFile(geo, 'travel-times-'+ options.map +'.geojson');
};

var start = function(){

	var mapEl = document.querySelector('.map');

	//create container
	map = L
			.map(mapEl)
			.setView([20,0], 3);

	//add tile layer
	var scale = window.devicePixelRatio > 1 ? '@2x' : '';
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}'+scale+'.png?access_token={accessToken}', {
			attribution: '',
			id: 'dpwoert.map-7fihcchk',
			accessToken: 'pk.eyJ1IjoiZHB3b2VydCIsImEiOiJOSF9GWUZvIn0.Y7PPbCkmFpSCAj7ew_ppwQ',
			zoomControl: false,
			// detectRetina: true
		}).addTo(map);

	// Initialise the FeatureGroup to store editable layers
	background = new L.FeatureGroup();
	map.addLayer(background);

	// Initialise the FeatureGroup to store editable layers
	drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	// Initialise the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		edit: {
  			featureGroup: drawnItems
		}
	});
	map.addControl(drawControl);

	map.on('draw:created', function(event) {
		var layer = event.layer;

		//save legend value
		layer.travelTime = options.value;

		//get color
		layer.options.color = getShapeColor(options.value);
		drawnItems.addLayer(layer);

	});

	//add DATGUI
	var gui = new dat.GUI();

	f0 = gui.addFolder('Map');
	f1 = gui.addFolder('Readings');

	f0.add(options, 'map', ['1881', '1906','1914','1920','2016']).name('year');
	f0.add(options, 'load').name('change map')
	f0.add(options, 'loadFile').name('load map')
	f0.add(options, 'save').name('save map')

	f1.add(options, 'value', options.legends).name('value');

	options.load();

	map.invalidateSize()

};

document.addEventListener("DOMContentLoaded", start);
