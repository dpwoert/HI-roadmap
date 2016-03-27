(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(2,5,1952)
		.marker('First pressurized commercial flight', 'aviation')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'Londen')
				.add(-33.924869, 18.424055, 11, 'Cape Town')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}());
