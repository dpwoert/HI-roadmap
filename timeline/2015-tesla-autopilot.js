(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2015)
		.marker('Tesla Autopilot', 'cars', '.timeline__tesla-autopilot')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.441883, -122.143019, 'Palo Alto')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
