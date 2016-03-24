(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(14,11,1994)
		.marker('First eurostar train through Chanel Tunnel', 'rail', '.timeline__eurostar')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(48.856614, 2.352222, undefined, 'Paris', 0.2)
				.add(50.951290, 1.858686, undefined)
				.add(51.127876, 1.313403, undefined)
				.add(51.507351, -0.127758, 0.15, 'London')
				.build('rail');

		})
		.onLeave(function(){
			route.remove();
		});

}())
