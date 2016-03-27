(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(12,4,1961)
		.marker('First man in space', 'space', '.timeline__first-man-in-space')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(45.623226, 63.313983, undefined, 'Baikonur')
				.add(51.270682,45.99727, 20)
				.build('space');

		})
		.onLeave(function(){
			route.remove();
		});

}());
