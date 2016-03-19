(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,6,1919)
		.marker('First transatlantic flight', 'aviation')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(47.560541, -52.712831, undefined, 'St. John\'s')
				.add(53.594765, -9.844777, 4, 'Clifden')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
