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
		.setDate(1,1,2021)
		.marker('Uber starts connecting hubs', 'driver')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			var addPoints = function(points){

				points.forEach(function(point){

					var cityName = cities.indexOf(point.city) > -1 ? point.city : undefined;

					for(var i = 0 ; i < 3 ; i++){

						if(i > 0){
							cityName = undefined;
						}

						var point2 = points[Math.floor(Math.random()*points.length)];

						route
							.add(point.latitude, point.longitude, undefined, cityName)
							.add(point2.latitude, point2.longitude, 2);

					}


				});

				route.build('driver');

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
