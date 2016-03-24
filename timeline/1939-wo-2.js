(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,11,1939)
		.marker('Second world war', 'driver', '.timeline__wo-2')
		.onActive(function(world){



		})
		.onLeave(function(){
		});

}())
