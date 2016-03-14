window.Heatmap = function(world){

	var lerp = function(from, to, progress){
		var delta = to - from;
		return from + (delta*progress);
	};

	var getColor = function(input){

		if(input >= 1200){ return new THREE.Color(0.64, 0.44, 0.18); }
		if(input >= 960){ return new THREE.Color(0, 1, 0); }
		if(input >= 720){ return new THREE.Color(0, 0, 1); }
		if(input >= 480){ return new THREE.Color(1.0, 0.04, 0.99); }
		if(input < 480){ return new THREE.Color(1.0, 0.99, 0.0); }
		else { return new THREE.Color(1,1,1); }

	};

	var loader = new THREE.XHRLoader();
	loader.load('data/travel-times.json', function (res) {

		var geometry = new THREE.IcosahedronGeometry( world.radius + 0.4, 6 );
		var material = new THREE.MeshPhongMaterial({
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors,
			transparent: true,
			opacity: 0.4
		});

		var faces = JSON.parse( res );
		var color = new THREE.Color(255,255,255);

		//all are white now
		faces.forEach(function(face, i){
			geometry.faces[i].color.copy(color);
		});

		geometry.colorsNeedUpdate = true;
		var mesh = new THREE.Mesh( geometry, material );
		world.scene.add(mesh);

		var yearRange = d3.scale.linear().domain([1881, 2016]).range([0,1]);

		world.renderManager.pipe('heatmap', function(){

				var now = timeline.now;
				var nowRelative = yearRange(now);

				geometry.faces.forEach(function(face, i){
					var value = lerp( faces[i].travelTime['1881'], faces[i].travelTime['2016'], nowRelative );
					geometry.faces[i].color.copy(getColor(value));
				});

				geometry.colorsNeedUpdate = true;

		});

	});


};
