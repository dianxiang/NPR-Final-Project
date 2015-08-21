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
			"uniform sampler2D hatchShade5;",

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
			    "	float mult = abs(luminosity - buckets[0])/(buckets[1] - buckets[0]);",
			    "	textureColor = texture2D( hatchShade5, vUv ) * (mult) + texture2D( hatchShade4, vUv ) * (1.0-mult);",
			    "} else if( luminosity < buckets[1] ) { ",
			    "	float mult = abs(luminosity - buckets[1])/(buckets[2] - buckets[1]);",
			    "	textureColor = texture2D( hatchShade4, vUv ) * (mult) + texture2D( hatchShade3, vUv ) * (1.0-mult);",
			    "} else if( luminosity < buckets[2] ) { ",
			    "	float mult = abs(luminosity - buckets[2])/(buckets[3] - buckets[2]);",
			    "	textureColor = texture2D( hatchShade3, vUv ) * (mult) + texture2D( hatchShade2, vUv ) * (1.0-mult);",
			    "} else if( luminosity < buckets[3] ) { ",
			    "	float mult = abs(luminosity - buckets[3])/(buckets[4] - buckets[3]);",
			    "	textureColor = texture2D( hatchShade2, vUv ) * (mult) + texture2D( hatchShade1, vUv ) * (1.0-mult);",
			    "} else { ",
			    "	float mult = abs(1.0 - luminosity)/(1.0 - buckets[4]);",
			    "	textureColor = texture2D( hatchShade1, vUv ) * (mult) + texture2D( hatchShade, vUv ) * (1.0-mult);",
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
			    //"if (textureColor[0] > 0.9){",
			    //	"gl_FragColor = vec4(1.0,1.0,1.0,1.0);",
			    //"}",
			    //"else {",
			    //	"gl_FragColor = vec4(0.0,0.0,0.0,1.0);",
			    //"}",
			    "gl_FragColor = textureColor;",
			    // "gl_FragColor = vec4(luminosity, 0.0, 0.0, 1.0);",
			"}"
		].join('\n')
	}
}


/*HATCH_UTILITY.generateMipMap = function( size, color ) {

	var imageCanvas = document.createElement( "canvas" );
	var context = imageCanvas.getContext( "2d" );

	imageCanvas.width = imageCanvas.height = size;

	context.fillStyle = "#444";
	context.fillRect( 0, 0, size, size );

	context.fillStyle = color;
	context.fillRect( 0, 0, size, size );
	// context.fillRect( size / 2, size / 2, size / 2, size / 2 );

	return imageCanvas;
}*/

HATCH_UTILITY.generateMipMapFromJPG = function(size,sizeString,name){

	var c=document.getElementById(name);
	var ctx=c.getContext("2d");
	var imageName = name.concat("I");

	var img = document.getElementById(imageName);

	/*var img = document.createElement(imageName);
	img = new Image();
	img.src = name + ".jpg";
	img.width = sizeString;
	img.height = sizeString;
*/

	var pat=ctx.createPattern(img,'no-repeat');
	ctx.rect(0,0,size,size);
	ctx.fillStyle=pat;
	ctx.fillRect(0,0,size,size);
	return c;

}


