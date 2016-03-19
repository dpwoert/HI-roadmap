(function(){

	var evt = new TimelineEvent(timeline);
	var route, route2;

	evt
		.setDate(21,1,1976)
		.marker('Concorde', 'aviation')
		.onActive(function(world){

			//add test route
			route = new Route(timeline.world());
			route2 = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London')
				.add(26.066700, 50.5577, 8, 'Bahrein')
				.add(51.507351, -0.127758, undefined)
				.add(-26.204103, 28.047305, 10, 'Johannesburg')
				.add(51.507351, -0.127758, undefined)
				.add(40.712784, -74.005941, 8, 'New York', 0.2)
				.add(51.507351, -0.127758, undefined)
				.add(-37.788081, 144.953613, 100, 'Melbourne')
				.add(51.507351, -0.127758, undefined)
				.add(35.689487, 139.691706, 10, 'Tokyo')
				.add(51.507351, -0.127758, undefined)
				.add(1.352083, 103.819836, 15, 'Singapore')
				.add(51.507351, -0.127758, undefined)
				.add(38.907192, -77.036871, 8, 'Washington')
				.build('aviation');

			route2
				.add(48.856614, 2.352222, undefined, 'Paris', 0.05)
				.add(14.764504, -17.366029, 6)
				.add(-22.906847, -43.172896, 6, 'Rio de Janeiro')
				.add(51.507351, -0.127758, undefined)
				.add(37.741249, -25.675594, 6)
				.add(10.480594, -66.903606, 6, 'Caracas')
				.add(51.507351, -0.127758, undefined)
				.add(38.907192, -77.036871, 6)
				.add(19.432608, -99.133208, 6, 'Mexico City')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
			route2.remove();
		});

}())
