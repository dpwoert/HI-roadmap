(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,2,1912)
		.marker('First diesel oceanliner', 'marine','.timeline__diesel-ship')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(55.676097, 12.568337, undefined, 'Copenhagen')
				.add(44.405650, 8.946256, 1, 'Genoa')
				.add(13.756331, 100.501765, 10, 'Bangkok')
				.build('marine');

		})
		.onLeave(function(){
			route.remove();
		});

}())
