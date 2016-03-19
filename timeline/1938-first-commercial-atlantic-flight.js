(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(21,7,1938)
		.marker('First commercial transatlantic flight', 'aviation')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(52.610525, -9.105112, undefined, 'Foynes')
				.add(45.501689, -73.567256, 4, 'Montreal')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
