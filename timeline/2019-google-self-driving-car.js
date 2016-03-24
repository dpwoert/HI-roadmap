(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2019)
		.marker('Google self driving released', 'cars', '.timeline__google-self-driving-car-release')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(37.386052, -122.083851, 'Mountain View')
				.addPoint(42.331427, -83.045754, 'Detroit')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
