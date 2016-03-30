(function(){

	window.Heatmap = function(world){

		var run;

		var lerp = function(from, to, progress){
			var delta = to - from;
			return from + (delta*progress);
		};

		var colorScales = {
			halfday: d3.scale.linear().domain([0, 12]).range(['#80e557','#54d126']),
			day: d3.scale.linear().domain([12, 24]).range(['#56e2a2','#28ce86']),
			twodays: d3.scale.linear().domain([24, 48]).range(['#4ee5e5','#29c8cc']),
			week: d3.scale.linear().domain([48, 7*24]).range(['#57afe5','#2b87cc']),
			twoweeks: d3.scale.linear().domain([7*24,14*24]).range(['#566be8','#2e3dcc']),
			thirtydays: d3.scale.linear().domain([14*24,30*24]).range(['#c652e2','#ae2fcc']),
			fourtydays: d3.scale.linear().domain([30*24,40*24]).range(['#e856c3','#cc329d']),
			big: d3.scale.linear().domain([40*24,50*24]).range(['#e56161','#cc3333']),
		};

		var getColor = function(input){

			var color;

			if(input < 12){
				// color = colorScales.halfday(input);
				return new THREE.Color(0x54d126);
			}
			else if(input > 12 && input <= 24){
				// color = colorScales.day(input);
				return new THREE.Color(0x28ce86);
			}
			else if(input > 24 && input <= 48){
				// color = colorScales.twodays(input);
				return new THREE.Color(0x29c8cc);
			}
			else if(input > 48 && input <= 24*7){
				// color = colorScales.week(input);
				return new THREE.Color(0x2b87cc);
			}
			else if(input > 24*7 && input <= 24*14){
				// color = colorScales.twoweeks(input);
				return new THREE.Color(0x2e3dcc);
			}
			else if(input > 24*14 && input <= 24*30){
				// color = colorScales.thirtydays(input);
				return new THREE.Color(0xae2fcc);
			}
			else if(input > 24*30 && input <= 24*40){
				// color = colorScales.fourtydays(input);
				return new THREE.Color(0xcc329d);
			}
			//long range
			else {
				// color = colorScales.big(input);
				return new THREE.Color(0xcc3333);
			}

			// return new THREE.Color(color);

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
						if(isNaN(value)){
							debugger
						}
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
