(function(){

	var evt = new TimelineEvent(timeline);

	evt
		.setDate(1,1,2003)
		.marker('2000s energy crisis', 'driver')
		.onActive(function(world){

		})
		.onLeave(function(){

		});

}())
