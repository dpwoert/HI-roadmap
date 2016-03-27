(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(20,9,1906)
		.marker('First oceanliner with steam turbine', 'marine','.timeline__content--steam-turbine')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(50.909700, -1.404351, undefined, 'Southampton')
				.add(51.850336, -8.294286, 0.5)
				.add(40.712784, -74.005941, 3, 'New York')
				.build('marine');

		})
		.onLeave(function(){
			route.remove();
		});

}());
