(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(16,8,1969)
		.marker('First man in space', 'space')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(28.392218, -80.607713, undefined, 'Cape Canaveral')
				.add(13.316667,-169.15, 60)
				.build('space');

		})
		.onLeave(function(){
			route.remove();
		});

}())
