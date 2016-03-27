(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,9,2010)
		.marker('Uber beta starts', 'cars','.timeline__uber-beta')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.774929, -122.419416, 'San Francisco')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}());
