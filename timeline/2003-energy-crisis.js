(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2003)
		.marker('2000s energy crisis', 'driver','.timeline__oil-cris-2003')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(25.304304, -90.065918, 'Golf of Mexico')
				.addPoint(33.223191, 43.679291, 'Iraq')
				.addPoint(18.479609, 43.593750, 'Saudi Arabia')
				.addPoint(9.081999, 8.675277, 'Nigeria')
				.addPoint(6.423750, -66.58973, 'Venezuela')
				.addPoint(61.524010, 105.318756, 'Russia')
				.build();

		})
		.onLeave(function(){
			route.remove();
		});

}());
