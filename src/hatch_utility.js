var HATCH_UTILITY = {};

HATCH_UTILITY.loadShaderContents = function( vertShaderDomId, fragShaderDomId ) {
	var contents = {};
	contents.vertexShader = document.getElementById( vertShaderDomId ).textContent;
	contents.fragmentShader = document.getElementById( fragShaderDomId ).textContent;
	return contents;
}

HATCH_UTILITY.shaderContents = function() {
	return {
		vertexShader : [
			"varying vec2 vUv;",
			"varying vec3 vecPos;",
			"varying vec3 vecWorldNormal;",

			"uniform vec2 repeat;",

			"void main() {",
				"vUv = repeat * uv;",
				"vecPos = (modelMatrix * vec4(position, 1.0 )).xyz;",
				"vecWorldNormal = normalMatrix * normal;",
				"gl_Position = projectionMatrix * viewMatrix *",
				"              vec4(vecPos, 1.0);",
			"}"
		].join('\n'),

		fragmentShader : [
			"precision highp float;",

			"varying vec2 vUv;",
			"varying vec3 vecPos;",
			"varying vec3 vecWorldNormal;",


			"uniform sampler2D hatchShade; ",
			"uniform sampler2D hatchShade1;",
			"uniform sampler2D hatchShade2;",
			"uniform sampler2D hatchShade3;",
			"uniform sampler2D hatchShade4;",

			"uniform float buckets[BUCKET_SIZE];",

			"uniform vec3 spotLightColor[MAX_SPOT_LIGHTS];",
			"uniform vec3 spotLightPosition[MAX_SPOT_LIGHTS];",
			"uniform float spotLightDistance[MAX_SPOT_LIGHTS];",
			 
			"void main(void) {",
			    
			    "// Calculating light information",
			    "vec4 addedLights = vec4(0.0,0.0,0.0,1.0);",
			    "for(int l = 0; l < MAX_SPOT_LIGHTS; l++) {",
			        "vec3 lightDirection = normalize( vecPos - spotLightPosition[l] );",
			        "float dotLight = dot( -lightDirection, vecWorldNormal );",
			        "addedLights.rgb += clamp( dotLight, dotLight, dotLight ) ",
			        				   "* spotLightColor[l];",
			    "}",

			    "// Bucketing the colors",
			    "vec4 textureColor;",
			    "float mult;",


			    //  More realistic luminosity calculation
			    // "float luminosity = 0.21 * addedLights.r + ", 
			    // 				   "0.72 * addedLights.g + ",
			    // 				   "0.07 * addedLights.b; ",
				"float luminosity = (addedLights.r + addedLights.g + addedLights.b) / 3.0;",

			    "if( luminosity < buckets[0] ) { ",
			    "	float mult = abs(buckets[1] - luminosity)/(buckets[1] - buckets[0]);",
			    "	textureColor = texture2D( hatchShade4, vUv ) * mult + texture2D( hatchShade3, vUv ) * mult;",
			    "} else if( luminosity < buckets[1] ) { ",
			    "	float mult = abs(buckets[2] - luminosity)/(buckets[2] - buckets[1]);",
			    "	textureColor = texture2D( hatchShade3, vUv ) * mult + texture2D( hatchShade2, vUv ) * mult;",
			    "} else if( luminosity < buckets[2] ) { ",
			    "	float mult = abs(buckets[3] - luminosity)/(buckets[3] - buckets[2]);",
			    "	textureColor = texture2D( hatchShade2, vUv ) * mult + texture2D( hatchShade1, vUv ) * mult;",
			    "} else if( luminosity < buckets[3] ) { ",
			    "	float mult = abs(buckets[4] - luminosity)/(buckets[4] - buckets[3]);",
			    "	textureColor = texture2D( hatchShade1, vUv ) * mult + texture2D( hatchShade, vUv ) * mult;",
			    "} else { ",
			    "	float mult = abs(1.0 - luminosity)/(1.0 - buckets[4]);",
			    "	textureColor = vec4(0.1, 0.1, 0.1, 1.0);",
			    "}",

			    // "for(int c = 0; c < 3; c++ ) {",
			    // 	"for( int i = 1; i < BUCKET_SIZE ; i++ ) {",
			    // 		"if( addedLights[c] < buckets[i] ) {",
			    // 			"mult = abs(addedLights[c] - buckets[i])/(buckets[i] - buckets[i-1]);",
		    	// 			"textureColor = (1.0-mult)*texture2D(hatchShade[BUCKET_SIZE-i-1],vUv);",
		    	// 			"textureColor = textureColor + mult*texture2D(hatchShade[BUCKET_SIZE-i],vUv);",
			    // 			"break;",
			    // 		"}",

				   //  "}	",
			    // "}",
			    "gl_FragColor = textureColor;",
			    // "gl_FragColor = vec4(luminosity, 0.0, 0.0, 1.0);",
			"}"
		].join('\n')
	}
}


