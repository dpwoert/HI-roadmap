(function(){

	var exporter = {};

	var getVertex = function(geometry, i){
		return geometry.vertices[i];
	};

	var degreeToVec3 = function(lat, lon, alt, rad){

		lat = THREE.Math.degToRad(lat);
		lon = THREE.Math.degToRad(lon);

		// rad = np.float64(6378137.0)        # Radius of the Earth (in meters)
	    var f = 1.0/298.257223563;  //Flattening factor WGS84 Model
		// alt = rad;
	    var cosLat = Math.cos(lat)
	    var sinLat = Math.sin(lat)
	    var FF     = Math.pow((1.0-f),2);
	    var C      = 1/Math.sqrt(Math.pow(cosLat,2) + FF * Math.pow(sinLat,2))
	    var S      = C * FF

	    var x = (rad * C + alt)*cosLat * Math.cos(lon)
	    var y = (rad * C + alt)*cosLat * Math.sin(lon)
	    var z = (rad * S + alt)*sinLat

	    return new THREE.Vector3(x, y, z);
	};

	var vec3ToDeg = function(vec3, radius){
		// return {
		// 	lat: Math.atan2(vec3.z, Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y) ),
		// 	lon: Math.atan2(vec3.y, vec3.x)
		// };

		// http://stackoverflow.com/questions/5674149/3d-coordinates-on-a-sphere-to-latitude-and-longitude
		return {
			lat: 90 - (Math.acos(vec3.y / radius)) * 180 / Math.PI,
			lon: ((270 + (Math.atan2(vec3.x , vec3.z)) * 180 / Math.PI) % 360) - 180
		};
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

	exporter.vertices = function(){

		if(!window._geom){
			console.error('no geometry to export');
			return false;
		}

		//shortcut
		var geometry = window._geom;
		var radius = window._radius;
		var points = [];

		//get all vertices
		geometry.vertices.forEach(function(vertex){

			points.push( vec3ToDeg(vertex, radius) );

		});

		console.log('exported', points);
		saveFile(points, 'vertices.json');

	};

	exporter.faces = function(){

		if(!window._geom){
			console.error('no geometry to export');
			return false;
		}

		//shortcut
		var geometry = window._geom;
		var radius = window._radius;
		var faces = [];

		//get all vertices
		geometry.faces.forEach(function(face){

			var _face = {};
			_face.a = vec3ToDeg(getVertex(geometry, face.a), radius);
			_face.b = vec3ToDeg(getVertex(geometry, face.b), radius);
			_face.c = vec3ToDeg(getVertex(geometry, face.c), radius);

			faces.push( _face );

		});

		console.log('exported', faces);
		saveFile(faces, 'faces.json');


	};

}());