HATCH_UTILITY.getShaderMaterial = function( shaderContents ) {

	var buckets = [0.2, 0.4, 0.6, 0.8, 1.0];

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
			  	hatchShade5: { type: "t", value: null },
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

	var hatchShadeCanvas  = HATCH_UTILITY.generateMipMapFromJPG( 512,"512", "Frame512tone1");
	var hatchShadeCanvas1 = HATCH_UTILITY.generateMipMapFromJPG( 512,"512", "Frame512tone2");
	var hatchShadeCanvas2 = HATCH_UTILITY.generateMipMapFromJPG( 512,"512", "Frame512tone3");
	var hatchShadeCanvas3 = HATCH_UTILITY.generateMipMapFromJPG( 512,"512", "Frame512tone4");
	var hatchShadeCanvas4 = HATCH_UTILITY.generateMipMapFromJPG( 512,"512", "Frame512tone5");
	var hatchShadeCanvas5 = HATCH_UTILITY.generateMipMapFromJPG( 512,"512", "Frame512tone6");

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
	var hatchShadeTexture5 = new THREE.Texture( hatchShadeCanvas5, 
		THREE.UVMapping, 
		THREE.RepeatWrapping, 
		THREE.RepeatWrapping,
		THREE.NearestFilter,
		THREE.LinearMipMapLinearFilter );

	hatchShadeTexture.mipmaps[0] = hatchShadeCanvas;
	hatchShadeTexture.mipmaps[1] = HATCH_UTILITY.generateMipMapFromJPG( 256,"256", "Frame256tone1");
	hatchShadeTexture.mipmaps[2] = HATCH_UTILITY.generateMipMapFromJPG( 128,"128", "Frame128tone1");
	hatchShadeTexture.mipmaps[3] = HATCH_UTILITY.generateMipMapFromJPG( 64 ,"64","Frame64tone1" ); 
	hatchShadeTexture.mipmaps[4] = HATCH_UTILITY.generateMipMapFromJPG( 32 ,"32","Frame32tone1" ); 
	hatchShadeTexture.mipmaps[5] = HATCH_UTILITY.generateMipMapFromJPG( 16 ,"16","Frame16tone1" ); 
	hatchShadeTexture.mipmaps[6] = HATCH_UTILITY.generateMipMapFromJPG( 8  ,"8","Frame8tone1"  ); 
	hatchShadeTexture.mipmaps[7] = HATCH_UTILITY.generateMipMapFromJPG( 4  ,"4","Frame4tone1"  ); 
	hatchShadeTexture.mipmaps[8] = HATCH_UTILITY.generateMipMapFromJPG( 2  ,"2","Frame2tone1"  ); 
	hatchShadeTexture.mipmaps[9] = HATCH_UTILITY.generateMipMapFromJPG( 1  ,"1","Frame1tone1"  ); 

	hatchShadeTexture1.mipmaps[0] = hatchShadeCanvas1;
	hatchShadeTexture1.mipmaps[1] = HATCH_UTILITY.generateMipMapFromJPG( 256,"256","Frame256tone2");
	hatchShadeTexture1.mipmaps[2] = HATCH_UTILITY.generateMipMapFromJPG( 128,"128","Frame128tone2");
	hatchShadeTexture1.mipmaps[3] = HATCH_UTILITY.generateMipMapFromJPG( 64 ,"64","Frame64tone2" ); 
	hatchShadeTexture1.mipmaps[4] = HATCH_UTILITY.generateMipMapFromJPG( 32 ,"32","Frame32tone2" ); 
	hatchShadeTexture1.mipmaps[5] = HATCH_UTILITY.generateMipMapFromJPG( 16 ,"16","Frame16tone2" ); 
	hatchShadeTexture1.mipmaps[6] = HATCH_UTILITY.generateMipMapFromJPG( 8  ,"8","Frame8tone2"  ); 
	hatchShadeTexture1.mipmaps[7] = HATCH_UTILITY.generateMipMapFromJPG( 4  ,"4","Frame4tone2"  ); 
	hatchShadeTexture1.mipmaps[8] = HATCH_UTILITY.generateMipMapFromJPG( 2  ,"2","Frame2tone2"  ); 
	hatchShadeTexture1.mipmaps[9] = HATCH_UTILITY.generateMipMapFromJPG( 1  ,"1","Frame1tone2"  ); 

	hatchShadeTexture2.mipmaps[0] = hatchShadeCanvas2;
	hatchShadeTexture2.mipmaps[1] = HATCH_UTILITY.generateMipMapFromJPG( 256,"256","Frame256tone3");
	hatchShadeTexture2.mipmaps[2] = HATCH_UTILITY.generateMipMapFromJPG( 128,"128","Frame128tone3");
	hatchShadeTexture2.mipmaps[3] = HATCH_UTILITY.generateMipMapFromJPG( 64 ,"64","Frame64tone3" ); 
	hatchShadeTexture2.mipmaps[4] = HATCH_UTILITY.generateMipMapFromJPG( 32 ,"32","Frame32tone3" ); 
	hatchShadeTexture2.mipmaps[5] = HATCH_UTILITY.generateMipMapFromJPG( 16 ,"16","Frame16tone3" ); 
	hatchShadeTexture2.mipmaps[6] = HATCH_UTILITY.generateMipMapFromJPG( 8  ,"8","Frame8tone3"  ); 
	hatchShadeTexture2.mipmaps[7] = HATCH_UTILITY.generateMipMapFromJPG( 4  ,"4","Frame4tone3"  ); 
	hatchShadeTexture2.mipmaps[8] = HATCH_UTILITY.generateMipMapFromJPG( 2  ,"2","Frame2tone3"  ); 
	hatchShadeTexture2.mipmaps[9] = HATCH_UTILITY.generateMipMapFromJPG( 1  ,"1","Frame1tone3"  ); 

	hatchShadeTexture3.mipmaps[0] = hatchShadeCanvas3;
	hatchShadeTexture3.mipmaps[1] = HATCH_UTILITY.generateMipMapFromJPG( 256,"256","Frame256tone4");
	hatchShadeTexture3.mipmaps[2] = HATCH_UTILITY.generateMipMapFromJPG( 128,"128","Frame128tone4");
	hatchShadeTexture3.mipmaps[3] = HATCH_UTILITY.generateMipMapFromJPG( 64 ,"64","Frame64tone4" ); 
	hatchShadeTexture3.mipmaps[4] = HATCH_UTILITY.generateMipMapFromJPG( 32 ,"32","Frame32tone4" ); 
	hatchShadeTexture3.mipmaps[5] = HATCH_UTILITY.generateMipMapFromJPG( 16 ,"16","Frame16tone4" ); 
	hatchShadeTexture3.mipmaps[6] = HATCH_UTILITY.generateMipMapFromJPG( 8  ,"8","Frame8tone4"  ); 
	hatchShadeTexture3.mipmaps[7] = HATCH_UTILITY.generateMipMapFromJPG( 4  ,"4","Frame4tone4"  ); 
	hatchShadeTexture3.mipmaps[8] = HATCH_UTILITY.generateMipMapFromJPG( 2  ,"2","Frame2tone4"  ); 
	hatchShadeTexture3.mipmaps[9] = HATCH_UTILITY.generateMipMapFromJPG( 1  ,"1","Frame1tone4"  ); 

	hatchShadeTexture4.mipmaps[0] = hatchShadeCanvas4;
	hatchShadeTexture4.mipmaps[1] = HATCH_UTILITY.generateMipMapFromJPG( 256,"256","Frame256tone5");
	hatchShadeTexture4.mipmaps[2] = HATCH_UTILITY.generateMipMapFromJPG( 128,"128","Frame128tone5");
	hatchShadeTexture4.mipmaps[3] = HATCH_UTILITY.generateMipMapFromJPG( 64 ,"64","Frame64tone5" ); 
	hatchShadeTexture4.mipmaps[4] = HATCH_UTILITY.generateMipMapFromJPG( 32 ,"32","Frame32tone5" ); 
	hatchShadeTexture4.mipmaps[5] = HATCH_UTILITY.generateMipMapFromJPG( 16 ,"16","Frame16tone5" ); 
	hatchShadeTexture4.mipmaps[6] = HATCH_UTILITY.generateMipMapFromJPG( 8  ,"8","Frame8tone5"  ); 
	hatchShadeTexture4.mipmaps[7] = HATCH_UTILITY.generateMipMapFromJPG( 4  ,"4","Frame4tone5"  ); 
	hatchShadeTexture4.mipmaps[8] = HATCH_UTILITY.generateMipMapFromJPG( 2  ,"2","Frame2tone5"  ); 
	hatchShadeTexture4.mipmaps[9] = HATCH_UTILITY.generateMipMapFromJPG( 1  ,"1","Frame1tone5"  ); 

	hatchShadeTexture5.mipmaps[0] = hatchShadeCanvas5;
	hatchShadeTexture5.mipmaps[1] = HATCH_UTILITY.generateMipMapFromJPG( 256,"256","Frame256tone6");
	hatchShadeTexture5.mipmaps[2] = HATCH_UTILITY.generateMipMapFromJPG( 128,"128","Frame128tone6");
	hatchShadeTexture5.mipmaps[3] = HATCH_UTILITY.generateMipMapFromJPG( 64 ,"64","Frame64tone6" ); 
	hatchShadeTexture5.mipmaps[4] = HATCH_UTILITY.generateMipMapFromJPG( 32 ,"32","Frame32tone6" ); 
	hatchShadeTexture5.mipmaps[5] = HATCH_UTILITY.generateMipMapFromJPG( 16 ,"16","Frame16tone6" ); 
	hatchShadeTexture5.mipmaps[6] = HATCH_UTILITY.generateMipMapFromJPG( 8  ,"8","Frame8tone6"  ); 
	hatchShadeTexture5.mipmaps[7] = HATCH_UTILITY.generateMipMapFromJPG( 4  ,"4","Frame4tone6"  ); 
	hatchShadeTexture5.mipmaps[8] = HATCH_UTILITY.generateMipMapFromJPG( 2  ,"2","Frame2tone6"  ); 
	hatchShadeTexture5.mipmaps[9] = HATCH_UTILITY.generateMipMapFromJPG( 1  ,"1","Frame1tone6"  ); 

	material.uniforms.repeat.value.set( 10," 10", 10 );
	material.uniforms.hatchShade.value = hatchShadeTexture;
	material.uniforms.hatchShade1.value = hatchShadeTexture1;
	material.uniforms.hatchShade2.value = hatchShadeTexture2;
	material.uniforms.hatchShade3.value = hatchShadeTexture3;
	material.uniforms.hatchShade4.value = hatchShadeTexture4;
	material.uniforms.hatchShade5.value = hatchShadeTexture5;

	hatchShadeTexture.needsUpdate = true; 
	hatchShadeTexture1.needsUpdate = true;
	hatchShadeTexture2.needsUpdate = true;
	hatchShadeTexture3.needsUpdate = true;
	hatchShadeTexture4.needsUpdate = true;
	hatchShadeTexture5.needsUpdate = true;


	return material;
}