HATCH_UTILITY.generateMipMap = function( size, color ) {

	var imageCanvas = document.createElement( "canvas" );
	var context = imageCanvas.getContext( "2d" );

	imageCanvas.width = imageCanvas.height = size;

	context.fillStyle = "#444";
	context.fillRect( 0, 0, size, size );

	context.fillStyle = color;
	context.fillRect( 0, 0, size, size );
	// context.fillRect( size / 2, size / 2, size / 2, size / 2 );

	return imageCanvas;
}

HATCH_UTILITY.getShaderMaterial = function( shaderContents ) {
	// var hatchTextures = [
	// 	THREE.ImageUtils.loadTexture( "hatch_0.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hatch_1.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hatch_2.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hatch_3.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hatch_4.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hatch_5.jpg" )
	// ]
	
	// var hatchTextures1 = [
	// 	THREE.ImageUtils.loadTexture( "hs_11.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_21.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_31.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_41.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_51.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_61.jpg" )
	// ]
	// var hatchTextures2 = [
	// 	THREE.ImageUtils.loadTexture( "hs_12.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_22.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_32.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_42.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_52.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_62.jpg" )
	// ]
	// var hatchTextures3 = [
	// 	THREE.ImageUtils.loadTexture( "hs_13.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_23.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_33.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_43.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_53.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_63.jpg" )
	// ]
	// var hatchTextures4 = [
	// 	THREE.ImageUtils.loadTexture( "hs_13.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_23.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_33.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_43.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_53.jpg" ),
	// 	THREE.ImageUtils.loadTexture( "hs_63.jpg" )
	// ]

	// for( var i = 0; i < hatchTextures1.length; i++ ) {
	// 	var tex = hatchTextures1[i];
	// 	tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
	// }

	var buckets = [0.2, 0.4, 0.6, 0.8, 1.1];

	var hatchShaderContents = HATCH_UTILITY.shaderContents();

	var material = new THREE.ShaderMaterial( { 
		  uniforms: THREE.UniformsUtils.merge([
		  	  THREE.UniformsLib['lights'],
			  { 
			  	hatchShade: { type: "t", value: null },
			  	hatchShade1: { type: "t", value: null },
			  	hatchShade2: { type: "t", value: null },
			  	hatchShade3: { type: "t", value: null },
			  	hatchShade4: { type: "t", value: null },
				buckets: { type: 'fv1', value: buckets },
				zoomLevel: { type: 'f', value: null},
				repeat: { type: "v2", value: new THREE.Vector2(0, 0) }
			  }
		  ]), 
		  vertexShader: hatchShaderContents.vertexShader, 
		  fragmentShader: "#define BUCKET_SIZE " + 
		  				  buckets.length + " \n" + 
		  				  hatchShaderContents.fragmentShader,  
		  transparent: true,
		  lights: true
	} );


	var hatchShadeCanvas = HATCH_UTILITY.generateMipMap( 64, "#000" );
	var hatchShadeCanvas1 = HATCH_UTILITY.generateMipMap( 64, "#f00" );
	var hatchShadeCanvas2 = HATCH_UTILITY.generateMipMap( 64, "#0f0" );
	var hatchShadeCanvas3 = HATCH_UTILITY.generateMipMap( 64, "#00f" );
	var hatchShadeCanvas4 = HATCH_UTILITY.generateMipMap( 64, "#0ff" );

	var hatchShadeTexture =  new THREE.Texture( hatchShadeCanvas, 
		THREE.UVMapping, 
		THREE.RepeatWrapping, 
		THREE.RepeatWrapping,
		THREE.NearestFilter,
		THREE.LinearMipMapLinearFilter );
	var hatchShadeTexture1 = new THREE.Texture( hatchShadeCanvas1, 
		THREE.UVMapping, 
		THREE.RepeatWrapping, 
		THREE.RepeatWrapping,
		THREE.NearestFilter,
		THREE.LinearMipMapLinearFilter );
	var hatchShadeTexture2 = new THREE.Texture( hatchShadeCanvas2, 
		THREE.UVMapping, 
		THREE.RepeatWrapping, 
		THREE.RepeatWrapping,
		THREE.NearestFilter,
		THREE.LinearMipMapLinearFilter );
	var hatchShadeTexture3 = new THREE.Texture( hatchShadeCanvas3, 
		THREE.UVMapping, 
		THREE.RepeatWrapping, 
		THREE.RepeatWrapping,
		THREE.NearestFilter,
		THREE.LinearMipMapLinearFilter );
	var hatchShadeTexture4 = new THREE.Texture( hatchShadeCanvas4, 
		THREE.UVMapping, 
		THREE.RepeatWrapping, 
		THREE.RepeatWrapping,
		THREE.NearestFilter,
		THREE.LinearMipMapLinearFilter );

	hatchShadeTexture.mipmaps[0] = hatchShadeCanvas;
	hatchShadeTexture.mipmaps[1] = HATCH_UTILITY.generateMipMap( 32, "#ff0000" );
	hatchShadeTexture.mipmaps[2] = HATCH_UTILITY.generateMipMap( 16, "#00ff00" );
	hatchShadeTexture.mipmaps[3] = HATCH_UTILITY.generateMipMap( 8, "#0000ff" );
	hatchShadeTexture.mipmaps[4] = HATCH_UTILITY.generateMipMap( 4, "#00ffff" );
	hatchShadeTexture.mipmaps[5] = HATCH_UTILITY.generateMipMap( 2, "#ff00ff" );
	hatchShadeTexture.mipmaps[6] = HATCH_UTILITY.generateMipMap( 1, "#ffff00" );

	hatchShadeTexture1.mipmaps[0] = hatchShadeCanvas1;
	hatchShadeTexture1.mipmaps[1] = HATCH_UTILITY.generateMipMap( 32, "#ff0000" );
	hatchShadeTexture1.mipmaps[2] = HATCH_UTILITY.generateMipMap( 16, "#00ff00" );
	hatchShadeTexture1.mipmaps[3] = HATCH_UTILITY.generateMipMap( 8, "#0000ff" );
	hatchShadeTexture1.mipmaps[4] = HATCH_UTILITY.generateMipMap( 4, "#00ffff" );
	hatchShadeTexture1.mipmaps[5] = HATCH_UTILITY.generateMipMap( 2, "#ff00ff" );
	hatchShadeTexture1.mipmaps[6] = HATCH_UTILITY.generateMipMap( 1, "#ffff00" );

	hatchShadeTexture2.mipmaps[0] = hatchShadeCanvas2;
	hatchShadeTexture2.mipmaps[1] = HATCH_UTILITY.generateMipMap( 32, "#ff0000" );
	hatchShadeTexture2.mipmaps[2] = HATCH_UTILITY.generateMipMap( 16, "#00ff00" );
	hatchShadeTexture2.mipmaps[3] = HATCH_UTILITY.generateMipMap( 8, "#0000ff" );
	hatchShadeTexture2.mipmaps[4] = HATCH_UTILITY.generateMipMap( 4, "#00ffff" );
	hatchShadeTexture2.mipmaps[5] = HATCH_UTILITY.generateMipMap( 2, "#ff00ff" );
	hatchShadeTexture2.mipmaps[6] = HATCH_UTILITY.generateMipMap( 1, "#ffff00" );

	hatchShadeTexture3.mipmaps[0] = hatchShadeCanvas3;
	hatchShadeTexture3.mipmaps[1] = HATCH_UTILITY.generateMipMap( 32, "#ff0000" );
	hatchShadeTexture3.mipmaps[2] = HATCH_UTILITY.generateMipMap( 16, "#00ff00" );
	hatchShadeTexture3.mipmaps[3] = HATCH_UTILITY.generateMipMap( 8, "#0000ff" );
	hatchShadeTexture3.mipmaps[4] = HATCH_UTILITY.generateMipMap( 4, "#00ffff" );
	hatchShadeTexture3.mipmaps[5] = HATCH_UTILITY.generateMipMap( 2, "#ff00ff" );
	hatchShadeTexture3.mipmaps[6] = HATCH_UTILITY.generateMipMap( 1, "#ffff00" );

	hatchShadeTexture4.mipmaps[0] = hatchShadeCanvas4;
	hatchShadeTexture4.mipmaps[1] = HATCH_UTILITY.generateMipMap( 32, "#ff0000" );
	hatchShadeTexture4.mipmaps[2] = HATCH_UTILITY.generateMipMap( 16, "#00ff00" );
	hatchShadeTexture4.mipmaps[3] = HATCH_UTILITY.generateMipMap( 8, "#0000ff" );
	hatchShadeTexture4.mipmaps[4] = HATCH_UTILITY.generateMipMap( 4, "#00ffff" );
	hatchShadeTexture4.mipmaps[5] = HATCH_UTILITY.generateMipMap( 2, "#ff00ff" );
	hatchShadeTexture4.mipmaps[6] = HATCH_UTILITY.generateMipMap( 1, "#ffff00" );

	material.uniforms.repeat.value.set( 10, 10 );
	material.uniforms.hatchShade.value = hatchShadeTexture;
	material.uniforms.hatchShade1.value = hatchShadeTexture1;
	material.uniforms.hatchShade2.value = hatchShadeTexture2;
	material.uniforms.hatchShade3.value = hatchShadeTexture3;
	material.uniforms.hatchShade4.value = hatchShadeTexture4;

	hatchShadeTexture.needsUpdate = true; 
	hatchShadeTexture1.needsUpdate = true;
	hatchShadeTexture2.needsUpdate = true;
	hatchShadeTexture3.needsUpdate = true;
	hatchShadeTexture4.needsUpdate = true;


	return material;
}
