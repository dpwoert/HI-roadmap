(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,3,2010)
		.marker('Google starts self driving car programme', 'cars', '.timeline__google-self-driving-car')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.386052, -122.083851, 'Mountain View')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
