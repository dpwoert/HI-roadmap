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

	evt
		.setDate(1,8,2019)
		.marker('Uber start with self driving cars', 'cars')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			var addPoints = function(points){

				points.forEach(function(point){

					var cityName = cities.indexOf(point.city) > -1 ? point.city : undefined;

					route
						.addPoint(point.latitude, point.longitude, cityName);

				});

				route.build('cars');

			};

			if(!cache){

				var loader = new THREE.XHRLoader();
				loader.load('data/uber.json', function (res) {
					var points = JSON.parse( res );
					cache = points;
					addPoints(cache);
				});

			} else {
				addPoints(cache);
			}


		})
		.onLeave(function(){
			route.remove();
		});

}())
