window.TimelineEvent = function(timeline){

	var marker = {
		color: 'black',
		icon: 'none'
	};

	var sidebar = {};

	this.date = [1,1,1800];

	this.handles = {
		update: function(){},
		onActive: function(){},
		onLeave: function(){}
	};

	this.setDate = function(day, month, year){

		this.date[0] = day || 1;
		this.date[1] = month || 1;
		this.date[2] = year || 1800;

		//chainable
		return this;
	};

	this.marker = function(name, type){

		if(!name){
			return marker;
		}

		marker.name = name;
		marker.type = type || 'none';

		//chainable
		return this;
	};

	this.sidebar = function(image, html, graph){

		if(!image && !graph){
			return sidebar;
		}

		sidebar.image = image;
		sidebar.html = html;

		return this;
	};

	this.onActive = function(fn){
		this.handles.onActive = fn;

		//chainable
		return this;
	};

	this.onLeave = function(fn){
		this.handles.onLeave = fn;

		//chainable
		return this;
	};

	this.onUpdate = function(fn){
		this.handles.onUpdate = fn;

		//chainable
		return this;
	};

	//add to timeline
	timeline.add(this);

};
