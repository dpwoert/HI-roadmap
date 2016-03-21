(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,11,1884)
		.marker('Last big steamschip with auxiliary sails', 'marine','.timeline__content--auxiliary-sails')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.add(53.408371, -2.991573, undefined, 'Liverpool')
				.add(51.850336, -8.294286, 0.5)
				.add(40.712784, -74.005941, 3, 'New York')
				.build('marine');

		})
		.onLeave(function(){
			route.remove();
		});

}())
