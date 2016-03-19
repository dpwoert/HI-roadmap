(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,5,2010)
		.marker('Uber beta starts', 'driver')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.774929, -122.419416, 'San Francisco')
				.build('driver');

		})
		.onLeave(function(){
			route.remove();
		});

}())
