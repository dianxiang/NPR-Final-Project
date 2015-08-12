if( !Detector.webgl ) Detector.addGetWebGLMessage();

var container, camera, scene, renderer, controls;
var mesh;
var light;
var zoomLevel;

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
	zoomLevel = 1;
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


	var hatchTextures1 = [
		THREE.ImageUtils.loadTexture( "hs_11.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_21.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_31.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_41.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_51.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_61.jpg" )
	]
	var hatchTextures2 = [
		THREE.ImageUtils.loadTexture( "hs_12.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_22.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_32.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_42.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_52.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_62.jpg" )
	]
	var hatchTextures3 = [
		THREE.ImageUtils.loadTexture( "hs_13.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_23.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_33.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_43.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_53.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_63.jpg" )
	]
	var hatchTextures4 = [
		THREE.ImageUtils.loadTexture( "hs_13.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_23.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_33.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_43.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_53.jpg" ),
		THREE.ImageUtils.loadTexture( "hs_63.jpg" )
	]

	for( var i = 0; i < hatchTextures1.length; i++ ) {
		var tex = hatchTextures1[i];
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
	}

	var buckets = [0.0, 0.2, 0.4, 0.6, 0.8, 1.1];

	var material = new THREE.ShaderMaterial( { 
		  uniforms: THREE.UniformsUtils.merge([
		  	  THREE.UniformsLib['lights'],
			  { 
			  	hatchTextures: { type: "tv", value: null },
			  	hatchTextures1: { type: "tv", value: null },
			  	hatchTextures2: { type: "tv", value: null },
			  	hatchTextures3: { type: "tv", value: null },
			  	hatchTextures4: { type: "tv", value: null },
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
	material.uniforms.hatchTextures1.value = hatchTextures1;
	material.uniforms.hatchTextures2.value = hatchTextures2;
	material.uniforms.hatchTextures3.value = hatchTextures3;
	material.uniforms.hatchTextures4.value = hatchTextures4;

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
	if (camera.position.y > 160){
		zoomLevel = 1;
	}
	else if (camera.position.y > 120){
		zoomLevel = 2;
	}
	else if (camera.position.y > 80){
		zoomLevel = 3;
	}
	else {
		zoomLevel = 4;
	}
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