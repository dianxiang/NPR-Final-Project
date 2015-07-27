
if( !Detector.webgl ) Detector.addGetWebGLMessage();

var container, camera, scene, renderer, controls;
var mesh;
var light;

init();
animate();

function loadShaderContents(contents) {
	contents.vertexShader = document.getElementById( 'vertShader' ).textContent;
	contents.fragmentShader = document.getElementById( 'fragShader' ).textContent;
}

function init() {

	// Creating WebGL renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xecf0f1);

	// Putting it onto an HTML div
	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	// Camera position 
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 200, 0 );

	// Scene with objects
	scene = new THREE.Scene();
	
	light = new THREE.SpotLight( 0xff0aaa, 1, 1000 );
	light.position.set(200, 200, 0).normalize();
	scene.add(light);

	// Objects and meshes
	// var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
	var geometry = new THREE.SphereGeometry( 5, 32, 32 );
	// Loading shaders
	var shaderContents = {};
	loadShaderContents(shaderContents);
	

	var shininess = 50, specular = 0x333333, bumpScale = 3, shading = THREE.SmoothShading;

	var hatchTextures = [
		THREE.ImageUtils.loadTexture( "hatch_0.jpg" ),
		THREE.ImageUtils.loadTexture( "hatch_1.jpg" ),
		THREE.ImageUtils.loadTexture( "hatch_2.jpg" ),
		THREE.ImageUtils.loadTexture( "hatch_3.jpg" ),
		THREE.ImageUtils.loadTexture( "hatch_4.jpg" ),
		THREE.ImageUtils.loadTexture( "hatch_5.jpg" )
	]

	for( var i = 0; i < hatchTextures.length; i++ ) {
		var tex = hatchTextures[i];
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
	}

	var buckets = [0.0, 0.2, 0.4, 0.6, 0.8, 1.1];

	var material = new THREE.ShaderMaterial( { 
		  uniforms: THREE.UniformsUtils.merge( [
		  	  THREE.UniformsLib['lights'],
			  { 
			  	hatchTextures: { type: "tv", value: null },
				buckets: { type: 'fv1', value: buckets }
			  }
		  ]), 
		  vertexShader: shaderContents.vertexShader, 
		  fragmentShader: "#define BUCKET_SIZE " + 
		  				  buckets.length + " \n" + 
		  				  shaderContents.fragmentShader,  
		  transparent: true,
		  lights: true
	} );
	material.uniforms.hatchTextures.value = hatchTextures;

	// var material = new THREE.MeshPhongMaterial( {
	// 	map: imgTexture, 
	// 	bumpMap: imgTexture,
	// 	bumpScale: bumpScale, 
	// 	// color: 0x00ff00, 
	// 	specular: specular, 
	// 	shininess: shininess,
	// 	shading: shading } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );


	// Rotation controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// event listener
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	var timer = Date.now() * 0.00025;
	light.position.x = Math.sin( timer * 7 ) * 300;
	light.position.y = Math.cos( timer * 5 ) * 300;
	light.position.z = Math.cos( timer * 3 ) * 300;
	renderer.render( scene, camera );
}