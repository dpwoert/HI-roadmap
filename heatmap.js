(function(){

	window.Heatmap = function(world){

		var run;

		var lerp = function(from, to, progress){
			var delta = to - from;
			return from + (delta*progress);
		};

		var colorScales = {
			day: d3.scale.linear().domain([0, 24]).range(['#14d62e','#61b680']),
			ten: d3.scale.linear().domain([24, 24 * 10]).range(['#ff0000','#e87a7a']),
			twenty: d3.scale.linear().domain([24 * 10, 24 * 30]).range(['#f7b7e3','#f904e0']),
			big: d3.scale.linear().domain([24 * 30, 24 * 50]).range(['#06d2ff','#81b8d2'])
		};

		var getColor = function(input){

			// if(input >= 1200){ return new THREE.Color(0.64, 0.44, 0.18); }
			// if(input >= 960){ return new THREE.Color(0, 1, 0); }
			// if(input >= 720){ return new THREE.Color(0, 0, 1); }
			// if(input >= 480){ return new THREE.Color(1.0, 0.04, 0.99); }
			// if(input < 480){ return new THREE.Color(1.0, 0.99, 0.0); }
			// else { return new THREE.Color(1,1,1); }

			var color;

			//day range
			if(input < 24){
				color = colorScales.day(input);
			}
			//1-10 day range
			else if(input > 24 && input <= 10 * 24){
				color = colorScales.ten(input);
			}
			//10-30 day range
			else if(input > 10 * 24 && input <= 30 * 24){
				color = colorScales.twenty(input);
			}
			//long range
			else if(input > 24 * 30){
				color = colorScales.big(input);
			}

			return new THREE.Color(color);

		};

		var material = new THREE.MeshPhongMaterial({
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors,
			transparent: true,
			opacity: 0.5
		});

		var loader = new THREE.XHRLoader();
		loader.load('data/travel-times.json', function (res) {

			var geometry = new THREE.IcosahedronGeometry( world.radius + 0.4, 6 );

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

			var j = 0;
			var steps = 5;

			world.renderManager.pipe('heatmap', function(){

				var now = timeline.now;
				var nowRelative = yearRange(now);


				if(now > 1914 && now < 1919){

					geometry.faces.forEach(function(face, i){
						var war = faces[i].WO1;
						// war = Math.random() > 0.5;
						var color = war ? window.colors.driver : window.colors.empty;
						geometry.faces[i].color.copy(color);
					});

					material.opacity = 0.3;

				}
				else if(now > 1939 && now < 1945){

					geometry.faces.forEach(function(face, i){
						var war = faces[i].WO2;
						// war = Math.random() > 0.5;
						var color = war ? window.colors.driver : window.colors.empty;
						geometry.faces[i].color.copy(color);
					});

					material.opacity = 0.3;

				}
				else if(now >= 1973 && now < 1974){

					geometry.faces.forEach(function(face, i){
						var oil = faces[i].oil;
						var oil2 = faces[i].oil2;
						// war = Math.random() > 0.5;
						var color = oil ? window.colors.driver : window.colors.empty;
						color = oil2 ? window.colors.rail : color;
						geometry.faces[i].color.copy(color);
					});

					material.opacity = 0.3;

				}
				else if(now >= 2003 && now < 2004){

					geometry.faces.forEach(function(face, i){
						var oil = faces[i].oil3;
						var color = oil ? window.colors.driver : window.colors.empty;
						geometry.faces[i].color.copy(color);
					});

					material.opacity = 0.3;

				}
				else {

					material.opacity = run ? 0.3: 0;

					if(!run){
						return false;
					}

					for( var i = j ; i < geometry.faces.length ; i+=steps ){

						var face = geometry.faces[i];
						var value = lerp( faces[i].travelTime['1881'], faces[i].travelTime['2016'], nowRelative );
						// var value = faces[i].travelTime['1881'];
						geometry.faces[i].color.copy(getColor(value));

					}

					j++;
					j = j > steps ? 0 : j;

				}


				geometry.colorsNeedUpdate = true;

			});

		});

		this.show = function(_run){
			run = _run
		};


	};

}());
