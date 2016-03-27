(function(){

	var evt = new TimelineEvent(timeline);

	evt
		.setDate(1,1,2046)
		.marker('', 'default', '.timeline__end')
		.onActive(function(world){

			console.log('end');

		})
		.onLeave(function(){
		});

}());
