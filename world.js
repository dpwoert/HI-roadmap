window.World = function(){

	var dpr = window.devicePixelRatio = 1;
	var width = window.innerWidth * dpr;
	var height = window.innerHeight * dpr;

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0xf5f5f5, 1 );
	renderer.setSize(width, height);

	//add DOM element
	var canvas = document.getElementById('canvas');
	canvas.appendChild( renderer.domElement );

	//setup scene
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
	this.camera.position.set(0,0,-100);
	this.camera.lookAt(new THREE.Vector3(0,0,0));

	//rotated group
	this.rotated = new THREE.Object3D();
	this.rotated.rotateY(Math.PI);
	this.scene.add(this.rotated)

	//render manager to add abbility to play and add FX
	this.renderManager = new THREE.renderPipeline(renderer);
	var renderPass = new THREE.RenderStep(width, height, this.scene, this.camera);
	var copy = new THREE.ShaderStep(width, height);

	//copypass
	copy
		.shader('vertex', document.getElementById('copyVertex').textContent )
		.shader('fragment', document.getElementById('copyFragment').textContent )
		.pipe()
		.renderToScreen();

	//create globe
	var cells = 5;
	this.radius = 10;

	//get colors
	var loader = new THREE.XHRLoader();
	loader.load('data/map.json', function (res) {

		var geometry = new THREE.IcosahedronGeometry( this.radius, cells );
		// var geometry = new THREE.SphereGeometry( radius, cells, cells );
		var material = new THREE.MeshPhongMaterial({
			// color: 0xff0000,
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors,
			// opacity: 0.7,
			// transparent: true,
		});
		var mesh = new THREE.Mesh( geometry, material );

		var faces = JSON.parse( res );
		faces.forEach(function(face, i){
			// console.log(i, face.inside);
			var color = !face.inside ? 1 : 0.2;
			geometry.faces[i].color = new THREE.Color(color, color, color);
		});

		//heights
		var center = new THREE.Vector3(0,0,0);
		geometry.vertices.forEach(function(vertex){
			var offset = Math.random();
			vertex = vertex.lerp(center, -offset/25);
		});

		//add test route
		var route = new Route(this);
		route

			//ring
			.add(51.507351, -0.127758)
			.add(30.044420, 31.235712, 4)
			.add(19.075984, 72.877656, 4)
			.add(-33.867487, 151.20699, 8)

			.build();

		this.scene.add(mesh);

		//create lightning
		var light = new THREE.HemisphereLight( 0xffffff, 0xdddddd, 0.5 );
		var directLight = new THREE.PointLight( 0xffffff, 1, 120 );
		directLight.position.set( 0, 50, -50 );
		this.scene.add(light);
		this.scene.add(directLight);

		window._geom = geometry;
		window._radius = this.radius;

	}.bind(this));

	// geometry.faces.forEach(function(face){
	// 	var color = Math.random() > 0.5 ? 1 : 0;
	// 	face.color = new THREE.Color(color, color, color);
	// });

	//add controls
	controls = new THREE.OrbitControls( this.camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.2;
	controls.rotateSpeed = 0.2;
	// controls.autoRotate = true;
	controls.autoRotateSpeed = -0.1;
	// controls.target.copy(center);

	// make pipeline
	this.renderManager
		// .pipe('main', renderPass)
		// .pipe('toScreen', copy)
		.pipe('render', function(){
			renderer.render(this.scene, this.camera);
		}.bind(this))
		.pipe('controls', controls.update.bind(controls))
		.start();

	// window.scene = scene;
	// window.camera = camera;

};
