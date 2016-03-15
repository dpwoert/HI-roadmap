(function(){

	var evt = new TimelineEvent(timeline);
	var route;

	evt
		.setDate(1,1,2046)
		.onActive(function(world){ })
		.onLeave(function(){ });

}())
