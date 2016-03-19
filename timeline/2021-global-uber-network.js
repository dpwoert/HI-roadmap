(function(){

	var evt = new TimelineEvent(timeline);
	var route, cache;
	var cities = [
		'New York City', 'London','San Francisco','Berlin',
		'Paris','Honolulu','Chicago','Miami','Sao Paolo',
		'Rio De Janeiro','Santiago','Montevideo','Rome',
		'Moskou','München','Tel Aviv','Dubai','Beirut',
		'Nairobi','Lagos','Capetown','Johannesburg','Beijing',
		'Hong Kong','Taipei','Tokyo','Shanghai','Sydney',
		'Melbourne','Mumbai','New Delhi','Bangkok','Singapore',
		'Brisbane'
	];

	var scale = d3.scale.pow().exponent(2).domain([1000,20000]).range([0.1, 100]);

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
		.marker('Uber starts connecting hubs', 'driver')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			var addPoints = function(points){

				points.forEach(function(point, key){

					var cityName = cities.indexOf(point.city) > -1 ? point.city : undefined;

					for(var i = 0 ; i < 2 ; i++){

						if(i > 0){
							cityName = undefined;
						}

						var point2 = points[Math.floor(Math.random() * points.length)];
						var dist = window.tools.distance([point.longitude, point.latitude],[point2.longitude, point2.latitude],'km');
						var height = scale(dist);

						route
							.add(point.latitude, point.longitude, undefined, cityName)
							.add(point2.latitude, point2.longitude, height);

					}


				});

				route.build('driver', 10);

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
