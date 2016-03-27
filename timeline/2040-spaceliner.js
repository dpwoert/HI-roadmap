(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2040)
		.marker('SpaceLiner suborbital lineflights', 'space', '.timeline__spaceliner')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London')
				.add(-33.867487, 151.20699, 200, 'Sydney')
				.build('space');

		})
		.onLeave(function(){
			route.remove();
		});

}());
