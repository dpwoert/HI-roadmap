(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1910)
		.marker('First Atlantic flight', 'aviation')
		.sidebar('timeline/images/atlantic-flight.jpg', 'test content')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London')
				.add(40.712784, -74.005941, 7.5, 'New York')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
