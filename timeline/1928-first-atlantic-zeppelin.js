(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(18,9,1928)
		.marker('First transatlantic zeppelin flight', 'aviation', '.timeline__first-atlantic-zeppelin')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(47.661765, 9.480011, undefined, 'Friedrichshafen')
				.add(40.014561, -74.311257, 4, 'Lakehurst')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}());
