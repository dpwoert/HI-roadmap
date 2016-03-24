(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,10,1973)
		.marker('Oil crisis', 'driver', '.timeline__oil-cris-1973')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(52.370216, 4.895168, 'Netherlands')
				.addPoint(38.907192, -77.036871, 'United States of America')
				.addPoint(35.689487, 139.691706, 'Japan')
				.addPoint(45.421530, -75.697193, 'Canada')
				.addPoint(51.507351, -0.127758, 'United Kingdom', 0.2)
				.addPoint(32.085300, 34.781768, 'Israel')

				.addPoint(26.820553, 30.802498, 'Egypt')
				.addPoint(34.802075, 38.996815, 'Syria', 0.2)
				.addPoint(28.033886, 1.659626, 'Algeria')
				// .addPoint(26.066700, 50.5577)
				.addPoint(23.424076, 53.847818, 'United Arab Immirates')
				.addPoint(33.223191, 43.679291, 'Iraq')
				.addPoint(29.311660, 47.481766, 'Kuweit')
				.addPoint(26.335100, 17.228331, 'Libya')
				// .addPoint(25.354826, 51.183884)
				.addPoint(33.886917, 9.537499, 'Tunesia')
				.addPoint(18.479609, 43.593750, 'Saudi Arabia')
				.build();

		})
		.onLeave(function(){
			route.remove();
		});

}())
