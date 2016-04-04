(function(){

	window.Timeline = function(world){

		var list = [];
		var bounds = {min: undefined, max: undefined};
		// var pxBounds = [100, 4000];
		var pxBounds = [120, 5000];
		var now = [];
		var scale, scaleScroll;
		var group;
		var tweenable = new Tweenable();
		var mode = 0;
		var play = false;
		var playRange;
		var timelineEl;

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

					var el = document.querySelector(evt.marker().content);
					return el.getBoundingClientRect().top + document.body.scrollTop;
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

		var resetPositions = function(){

			var points = document.querySelectorAll('.timeline__point');
			for (var i = 0; i < points.length; i++) {
				points[i].removeAttribute('cy');
			}
		};

		var updatePositions = function(){

			list.forEach(function(evt, i){

				//get box
				var top = getPosition(evt, i);
				var middle = top + 20;
				var bottom = middle;

				//content
				var content = evt.marker().content;
				if(content && mode === 0){
					content = document.querySelector(content);
					// content.style.top = getPosition(evt, i) + 'px';
					bottom += content.offsetHeight;

					content.classList.add('timeline__content--' + evt.marker().type);
				}

				evt.scrollBox = [top, middle, bottom];

			});

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

			if(play){
				timelineEl.scrollTop = playRange( +Date.now() );
			}
		};

		this.setMarker = function(evt){
			this.setDate(evt.date);
		};

		this.setProcent = function(procent){

		};

		this.setDate = function(date){

			if(this._now && this._now[2] === date[2]){
				//return false;
			}

			var oldDate = now.length === 0 ? date : now;

			//save current date
			now = date;

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

			this.now = now[2] + ((now[1] - 1) * 30 + now[0]) / 356;
			this._now = now;

		};

		this.switchMode = function(_mode){

			mode = _mode;
			resetPositions();
			var legend = document.querySelector('.legend');
			var switchBtn = document.querySelector('.timeline__switch');

			if(mode === 0){
				document.querySelector('.timeline__content__wrapper').style.opacity = 1;
				document.querySelector('.timeline__content__wrapper').style.display = 'block';

				world.heatmap.show(false);

				legend.classList.remove('show');
				switchBtn.classList.remove('active');

			}
			else{
				document.querySelector('.timeline__content__wrapper').style.opacity = 0;

				window.setTimeout(function(){
					document.querySelector('.timeline__content__wrapper').style.display = 'none';
				}, 700);

				legend.classList.add('show');
				switchBtn.classList.add('active');

				world.heatmap.show(true);
			}

			var height = getPosition(list[list.length-1],list.length - 1);
			document.querySelector('.timeline').style.height = height + window.innerHeight - pxBounds[0] - 4;

			//line
			group
				.selectAll('.timeline__baseline')
				.transition()
				.duration(200)
				.attr('y2', height);


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

			updatePositions();

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
				.attr('y1', 82)
				// .attr('y2', pxBounds[1])
				.attr('y2', 11190)
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
				.attr('dominant-baseline', 'central')
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
				.attr('dominant-baseline', 'central')
				.text(function(d){ return d.marker().name; })
				.on('mousedown', function(d){
					self.setMarker(d);
				});

			//add markers
			updatePositions();

			//set to first marker
			this.setMarker(list[0]);
			this.switchMode(0);

			var self = this;

			var message = document.querySelector('.timeline__scroll-down__inner');

			document
				.querySelector('.timeline__wrapper')
				.addEventListener('scroll', function(event){

					var scrollPos = event.target.scrollTop + pxBounds[0];

					if(mode === 1){
						this.now = scale.invert(scrollPos);
					}

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
					self.switchMode(mode === 0 ? 1 : 0);
				});

			window.addEventListener('keydown', function(event){

				if(event.keyCode === 80){
					var start = +Date.now();
					var end = start + (1000 * 60) * 11;
					playRange = d3.scale.linear().domain([ start, end ]).range([0,13000]);
					play = true;

					timelineEl = document.querySelector('.timeline__wrapper')
				}

			});

		};

	};

}());
