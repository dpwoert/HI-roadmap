(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1880)
		.marker('Immigration to USA', 'driver')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758)
				.add(40.712784, -74.005941, 3)
				.build();

		})
		.onLeave(function(){
			route.remove();
		});

}())
