(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,5,2005)
		.marker('Launch of Google Maps', 'driver','.timeline__google-maps')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.386052, -122.083851, 'Mountain View')
				.build('driver');

		})
		.onLeave(function(){
			route.remove();
		});

}());
