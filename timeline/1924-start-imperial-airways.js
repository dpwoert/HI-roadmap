(function(){

	var evt = new TimelineEvent(timeline);
	var route, route2;

	evt
		.setDate(1,1,1924)
		.marker('Imperial Airways founded', 'aviation')
		.onActive(function(world){

			route = new Route(timeline.world());
			route2 = new Route(timeline.world());

			//create points
			route
				.add(51.507351, -0.127758, undefined, 'London')
				.add(48.856614, 2.352222, 0.4, 'Paris')
				.add(40.632728, 17.941762, 2, 'Brindisi')
				.add(37.983917, 23.72936, 0.4, 'Athens')
				.add(31.128199, 29.926758, 1, 'Alexandria')
				.add(30.044420, 31.235712, 0.5)
				.add(26.863281, 31.816406, 0.3)
				.add(24.966140, 33.706055, 0.3)
				.add(23.805450, 33.706055, 0.3)
				.add(21.799142, 31.371316, 0.3, 'Wadi Halfa')
				.add(19.103648, 33.881836, 0.3)
				.add(15.453680, 32.475586, 0.3, 'Khartoum')
				.add(13.923404, 32.585449, 0.3)
				.add(4.882994, 31.552734, 0.3, 'Juba')
				.add(0.051184, 32.463708, 0.3, 'Entebbe')
				.add(-6.162401, 35.749512, 0.3)
				.add(-8.885072, 33.442383, 0.3, 'Mbeya')
				.add(-11.828023, 31.451331, 0.3)
				.add(-11.828023, 31.451331, 0.3)
				.add(-15.379543, 28.333740, 0.3)
				.add(-17.825166, 31.03351, 0.3, 'Harare')
				.add(-20.159098, 28.630371, 0.3)
				.add(-23.885838, 29.421387, 0.3)
				.add(-26.165299, 28.059082, 0.3, 'Johannesburg')
				.add(-28.719496, 24.752197, 0.3)
				.add(-32.008076, 23.203125, 0.3)
				.add(-33.925130, 18.413086, 0.3, 'Cape Town')
				.build('aviation');

			route2
				.add(31.128199, 29.926758)
				.add(31.354676, 34.308826, 0.3)
				.add(33.312806, 44.361488, 0.3, 'Baghdad')
				.add(30.508103, 47.783489, 0.3, 'Basra')
				.add(29.311660, 47.481766, 0.3, 'Kuweit')
				.add(26.066700, 50.5577, 0.3, 'Bahrein')
				.add(25.322327, 55.513643, 0.3, 'Sharjah')
				.add(25.198695, 62.321315, 0.3, 'Gwadar')
				.add(24.861462, 67.009939, 0.3, 'Karachi')
				.add(26.238947, 73.024309, 0.3)
				.add(28.613939, 77.209021, 0.3, 'Delhi')
				.add(25.435801, 81.846311, 0.3)
				.add(25.435801, 81.846311, 0.3, 'Calcutta')
				.add(20.152766, 92.867686, 0.3, 'Akyab')
				.add(16.866069, 96.195132, 0.3, 'Rangoon')
				.add(13.756331, 100.501765, 0.3, 'Bangkok')
				.add(9.709057, 98.657227, 0.3)
				.add(5.484768, 100.327148, 0.3, 'Penang')
				.add(1.352083, 103.819836, 0.3, 'Singapore')
				.add(-6.208763, 106.845599, 0.3, 'Batavia')
				.add(-7.257472, 112.752088, 0.3)
				.add(-8.385431, 114.169922, 0.3)
				.add(-10.177200, 123.607033, 0.3)
				.add(-12.425848, 130.847168, 0.3, 'Darwin')
				.add(-17.476432, 133.637695, 0.3)
				.add(-19.062118, 134.780273, 0.3)
				.add(-19.890723, 137.329102, 0.3)
				.add(-20.704353, 140.505613, 0.3)
				.add(-23.440658, 144.251056, 0.3, 'Longreach')
				.add(-27.471011, 153.023449, 0.3, 'Brisbane')
				.build('aviation');

		})
		.onLeave(function(){
			route.remove();
			route2.remove();
		});

}())
