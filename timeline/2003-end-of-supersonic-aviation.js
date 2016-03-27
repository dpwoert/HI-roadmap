(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(26,11,2003)
		.marker('End of supersonic commercial aviation', 'aviation', '.timeline__end-of-supersonic-aviation')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London')
				.add(40.712784, -74.005941, 1, 'New York')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}());
