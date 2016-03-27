(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1880)
		.marker('Immigration to USA', 'driver','.timeline__content--immigration')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(53.408371, -2.991573, undefined, 'Liverpool')
				.add(40.712784, -74.005941, 3, 'New York')
				.build('driver');

		})
		.onLeave(function(){
			route.remove();
		});

}());
