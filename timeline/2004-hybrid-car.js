(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2004)
		.marker('First success of hybrid car', 'cars')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(35.082395, 137.156249, 'Toyota')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
