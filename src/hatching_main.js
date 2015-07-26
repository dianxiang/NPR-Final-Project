if( !Detector.webgl ) Detector.addGetWebGLMessage();

var container, camera, scene, renderer, controls;
var mesh;
var light;

init();
animate();

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
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 1, 1, 1 ).normalize();
	scene.add( directionalLight );
	
	light = new THREE.DirectionalLight( 0xffffff, 2, 800 );
	light.position.set(1, 1, 0).normalize();
	scene.add(light);

	var ambientLight = new THREE.AmbientLight( 0x444444 );
	scene.add( ambientLight );

	// Objects and meshes
	var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	// var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
	var shininess = 50, specular = 0x333333, bumpScale = 3, shading = THREE.SmoothShading;
	var imgTexture = THREE.ImageUtils.loadTexture( "lavatile.jpg" );
	// imgTexture.warpS = imgTexture.wrapT = THREE.RepeatWrapping;
	imgTexture.anisotropy = 16;
	var material = new THREE.MeshPhongMaterial( {
		map: imgTexture, 
		bumpMap: imgTexture,
		bumpScale: bumpScale, 
		// color: 0x00ff00, 
		specular: specular, 
		shininess: shininess,
		shading: shading } );

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
	light.position.x = Math.sin( timer * 7 ) * 50;
	light.position.y = Math.cos( timer * 5 ) * 50;
	light.position.z = Math.cos( timer * 3 ) * 50;
	renderer.render( scene, camera );
}