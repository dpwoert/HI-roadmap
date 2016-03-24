THREE.ShaderStep = function(width, height){

	var renderer;

	//settings
	this.textureId = 'texData';
	this.uniforms = {};
	this.vertexShader = '';
	this.fragmentShader = '';

	//create swap buffers
	var buffer1 = new THREE.WebGLRenderTarget(width, height, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType
	});
	buffer1.texture.generateMipmaps = false;
	var buffer2 = buffer1.clone();
	this.writeBuffer = buffer1;
	this.readBuffer = buffer2;

	//create scene variables
	var camera, geom, startImage, mesh, renderToScreen, pipe;
	var scene = new THREE.Scene();
	var customMesh = THREE.Mesh;
	var needSwap = true;

	this.public = {
		camera: camera,
		geometry: geom,
		mesh: mesh
	};

	this.process = {
		active: true,
		runOnce: false
	};

	/**
	 * from own RenderTarget
	 * @param {THREE.WebGLRenderTarget} renderTarget
	 * @return {this} - Chainable
	 */
	this.fromRenderTarget = function(renderTarget){
		buffer1 = renderTarget.clone();
		buffer2 = buffer1.clone();

		return this;
	};

	this.camera = function(_camera){
		camera = _camera;
		return this;
	};

	/**
	 * Set geometry, else it will be plane geom
	 * @param {THREE.Geometry} geo
	 * @return {this} - Chainable
	 */
	this.geometry = function(geo){
		geom = geo;
		this.CUSTOMGEOM = true;
		return this;
	};

	/**
	 * Set mesh creation function
	 * @param {function} build - Function to build mesh
	 * @return {this} - Chainable
	 */
	this.mesh = function(build){
		customMesh = build || THREE.Mesh;
		return this;
	};

	/**
	 * Render to screen (useful for a save/copy pass)
	 * @param {boolean} save
	 * @return (this) - Chainable
	 */
	this.renderToScreen = function(save){
		renderToScreen = save || true;
		return this;
	};

	/**
	 * Use output of previous shader
	 * @param {boolean} save
	 * @return (this) - Chainable
	 */
	this.pipe = function(save){
		pipe = save || true;
		return this;
	};

	/**
	 * Uniform settings
	 * @param {String} name
	 * @param {String} type
	 * @param {*} value
	 * @return {this} - Chainable
	 */
	this.setting = function(name, type, value){

		if(this.uniforms[name]){

			//change value
			this.uniforms[name].value = value;

		} else {

			//add uniform
			this.uniforms[name] = {
				'type': type,
				'value': value
			};

		}

		return this;

	};

	/**
	 * Link to another shader
	 * @param {THREE.ShaderStep} shaderStep
	 * @param {String} name - Name of uniform
	 * @return {this|Buffer} - Chainable or image buffer to use in other shaders
	 */
	this.link = function(shaderStep, name){

		name = name || 'compute';

		//when not given andother shader this shader is being linked into another shader
		if (!shaderStep) {
			return this.writeBuffer;
		}

		//add to uniforms list
		this.uniforms[name] = {
			'type': 't',
			'value': shaderStep.link()
		};

		return this;

	};

	/**
	 * Link shaders
	 * @param {String} type - Fragment or vertex
	 * @param {String|Array} shader
	 * @return {this} - Chainable
	 */
	this.shader = function(type, shader){

		//assign to right key
		var key = type === 'fragment' || type === 'fragmentShader' ? 'fragmentShader' : 'vertexShader';

		//when an array join
		if( shader instanceof Array ){
			shader = shader.join('\n');
		}

		//save
		this[key] = shader;

		//chainable
		return this;

	};

	/**
	 * Create shader
	 * @private
	 */
	this.create = function(_renderer){

		//create assets when needed
		geom = geom || new THREE.PlaneBufferGeometry( 2, 2 )
		camera = camera || new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		//link to self
		this.uniforms[this.textureId] = {
			'type': 't',
			'value': this.readBuffer
		};

		//send resolution & time
		this.uniforms.u_resolution = {
			'type': 'v2',
			'value': new THREE.Vector2(width, height)
		};
		this.uniforms.u_time = {
			'type': 'f',
			'value': 0.0
		};

		//create shader
		var material = new THREE.ShaderMaterial({

			uniforms: this.uniforms,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
			side: THREE.DoubleSide

		});

		//create geometry
		mesh = new customMesh( geom , material );
		scene.add( mesh );

		//save reference to renderer
		renderer = _renderer;

		this.public.mesh = mesh;

	}.bind(this);

	/**
	 * Resize buffer, resets data
	 * @param {Number} width
	 * @param {Number} height
	 */
	this.setSize = function(_width, _height){

		var oldBuffer1 = buffer1;
		var oldBuffer2 = buffer2;

		width = _width;
		height = _height;

		//cloning of buffers, and set new size
		buffer1 = buffer1.clone();
		buffer1.width = width;
		buffer1.height = height;
		buffer2 = buffer1.clone();

		//dispose old buffers
		oldBuffer1.dispose();
		oldBuffer2.dispose();

		this.writeBuffer = buffer1;
		this.readBuffer = buffer2;

	};

	/**
	 * Swap buffers because you can't read and write to same buffer
	 * @private
	 */
	this.swap = function(){

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	};

	/*
	 * Determine if buffers needs swapping
	 * @param {boolean} need - default: true
	 */
	this.needSwap = function(_need) {
		needSwap = _need || true;
		return this;
	};

	/**
	 * Import image from JS as starting point for shader
	 * @param {domElement|Function} - Image/canvas element or callback function to create image
	 * @return {this} - Chainable
	 */
	this.import = function(img){

		if(img instanceof Function){

			startImage = document.createElement('canvas');
			startImage.width = THREE.Math.nearestPowerOfTwo( width );
			startImage.height = THREE.Math.nearestPowerOfTwo( height );
			var context = startImage.getContext('2d');
			var imageData = context.createImageData(width, height);

			function setPixel(imageData, x, y, color) {
				index = (x + y * imageData.width) * 4;
				imageData.data[index+0] = color[0];
				imageData.data[index+1] = color[1];
				imageData.data[index+2] = color[2];
				imageData.data[index+3] = color[3] || 255;
			};

			for(var x = 0 ; x < width ; x++){
				for(var y = 0 ; y < height ; y++){

					var pixel = img(x,y);
      				setPixel(imageData, x, y, pixel);

				}
			}

			context.putImageData(imageData, 0, 0);
			// console.log(startImage.toDataURL())

		} else {

			startImage = img;

		}

		return this;

	};

	/**
	 * Export shader to image so it's readable by JS again
	 * @param {Boolean} convert - Convert to pixel array
	 */
	this.export = function(convert){

		convert = convert || true;

		//don't convert, just pass buffer
		if(!convert){
			return this.readBuffer;
		}

		var pixels = new Uint8Array(4 * width * height); // be careful - allocate memory only once

		var gl = renderer.context;
		var framebuffer = this.readBuffer.__webglFramebuffer;
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.viewport(0, 0, width, height);
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		var data = [];

		//make better readable
		for( var x = 0 ; x < width ; x++ ){

			data.push([]);

			for( var y = 0 ; y < height ; y++ ){
				var startIndex = ((x * width) + y) * 4;

				//get RGBA pixels
				data[x][y] = [
					pixels[startIndex],
					pixels[startIndex+1],
					pixels[startIndex+2],
					pixels[startIndex+3]
				];
			}
		}

		return data;

	};

	/**
	 * Enable/disable rendering of this shader
	 * @param {boolean} active
	 * @return {this} - Chainable
	 */
	this.enable = function(active) {
		this.process.active = active || true;
		return this;
	};

	/**
	 * Enable rendering of this shader for only one iteration
	 * @param {boolean} run
	 * @return {this} - Chainable
	 */
	this.runOnce = function(run) {
		this.process.runOnce = run || true;
		return this;
	};

	/**
	 * Render a frame
	 */
	this.render = function(delta, previousStep){

		//use correct readBuffer
			this.uniforms[ this.textureId ].value = this.readBuffer;

			//send previous step to shader
			if (pipe) {
				this.uniforms[ this.textureId ].value = previousStep;
			}

			//start image?
			if (startImage) {
				startImage = new THREE.Texture(startImage);
				startImage.needsUpdate = true;
				this.uniforms[ this.textureId ].value = startImage;
			}

			//update time
			this.uniforms.u_time.value += 0.05;

			//render
			if (renderToScreen) {
				renderer.render( scene, camera );
			} else {
				renderer.render( scene, camera, this.writeBuffer, false );
			}

			var output = this.writeBuffer;

			//swap again for next itteration
			if (needSwap) {
				this.swap();
			}

			//remove start image after render
			startImage = undefined;

			//send output to next step
			return output;

	}.bind(this);

};
