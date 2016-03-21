(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(17,12,1903)
		.marker('First flight by Wright brothers', 'aviation', '.timeline__content--wright-brothers')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(36.064610, -75.705735, 'Kitty Hawk')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
		});

}())
