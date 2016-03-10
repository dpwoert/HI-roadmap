var lineMaterial = new THREE.MeshLineMaterial({
	color: new THREE.Color(1,0,0),
	lineWidth: 0.2,
	opacity: 1,
	transparent: true,
	resolution: new THREE.Vector2( window.innerWidth, window.innerHeight )
});

var bullitMaterial = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	// shading: THREE.FlatShading
});

window.Route = function(world){

	var id = THREE.Math.generateUUID();
	var points = [];
	var curves = [];
	var meshes = [];
	var useTracking = false;
	var trackSpeed = 0;

	var getPrevious = function(){
		if(points.length > 0){
			return points[points.length - 1].clone();
		} else {
			return new THREE.Vector3();
		}
	};

	var addCurve

	this.add = function(lat, lon, curveHeight){

		var previous = getPrevious();
		var point = tools.degreeToVec3(lat, lon, 0.3, world.radius);
		points.push(point);

		//curve to somewhere
		if(curveHeight){

			var center = previous.clone().lerp(point, 0.5);
			center = new THREE.Vector3(0,0,0).lerp(center, 1 + (curveHeight/10));

			var curve = new THREE.QuadraticBezierCurve3(previous, center, point);
			curves.push(curve);
		}

		//chainable
		return this;
	};

	this.build = function(color){

		//create lines
		curves.forEach(function(curve){

			var allPoints = curve.getPoints(30);
			var geometry = new THREE.Geometry();
			geometry.vertices = allPoints;
			geometry.verticesNeedUpdate = true;
			geometry.lineDistancesNeedUpdate = true;

			//create line
			var line = new THREE.MeshLine();
			line.setGeometry( geometry );

			var mesh = new THREE.Mesh( line.geometry, lineMaterial );
			meshes.push(mesh);
			world.rotated.add(mesh);

		});

		points.push(new THREE.Vector3(0,0,0))

		//create bullits
		points.forEach(function(point, key){

			var material = bullitMaterial;

			if(key == 0){
				material = bullitMaterial.clone();
				material.color = new THREE.Color(0,0,1);
			}

			var geometry = new THREE.SphereGeometry( 0.2, 12, 12 );
			var mesh = new THREE.Mesh( geometry, material );

			//set position
			mesh.position.copy(point);

			meshes.push(mesh);
			world.rotated.add(mesh);

		});

	};

	this.track = function(speed){
		useTracking = true;
		trackSpeed = speed;

		//add to list

		//chainable
		return this;
	};

	this.update = function(){

	};

	this.remove = function(){

	};

};
