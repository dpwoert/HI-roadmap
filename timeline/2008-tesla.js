(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2008)
		.marker('Tesla Roadstar', 'driver')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.441883, -122.143019, 'Palo Alto')
				.build('driver');

		})
		.onLeave(function(){
			route.remove();
		});

}())
