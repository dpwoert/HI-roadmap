(function(){

	var evt = new TimelineEvent(timeline);
	var scene = new THREE.Scene();
	var meshes = [];
	var coordsLon = [90,-90];
	var coordsLat = [-180,180];

	var rangeLon = d3.scale.linear().domain([1, 5]).range(coordsLon);
	var rangeLat = d3.scale.linear().domain([1, 5]).range(coordsLat);

	var material = new THREE.MeshBasicMaterial({
		color: colors.driver.clone(),
		// shading: THREE.FlatShading
	});

	evt
		.setDate(1,12,1993)
		.marker('GPS available for public use', 'driver','.timeline__gps')
		.onActive(function(world){

			for( var x = 1 ; x < 6 ; x++){
				for( var y = 1 ; y < 6 ; y++){

					var lat = rangeLon(x);
					var lon = rangeLat(y);
					var point = tools.degreeToVec3(lat, lon, 6, world.radius);

					var geometry = new THREE.SphereGeometry( 0.2, 12, 12 );
					var mesh = new THREE.Mesh( geometry, material );

					//set position
					mesh.position.copy(point);

					//add to lists
					scene.add(mesh);
					meshes.push(mesh);

				}
			}

			world.scene.add(scene);

		})
		.onUpdate(function(){
			scene.rotation.x += 0.005;
			scene.rotation.y -= 0.005;
		})
		.onLeave(function(world){

			meshes.forEach(function(mesh){
				scene.remove(mesh);
				mesh.geometry.dispose();
			});

			world.scene.remove(scene);

		});

}())
