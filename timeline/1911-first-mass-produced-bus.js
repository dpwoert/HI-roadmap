(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1911)
		.marker('first mass produced bus', 'cars')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(51.507351, -0.127758, 'London')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
