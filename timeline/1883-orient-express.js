(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(4,10,1883)
		.marker('Orient express', 'rail', '.timeline__content--orient-express')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London', 0.15)
				// .add(51.127876, 1.313403, 0.1)
				// .add(50.951290, 1.858686, 0.1)
				.add(48.856614, 2.352222, 0.1, 'Paris')
				.add(48.208174, 16.37381, 0.1, 'Viena')
				.add(47.497912, 19.040235, 0.1)
				.add(41.008238, 28.978359, 0.1, 'Constantinople')
				.build('rail');

		})
		.onLeave(function(){
			route.remove();
		});

}())
