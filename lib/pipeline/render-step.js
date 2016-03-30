THREE.RenderStep = function(width, height, scene, camera){

	var renderer, scene, camera;
	var buffer = new THREE.WebGLRenderTarget(width, height, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType,
		// stencilBuffer:false,
		// depthBuffer:false
	});
	buffer.texture.generateMipmaps = false;

	/**
	 * Do resize of buffer
	 * @param {number} width
	 * @param {number} height
	 */
	this.setSize = function(_width, _height){

		var oldBuffer = buffer;

		width = _width;
		height = _height;

		//cloning of buffers, and set new size
		buffer = buffer.clone();
		buffer.width = width;
		buffer.height = height;

		//dispose old buffer
		oldBuffer.dispose();
	};

	/**
	 * Link to another shader
	 * @return {Buffer} - WebGL Buffer to use in other shaders
	 */
	this.link = function(){
		return buffer;
	};

	/**
	 * Bind to WebGL renderer
	 * @private
	 */
	this.create = function(_renderer){
		renderer = _renderer
	};

	/**
	 * Render a frame
	 * @return {Buffer} Reference to rendered buffer
	 */
	this.render = function(){
		renderer.render( scene, camera, buffer );
		return buffer;
	};

};
