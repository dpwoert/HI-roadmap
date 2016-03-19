(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,11,1939)
		.marker('Second world war', 'driver')
		.onActive(function(world){



		})
		.onLeave(function(){
		});

}())
