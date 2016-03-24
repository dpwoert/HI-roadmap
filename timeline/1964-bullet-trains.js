(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,10,1964)
		.marker('First bullet train', 'rail', '.timeline__bullet-trains')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(35.689487, 139.691706, undefined, 'Tokyo', 0.2)
				.add(34.693738, 135.502165, 0.15, 'Osaka')
				.build('rail');

		})
		.onLeave(function(){
			route.remove();
		});

}())
