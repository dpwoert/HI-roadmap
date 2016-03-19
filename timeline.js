window.Timeline = function(world){

	var list = [];
	var bounds = {min: undefined, max: undefined};
	var pxBounds = [100, 4000];
	var now = [];
	var grippy, grippy2;
	var scale;
	var group;
	var tweenable = new Tweenable();
	var mode = 0;

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

	var getPosition = function(evt, i){

		if(mode === 0){

			if(i === 0){
				return pxBounds[0];
			} else {

				var prevEvt = list[i-1];
				var prevBullit = document.querySelectorAll('.timeline__point')[i-1];
				var prevEl = document.querySelector(prevEvt.marker().content);

				var top = parseInt(prevBullit.getAttribute('cy'));
				top += 60;

				if(prevEl){
					top += prevEl.offsetHeight;
				}

				return top;
			}

		} else {

			var now = evt.date[2] + ((evt.date[1]-1) * 30 + evt.date[0]) / 356;
			return scale(now);

		}
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

		var min = bounds.min[2] + ((bounds.min[1] - 1) * 30 + bounds.min[0]) / 356;
		var max = bounds.max[2] + ((bounds.max[1] - 1) * 30 + bounds.max[0]) / 356;

		var extent = d3.extent(list, function(d){
			return d.date[2] + ((d.date[1] - 1) * 30 + d.date[0]) / 356;
		})

		scale = d3.scale.linear().domain(extent).range(pxBounds);

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
			if(evt.active && evt.handles.onUpdate){
				evt.handles.onUpdate(now)
			}
		});
	};

	this.setMarker = function(evt){
		this.setDate(evt.date);
	};

	this.setProcent = function(procent){

	};

	this.setDate = function(date){

		if(this._now && this._now[2] === date[2]){
			return false;
		}

		var oldDate = now.length === 0 ? date : now;

		//save current date
		now = date;

		//move grippy
		grippy
			.transition()
			.duration(200)
			// .attr('cy', getPosition(date));

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


			}

		});

		this.now = now[2] + (now[1] * 30 + now[0]) / 356;
		this._now = now;

	};

	this.switchMode = function(_mode){
		mode = _mode;

		if(mode === 0){
			grippy.attr('display', 'none');
			document.querySelector('.timeline--fixed').style.display = 'block';
			document.querySelector('.timeline__content__wrapper').style.opacity = 1;

			world.heatmap.show(false);

		}
		else{
			grippy.attr('display', 'block');
			document.querySelector('.timeline--fixed').style.display = 'none';
			document.querySelector('.timeline__content__wrapper').style.opacity = 0;

			d3
				.select('.timeline__baseline')
				.attr('y2', pxBounds[1])

			world.heatmap.show(true);
		}

		//marker
		group
			.selectAll('.timeline__point')
			.transition()
			.duration(200)
			.attr('cy', function(d, i){
				return getPosition(d,i);
			});

		//year
		group
			.selectAll('.timeline__year')
			.transition()
			.duration(200)
			.attr('y', function(d, i){
				return getPosition(d,i);
			});

		//label
		group
			.selectAll('.timeline__evt-label')
			.transition()
			.duration(200)
			.attr('y', function(d, i){
				return getPosition(d,i);
			});
	};

	this.build = function(){

		//order on date
		list.sort(function(a, b){
			a = a.date[2] + ((a.date[1]-1) * 30 + a.date[0]) / 365;
			b = b.date[2] + ((b.date[1]-1) * 30 + b.date[0]) / 365;

			return a > b ? 1 : -1;
		});

		var self = this;
		calculateBounds();

		//create HTML
		var svg = d3.select('.timeline');
		var _svg = document.querySelector('.timeline');
		group =	svg.append('g');
		var left = 65;

		_svg.style.height = pxBounds[1] + 100 + 'px';

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

		//marker
		group
			.selectAll('.timeline__point')
			.data(list)
			.enter()

			.append('circle')
			.attr('class', function(d){ return 'timeline__point timeline__point--' + d.marker().type; })
			.attr('r', 6)
			.attr('cx', left)
			.attr('cy', function(d, i){
				return getPosition(d, i)
			})
			.on('mousedown', function(d){
				self.setMarker(d);
			});

		//year label
		group
			.selectAll('.timeline__year')
			.data(list)
			.enter()

			.append('text')
			.attr('class', function(d){ return 'timeline__year timeline__year--' + d.marker().type })
			.attr('x', left - 25)
			.attr('y', function(d, i){ return getPosition(d, i); })
			.attr('fill', '#777')
			.attr('stroke', 'none')
			.attr('alignment-baseline', 'central')
			.attr('text-anchor', 'middle')
			.text(function(d){ return d.date[2]; })
			.on('mousedown', function(d){
				self.setMarker(d);
			});

		//name label
		group
			.selectAll('.timeline__evt-label')
			.data(list)
			.enter()

			.append('text')
			.attr('class', 'timeline__evt-label')
			.attr('x', left + 10)
			.attr('y', function(d, i){ return getPosition(d, i); })
			// .attr('fill', '#777')
			.attr('stroke', 'none')
			.attr('alignment-baseline', 'central')
			.text(function(d){ return d.marker().name; })
			.on('mousedown', function(d){
				self.setMarker(d);
			});

		//add markers
		list.forEach(function(evt, i){

			//get box
			var top = getPosition(evt, i);
			var bottom = top + 20;

			//content
			var content = evt.marker().content;
			if(content){
				content = document.querySelector(content);
				content.style.top = getPosition(evt, i) + 'px';
				bottom += content.offsetHeight;
			}

			evt.scrollBox = [top, bottom];

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
		this.switchMode(0);

		var self = this;

		var message = document.querySelector('.timeline__scroll-down__inner');

		document
			.querySelector('.timeline__wrapper')
			.addEventListener('scroll', function(event){

				if(mode === 1){
					return false;
				}

				var scrollPos = event.target.scrollTop + 100;

				list.forEach(function(evt){

					if(scrollPos > evt.scrollBox[0] && scrollPos < evt.scrollBox[1]){
						self.setMarker(evt);
					}

				});

				if(scrollPos > 100){
					message.style.opacity = 0;
				} else {
					message.style.opacity = 1;
				}

			}.bind(this));

		document
			.querySelector('.timeline__switch')
			.addEventListener('click', function(event){
				self.switchMode(mode === 0 ? 1 : 0)
			});

	};

};
