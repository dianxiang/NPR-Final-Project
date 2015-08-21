if( !Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer;
var object, light;

var normalRenderTarget, normalEdgeComposer, 
	depthRenderTarget, depthEdgeComposer, 
	testRenderTarget, testEdgeComposer,
	finalComposer;

var edgePass;

var hatchShaderMaterial, normalMaterial, depthMaterial;
var loader, onProgress, onError;

var controls;

window.onload = function() {
	init();
	animate();	
}


function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 200;
	camera.position.y = 100;


	scene = new THREE.Scene();
	normalScene = new THREE.Scene();
	depthScene = new THREE.Scene();


	light = new THREE.SpotLight( 0xffffff, 1.0, 1000 );
	light.position.set(200, 200, 0).normalize();
	scene.add(light);

	scene.add( new THREE.AmbientLight( 0xffffff ) );

	normalRenderTarget = new THREE.WebGLRenderTarget( 
			window.innerWidth,
			window.innerHeight,
			{ minFilter: THREE.LinearFilter, 
			  magFilter: THREE.NearestFilter,
			  format: THREE.RGBFormat } );

	depthRenderTarget = new THREE.WebGLRenderTarget( 
			window.innerWidth,
			window.innerHeight,
			{ minFilter: THREE.LinearFilter, 
			  magFilter: THREE.NearestFilter,
			  format: THREE.RGBFormat } );
	var zoomLevel = 3.0;

	normalMaterial = new THREE.MeshNormalMaterial();
	depthMaterial = new THREE.MeshDepthMaterial();
	hatchShaderMaterial = HATCH_UTILITY.getShaderMaterial(zoomLevel);

	// Teapot object
	/*onProgress = function( xhr ) { console.log( "loading" ); }
	onError = function( xhr ) { alert( "FUCK, can't load this shit!" ); };
	loader = new THREE.OBJLoader();
	loader.load( 'teapot/teapot.obj', function( object ) {
		normalObject = object.clone();
		depthObject = object.clone();
		for( var i = 0; i < object.children.length; i++ ) {
			// object.rotation.x = -90;
			object.children[i].material = hatchShaderMaterial;
			object.children[i].geometry.computeVertexNormals();
			
			normalObject.children[i].material = normalMaterial;
			normalObject.children[i].geometry.computeVertexNormals();

			depthObject.children[i].material = depthMaterial;
			depthObject.children[i].geometry.computeVertexNormals();
		}

		scene.add( object );
		normalScene.add( normalObject );
		depthScene.add( depthObject );
		
	}, onProgress, onError );

*/
	// // Box Geometry
	// var boxGeometry = new THREE.BoxGeometry( 50, 50, 50 );
	// var boxObj = new THREE.Mesh( boxGeometry, hatchShaderMaterial );
	// var normalBoxObj = new THREE.Mesh( boxGeometry, normalMaterial );
	// var depthBoxObj = new THREE.Mesh( boxGeometry, depthMaterial );

	// boxObj.position.set(150, 30, 0);
	// normalBoxObj.position.set(150, 30, 0);
	// depthBoxObj.position.set(150, 30, 0);
	
	// scene.add( boxObj );
	// normalScene.add( normalBoxObj );
	// depthScene.add( depthBoxObj );

	// // Torus Geometry
	// var torusGeometry = new THREE.TorusKnotGeometry( 30, 5, 100, 16 );
	// var torusObj = new THREE.Mesh( torusGeometry, hatchShaderMaterial );
	// var normalTorusObj = new THREE.Mesh( torusGeometry, normalMaterial );
	// var depthTorusObj = new THREE.Mesh( torusGeometry, depthMaterial );

	// torusObj.position.set(-150, 30, 0);
	// normalTorusObj.position.set(-150, 30, 0);
	// depthTorusObj.position.set(-150, 30, 0);
	
	// scene.add( torusObj );
	// normalScene.add( normalTorusObj );
	// depthScene.add( depthTorusObj );

	// Sphere Geometry
	var sphereGeometry = new THREE.SphereGeometry( 40, 32, 32 );
	var sphereObj = new THREE.Mesh( sphereGeometry, hatchShaderMaterial );
	var normalSphereObj = new THREE.Mesh( sphereGeometry, normalMaterial );
	var depthSphereObj = new THREE.Mesh( sphereGeometry, depthMaterial );

	sphereObj.computeVertexNormals();
	normalSphereObj.computeVertexNormals();
	depthSphereObj.computeVertexNormals();

	sphereObj.position.set(0, 160, 0);
	normalSphereObj.position.set(0, 160, 0);
	depthSphereObj.position.set(0, 160, 0);
	
	scene.add( sphereObj );
	normalScene.add( normalSphereObj );
	depthScene.add( depthSphereObj );


	
	// Creating render pass to render normal, depth to a frame buffer
	var normalRenderPass = new THREE.RenderPass( normalScene, camera );
	var depthRenderPass = new THREE.RenderPass( depthScene, camera );

	// Creating shader pass to pass render pass information to edge filter
	// Edge filtering shader can be found at EdgeShader2.js
	edgePass = new THREE.ShaderPass( THREE.EdgeShader2 );
	var copyPass = new THREE.ShaderPass( THREE.CopyShader );
	// Last pass renders to frame buffer rather than to internal frame buffer
	copyPass.renderToScreen = true; 

	// Creating normalImage -> edgeFilter -> output picture composer 
	// Results rendered to normalRenderTarget
	normalEdgeComposer = new THREE.EffectComposer( renderer, normalRenderTarget );
	normalEdgeComposer.addPass( normalRenderPass );
	normalEdgeComposer.addPass( edgePass );
	normalEdgeComposer.addPass( copyPass );

	// Creating depthImage -> edgeFilter -> output picture composer
	depthEdgeComposer = new THREE.EffectComposer( renderer, depthRenderTarget );
	depthEdgeComposer.addPass( depthRenderPass );
	depthEdgeComposer.addPass( edgePass );
	depthEdgeComposer.addPass( copyPass );

	// Test render pass to view intermediate results
	// This one views what the normal pass looks like
	var testRenderPass = new THREE.RenderPass( normalScene, camera );
	testEdgeComposer = new THREE.EffectComposer( renderer, testRenderTarget );
	testEdgeComposer.addPass( testRenderPass );
	testEdgeComposer.addPass( copyPass );

	// Creating render pass with hatching scene material
	var renderModel = new THREE.RenderPass( scene, camera );
	renderModel.renderToScreen = true;

	// Creating shader pass that blends all three together
	// Blend shader can be found at src/edgeBlendShader.js
	var edgesModelBlendPass = new THREE.ShaderPass( THREE.EdgeBlendShader );
	edgesModelBlendPass.renderToScreen = true;
	// 
	edgesModelBlendPass.uniforms[ "tNormalEdge" ].value = normalEdgeComposer.renderTarget1;
	edgesModelBlendPass.uniforms[ "tDepthEdge" ].value = depthEdgeComposer.renderTarget1;
	edgesModelBlendPass.uniforms[ "tTestEdge" ].value = testEdgeComposer.renderTarget2;

	// Renders the hatch scene, then uses tNormalEdge, tDepthEdge 
	// and the rendered scene to compose the final scene.
	finalComposer = new THREE.EffectComposer( renderer );
	finalComposer.addPass( renderModel );
	finalComposer.addPass( edgesModelBlendPass );

	// Creating rotating controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'keypress', onKeyPress, false );

}

function onWindowResize() {
	// There's a bug in window resize where things are pixellated :( but ignore :P
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	edgePass.uniforms[ 'aspect' ].value.x = window.innerWidth;
	edgePass.uniforms[ 'aspect' ].value.y = window.innerHeight;
}

function onKeyPress() {
	var timer = Date.now() * 0.00025;

	light.position.x = 70.139;//Math.sin( timer * 7 ) * 100;
	light.position.y = 70.3028;//Math.cos( timer * 5 ) * 100;
	light.position.z = 70.9542;//96.4621299747294;//Math.cos( timer * 3 ) * 100;
	camera.position.z = 200;
	camera.position.y = 100;
	console.log( light );
	console.log( camera);
}

function animate() {
	requestAnimationFrame( animate );

	// var timer = Date.now() * 0.00025;
	// light.position.x = Math.sin( timer * 7 ) * 100;
	// light.position.y =Math.cos( timer * 5 ) * 100;
	// light.position.z = Math.cos( timer * 3 ) * 100;


	renderer.setClearColor(0xffffff);
	normalEdgeComposer.render( 0.1 );
	depthEdgeComposer.render( 0.1 );
	testEdgeComposer.render( 0.1 );
	finalComposer.render();
	// renderer.render( scene, camera );
}