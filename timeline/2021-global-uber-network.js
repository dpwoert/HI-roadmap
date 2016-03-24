(function(){

	var evt = new TimelineEvent(timeline);
	var route, cache;
	var cities = [
		'New York City', 'London','San Francisco','Berlin',
		'Paris','Honolulu','Chicago','Miami','Sao Paolo',
		'Rio De Janeiro','Montevideo','Rome',
		'Moskou','München','Tel Aviv','Dubai',
		'Nairobi','Lagos','Capetown','Johannesburg','Beijing',
		'Hong Kong','Taipei','Tokyo','Shanghai','Sydney',
		'Mumbai','New Delhi','Bangkok','Singapore',
		'Brisbane','Stockholm','Bogota','Panama','Mexico City'
	];

	var scale = d3.scale.linear().domain([5000,20000]).range([0.1, 75]);

	var loader = new THREE.XHRLoader();
	var load = function(cb){
		loader.load('data/uber.json', function (res) {
			var points = JSON.parse( res );
			cache = points;

			if(cb){
				cb(cache);
			}
		});
	};

	load();

	evt
		.setDate(1,1,2021)
		.marker('Uber starts connecting hubs', 'driver', '.timeline__global-uber-network')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			var addPoints = function(points){

				points.forEach(function(point, key){

					var cityName = cities.indexOf(point.city) > -1 ? point.city : undefined;

					for(var i = 0 ; i < 1 ; i++){

						if(i > 0){
							cityName = undefined;
						}

						var point2 = points[Math.floor(Math.random() * points.length)];
						var dist = window.tools.distance([point.longitude, point.latitude],[point2.longitude, point2.latitude],'km');
						var height = scale(dist);

						window.setTimeout(function(){

							route
							.add(this.point1.latitude, this.point1.longitude, undefined, cityName)
							.add(this.point2.latitude, this.point2.longitude, height);

							if(this.last){
								route.build('driver', 10);
							}

						}.bind({ point1: point, point2: point2, last: key === points.length - 1 }), 0)

					}

				});


			};

			if(!cache){
				load(addPoints);
			} else {
				addPoints(cache);
			}


		})
		.onLeave(function(){
			route.remove();
		});

}())
