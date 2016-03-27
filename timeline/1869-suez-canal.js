(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(18,11,1869)
		.marker('Suez canal', 'driver', '.timeline__content--suez-canal')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(30.510583, 32.445309, 'Suez Canal')
				.build();

		})
		.onLeave(function(){
			route.remove();
		});

}());
