(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2025)
		.marker('First commercial trip to space', 'space', '.timeline__virgin-galactic')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(35.056235, -118.157835, 'Mojave Spaceport', 0.15)
				.addPoint(67.855800, 20.225282, 'Spaceport Sweden')
				.addPoint(33.321349, -105.424805, 'Spaceport America')
				.addPoint(24.299174, 54.697277, 'Abu Dhabi Spaceport')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
