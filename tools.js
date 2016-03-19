window.tools = {

	degreeToVec3: function(lat, lon, alt, rad){

		lat = THREE.Math.degToRad(lat);
		lon = THREE.Math.degToRad(0-lon);

		// rad = np.float64(6378137.0)		# Radius of the Earth (in meters)
		var f = 1.0/298.257223563;  //Flattening factor WGS84 Model
		// alt = rad;
		var cosLat = Math.cos(lat);
		var sinLat = Math.sin(lat);
		var FF	 = Math.pow((1.0-f),2);
		var C	  = 1/Math.sqrt(Math.pow(cosLat,2) + FF * Math.pow(sinLat,2));
		var S	  = C * FF;

		var x = (rad * C + alt)*cosLat * Math.cos(lon);
		var y = (rad * C + alt)*cosLat * Math.sin(lon);
		var z = (rad * S + alt)*sinLat;

		return new THREE.Vector3(x, z, y);
	},

	vec3ToDeg: function(vec3, radius){
		// return {
		// 	lat: Math.atan2(vec3.z, Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y) ),
		// 	lon: Math.atan2(vec3.y, vec3.x)
		// };

		// http://stackoverflow.com/questions/5674149/3d-coordinates-on-a-sphere-to-latitude-and-longitude
		return {
			lat: 90 - (Math.acos(vec3.y / radius)) * 180 / Math.PI,
			lon: ((270 + (Math.atan2(vec3.x , vec3.z)) * 180 / Math.PI) % 360) - 180
		};
	},

	distance: function(from, to, unit){

		//http://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
		var R = 6378.137; // Radius of earth in KM
		var dLat = (to[1] - from[1]) * Math.PI / 180;
		var dLon = (to[0] - from[1]) * Math.PI / 180;
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(from[0] * Math.PI / 180) * Math.cos(to[1] * Math.PI / 180) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;

		switch(unit){

			//nautical miles
			case 'nm':
			case 'nmi':
				return d * 0.539956803;

			//km
			case 'km':
				return d;

			//meters
			case 'm':
			default:
				return d*1000;

		}

		// return d * 1000; // meters

	},

	getDate: function(date){


	}


};
