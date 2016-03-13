window.Timeline = function(world){

	var list = [];
	var bounds = {min: undefined, max: undefined};
	var pxBounds = [100, window.innerHeight - 50];
	var now = [];
	var grippy;
	var scale;

	var relateDate = function(date, date2){
		if(date[2] < date2[2]){
			return 'before';
		}
		if(date[2] > date2[2] && date[1] < date2[1]){
			return 'before';
		}
		if(date[2] > date2[2] && date[1] > date2[1] && date[0] < date2[0]){
			return 'before';
		}
		if(date[2] === date2[2] && date[1] === date2[1] && date[0] === date2[0]){
			console.warn('equal date');
			return 'equal';
		}

		return 'after';
	};

	var getPosition = function(date){
		var now = date[2] + (date[1] * 30 + date[0]) / 356;
		return scale(now);
	};

	var calculateBounds = function(){

		list.forEach(function(evt){

			var date = evt.date;

			if(!bounds.min || relateDate(date, bounds.min) === 'before'){
				bounds.min = date;
			}
			if(!bounds.max || relateDate(date, bounds.max) === 'after'){
				bounds.max = date;
			}

		});

		var min = bounds.min[2] + (bounds.min[1] * 30 + bounds.min[0]) / 356;
		var max = bounds.max[2] + (bounds.max[1] * 30 + bounds.max[0]) / 356;

		scale = d3.scale.linear().domain([min, max]).range(pxBounds);

	};

	this.world = function(_world){

		if(!_world){
			return world;
		}

		world = _world;

		//chainable
		return this;
	};

	this.add = function(evt){
		list.push(evt);

		//chainable
		return this;
	};

	this.addList = function(list){
		list.concat(list);

		//chainable
		return this;
	}


	this.tick = function(){
		list.forEach(function(evt){
			if(evt.active){
				evt.handles.update(now)
			}
		});
	};

	this.setMarker = function(evt){
		this.setDate(evt.date);
	};

	this.setProcent = function(procent){

	};

	this.setDate = function(date){

		//save current date
		now = date;

		//move grippy
		grippy
			.transition()
			.duration(200)
			.attr('cy', getPosition(date));

		//set active for events
		list.forEach(function(evt){
			var active = (evt.date[0] === now[0] && evt.date[1] === now[1] && evt.date[2] === now[2]);

			if(evt.active && !active){
				evt.handles.onLeave(world);
			}
			if(!evt.active && active){
				evt.handles.onActive(world);
			}

			evt.active = active;

			//change sidebar when needed
			if(active){

				//sidebar
				var sidebar = document.querySelector('.sidebar');
				var image = sidebar.querySelector('.sidebar__image');
				var content = sidebar.querySelector('.sidebar__content');
				var info = evt.sidebar();
				image.style.backgroundImage = 'url(' + info.image + ')';
				content.innerHTML = info.html;

			}

		});

		this.now = now[2] + (now[1] * 30 + now[0]) / 356;
		this._now = now;

	};

	this.build = function(){

		var self = this;
		calculateBounds();

		//create HTML
		var svg = d3.select('.timeline');
		var group =	svg.append('g');
		var left = 33;

		//base line
		var line = group
			.append('line')
			.attr('class', 'timeline__baseline')
			.attr('x1', left)
			.attr('x2', left)
			.attr('y1', 100)
			.attr('y2', pxBounds[1])
			.attr('stroke', '#777')
			.attr('stroke-width', 1)
			.attr('stroke-dasharray', '1,2');

		//add markers
		list.forEach(function(evt){

			var evtGroup = group
				.append('g')
				.attr('class', 'timeline__event-group');

			//marker
			evtGroup
				.append('circle')
				.attr('class', 'timeline__point')
				.attr('r', 2)
				.attr('cx', left)
				.attr('cy', getPosition(evt.date))
				.attr('fill', '#777')
				.attr('stroke', 'none')
				.on('mousedown', function(){
					self.setMarker(evt);
				});

			//year label
			evtGroup
				.append('text')
				.attr('class', 'timeline__year')
				.attr('x', left + 10)
				.attr('y', getPosition(evt.date))
				.attr('fill', '#777')
				.attr('stroke', 'none')
				.attr('alignment-baseline', 'central')
				.text(evt.date[2])
				.on('mousedown', function(){
					self.setMarker(evt);
				});

			//name label
			evtGroup
				.append('text')
				.attr('class', 'timeline__evt-label')
				.attr('x', left + 10)
				.attr('y', getPosition(evt.date) + 14)
				.attr('fill', '#777')
				.attr('stroke', 'none')
				.attr('alignment-baseline', 'central')
				.text(evt.marker().name)
				.on('mousedown', function(){
					self.setMarker(evt);
				});


		});

		//grippy
		var clicked = false;
		grippy = group
			.append('circle')
			.attr('class', 'timeline__grippy')
			.attr('r', 6)
			.attr('cx', left)
			.attr('cy', pxBounds[0])
			.attr('fill', '#ff0000')
			.attr('stroke', 'none')
			.on('mousedown', function(){
				clicked = true;
			})
			.on('mouseup', function(){
				clicked = false;
			});

		svg
			.on('mousemove', function(evt){

				//update grippy position when clicked
				if(clicked){
					var position = d3.mouse(this)[1];
					position = position < pxBounds[0] ? pxBounds[0] : position;
					position = position > pxBounds[1] ? pxBounds[1] : position;
					grippy.attr('cy', position);
				}

			});

		//set to first marker
		this.setMarker(list[0]);

	};

};
