(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1946)
		.marker('First transatlantic line flight', 'aviation', '.timeline__first-atlantic-airline')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(40.712784, -74.005941, undefined, 'New York')
				.add(51.507351, -0.127758, 4, 'Londen')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
