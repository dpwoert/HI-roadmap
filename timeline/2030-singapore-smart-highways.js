(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,6,2030)
		.marker('Smart charging highways', 'cars')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(1.352083, 103.819836, 'Singapore')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
