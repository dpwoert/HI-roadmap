THREE.renderPipeline = function(renderer){

	var list = [];

	//create clock
	var clock = new THREE.Clock();

	var search = function(id){

		for( var i = 0 ; i < list.length ; i++ ){

			if( list[i].name === name){
				return i;
			}

		}

	};

	var createShader = function(){

		for( var i = 0 ; i < list.length ; i++ ){

			if(!list[i].isCreated && list[i].create){
				list[i].create(renderer);
				list[i].isCreated = true;
			}

		}

	};

	var createProcess = function(name, step, place){

		var _process = {
			'name': name,
			'render': step,
			'process': {
				'active': true,
				'runOnce': false
			}
		};

		if(step.create && step.render){
			_process.create = step.create;
			_process.render = step.render;
		}

		//process controls
		if(step.process){
			_process.process = step.process
		}

		//add to list
		if(!place){
			list.push(_process);
		} else {
			list.splice(place, 0, _process);
		}

		//create shader?
		if(isStarted){
			createShader();
		}

	}

	this.pipe = function(name, step){
		createProcess(name, step);

		//chainable
		return this;
	};

	this.before = function(before, name, step){
		createProcess(name, step, search(name) );

		//chainable
		return this;
	};

	this.after = function(after, name, step){
		createProcess(name, step, search(name) + 1 );

		//chainable
		return this;
	};

	this.remove = function(name){
		var index = search(name);
		list.splice(index, 1);

		//chainable
		return this;
	};

	this.clear = function(){
		list = [];

		//chainable
		return this;
	};

	var play = false;
	var isStarted = false;

	var render = function(){

		//stop when needed
		if(!play){
			return false;
		}

		//get delta since last run
		var delta = clock.getDelta();
		var currentOutput;

		for( var i = 0 ; i < list.length ; i++ ){

			if(list[i].process.active){
				currentOutput = list[i].render(delta, currentOutput);
			}

			if(list[i].process.runOnce){
				list[i].process.active = false;
				list[i].process.runOnce = false;
			}

		}

		//schedule next frame
		requestAnimationFrame( render );

	};

	this.start = function(){

		createShader();
		isStarted = true;

		if(!play){
			play = true;
			render();
		}

		//chainable
		return this;

	};

	this.stop = function(){
		play = false;

		//chainable
		return this;

	};

}
