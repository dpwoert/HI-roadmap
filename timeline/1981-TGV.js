(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1981)
		.marker('TGV', 'rail','.timeline__tgv')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(48.856614, 2.352222, undefined, 'Paris', 0.2)
				.add(45.764043, 4.835659, 0.15, 'Lyon')
				.build('rail');

		})
		.onLeave(function(){
			route.remove();
		});

}())
