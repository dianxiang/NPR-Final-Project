
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
	
	light = new THREE.SpotLight( 0xffffff, 1, 1000 );
	light.position.set(200, 200, 0).normalize();
	scene.add(light);

	// Objects and meshes
	var geometry = new THREE.SphereGeometry( 50, 100, 100 );

	// Loading shaders
	var shaderContents = {};
	loadShaderContents(shaderContents);
	
	// var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
	var shininess = 50, specular = 0x333333, bumpScale = 3, shading = THREE.SmoothShading;
	var imgTexture = THREE.ImageUtils.loadTexture( "hatch_0.jpg" );
	imgTexture.magFilter = THREE.NearestFilter;

	var material = new THREE.ShaderMaterial( { 
		  uniforms: { 
			color: { type: 'f', value: 0.0 },
			hatch0: { type: 't', value: imgTexture }
		  }, 
		  vertexShader: shaderContents.vertexShader, 
		  fragmentShader: shaderContents.fragmentShader,  
		  transparent: true
	} );


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