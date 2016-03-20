(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,1869)
		.marker('First Transcontinental Railroad', 'rail','.timeline__content--first-transcontinental-railroad')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(37.803939, -122.426896, undefined, 'San Francisco Bay')
				.add(41.261944, -95.860833, 2)
				.add(41.878114, -87.629798, 0.2, 'Chicago')
				.add(41.261944, -95.860833)
				.add(40.712784, -74.005941, 1, 'New York')
				.build('rail');

		})
		.onLeave(function(){
			route.remove();
		});

}())
