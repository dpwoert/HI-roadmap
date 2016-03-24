(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2022)
		.marker('Silent supersonic commercial aviation', 'aviation', '.timeline__silent-supersonic')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(37.774929, -122.419416, undefined, 'San Francisco')
				.add(40.712784, -74.005941, 2, 'New york')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
