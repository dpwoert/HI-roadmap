(function(){

	var createLabel = function(label, position){

		var fontface = 'Helvetica neue';
		var fontsize = 18 * window.devicePixelRatio;
		var paddingTop = 5 * window.devicePixelRatio;
		var paddingLeft = 10 * window.devicePixelRatio;
		// var spriteAlignment = THREE.SpriteAlignment.topLeft;

		var canvas = document.createElement('canvas');
		canvas.width = 256 * window.devicePixelRatio;
		canvas.height = 256 * window.devicePixelRatio;

		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;

		// get size data (height depends only on font size)
		var metrics = context.measureText( label );
		var textWidth = metrics.width;
		var textHeight = fontsize * 1.4;

		var left = canvas.width / 2 - textWidth / 2 - paddingLeft;
		var top = canvas.height / 2 - textHeight / 2 - paddingTop;

		// background color
		context.fillStyle = "black";
		context.fillRect(left, top,textWidth + paddingLeft * 2,textHeight + paddingTop * 2);

		// label
		context.fillStyle = "white";
		context.fillText( label, left + paddingLeft, canvas.height/2 + paddingTop);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas)
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
		var sprite = new THREE.Sprite( spriteMaterial );
		var ratio = 0.02;
		sprite.scale.set( 256 * ratio, 256 * ratio, 256 * ratio );
		sprite.needsUpdate = true;
		sprite.frustumCulled = false;
		sprite.position.copy(position);

		return sprite;

	}

	var materials = {};
	for(var type in window.colors) {

		var color = window.colors[type];
		materials[type] = {};

		materials[type].line = new THREE.MeshLineMaterial({
			color: color.clone(),
			lineWidth: 0.2,
			opacity: 1,
			transparent: true,
			resolution: new THREE.Vector2( window.innerWidth, window.innerHeight )
		});

		materials[type].bullit = new THREE.MeshBasicMaterial({
			color: color.clone(),
			// shading: THREE.FlatShading
		});

	};

	window.Route = function(world){

		var id = THREE.Math.generateUUID();
		var points = [];
		var curves = [];
		var meshes = [];
		var labels = [];
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

		this.add = function(lat, lon, curveHeight, label){

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

			//label
			if(label){

				var labelPos = new THREE.Vector3(0,0,0).lerp(point, 1 + 0.1);
				var _label = createLabel(label, labelPos);

				meshes.push(_label);
				world.rotated.add(_label);

			}

			//chainable
			return this;
		};

		this.build = function(type){

			type = type || 'driver';

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

				var mesh = new THREE.Mesh( line.geometry, materials[type].line );
				meshes.push(mesh);
				world.rotated.add(mesh);

			});

			points.push(new THREE.Vector3(0,0,0))

			//create bullits
			points.forEach(function(point, key){

				var geometry = new THREE.SphereGeometry( 0.2, 12, 12 );
				var mesh = new THREE.Mesh( geometry, materials[type].bullit );

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
			meshes.forEach(function(mesh){
				world.rotated.remove(mesh);
				mesh.geometry.dispose();
			});

			points = undefined;
			curves = undefined;
			meshes = undefined;

			//chainable
			return this;
		};

	};

}())
