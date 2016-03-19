(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2028)
		.marker('First Hyperloop track', 'rail')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(37.774929, -122.419416, undefined, 'San Francisco', 0.15)
				.add(34.052234, -118.243685, 1, 'Los Angeles')
				.build('rail');

		})
		.onLeave(function(){
			route.remove();
		});

}())
