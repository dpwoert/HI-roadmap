(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(25,10,2007)
		.marker('Airbus A380', 'aviation','.timeline__airbus-hubs')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(1.352083, 103.819836, undefined, 'Singapore')
				.add(-33.867487, 151.20699, 8, 'Sydney')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
