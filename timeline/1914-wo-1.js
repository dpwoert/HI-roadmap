(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(28,6,1914)
		.marker('First world war', 'driver', '.timeline__wo-1')
		.onActive(function(world){



		})
		.onLeave(function(){
		});

}())
