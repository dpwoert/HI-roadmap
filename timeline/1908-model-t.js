(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,10,1908)
		.marker('Ford Model T', 'cars','.timeline__content--model-t')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());

			//create points
			route
				.addPoint(42.331427, -83.045754, 'Detroit')
				.build('cars');

		})
		.onLeave(function(){
			route.remove();
		});

}())
