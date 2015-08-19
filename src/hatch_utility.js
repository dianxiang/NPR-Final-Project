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

			"uniform float zoomLevel;",
			"uniform sampler2D shade1;",
			"uniform sampler2D shade2;",
			"uniform sampler2D shade3;",
			"uniform sampler2D shade4;",
			"uniform sampler2D shade5;",
			"uniform sampler2D shade6;",
			"uniform sampler2D edges;",
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
			    "for(int c = 0; c < 3; c++ ) {",
			    	"for( int i = 1; i < BUCKET_SIZE ; i++ ) {",
			    		"if( addedLights[c] < buckets[i] ) {",
			    			"mult = 1.0 - abs(addedLights[c] - buckets[i])/(buckets[i] - buckets[i-1]);",
			    			"if (i == 1){",
			    				"textureColor = (1.0-mult)*texture2D(shade6,vUv);",
		    					"textureColor = textureColor + mult*texture2D(shade5,vUv);",	
			    			"}",
			    			"else if (i == 2){",
			    				"textureColor = (1.0-mult)*texture2D(shade5,vUv);",
		    					"textureColor = textureColor + mult*texture2D(shade4,vUv);",				    				
			    			"}",
			    			"else if (i == 3){",
			    				"textureColor = (1.0-mult)*texture2D(shade4,vUv);",
		    					"textureColor = textureColor + mult*texture2D(shade3,vUv);",	
			    			"}",
			    			"else if (i == 4){",
			    				"textureColor = (1.0-mult)*texture2D(shade3,vUv);",
		    					"textureColor = textureColor + mult*texture2D(shade2,vUv);",				    				
			    			"}",
			    			"else if (i == 5){",
			    				"textureColor = (1.0-mult)*texture2D(shade2,vUv);",
		    					"textureColor = textureColor + mult*texture2D(shade1,vUv);",				    				
			    			"}",
			    			"else{",
			    				"textureColor = (1.0-mult)*texture2D(shade1,vUv);",
		    					"textureColor = textureColor + mult*texture2D(shade1,vUv);",				    				
			    			"}",			    				    				
		    				"addedLights[c] = buckets[i-1];",	    				
			    			"break;",
			    		"}",

				    "}	",
			    "}",

			    "gl_FragColor = textureColor;",
			"}"
		].join('\n')
	}
}

HATCH_UTILITY.getShaderMaterial = function(zoomLevel) {


	var shade1 = THREE.ImageUtils.loadTexture("hs_14.jpg");
/*	shade1.generateMipmaps = false;
	shade1.minFilter = THREE.LinearFilter;
	shade1.magFilter = THREE.LinearFilter;
*/	var shade2 = THREE.ImageUtils.loadTexture("hs_24.jpg");
	var shade3 = THREE.ImageUtils.loadTexture("hs_34.jpg");
	var shade4 = THREE.ImageUtils.loadTexture("hs_44.jpg");
	var shade5 = THREE.ImageUtils.loadTexture("hs_54.jpg");
	var shade6 = THREE.ImageUtils.loadTexture("hs_64.jpg");
/*
	var shade1 = THREE.ImageUtils.loadTexture("hatch_1.jpg");
	var shade2 = THREE.ImageUtils.loadTexture("hatch_2.jpg");
	var shade3 = THREE.ImageUtils.loadTexture("hatch_3.jpg");
	var shade4 = THREE.ImageUtils.loadTexture("hatch_4.jpg");
	var shade5 = THREE.ImageUtils.loadTexture("hatch_5.jpg");
	var shade6 = THREE.ImageUtils.loadTexture("hatch_6.jpg");	
*/
	function mipmap(name,size){
		var c = document.createElement("canvas");
		var context = c.getContext("2d");
		var img = new Image();
		img.src = name;
		img.alt = 'alt';
		document.body.appendChild(img);
		var pat=context.createPattern(img,"repeat");
		context.rect(0,0,size,size);
		context.fillStyle = pat;
		context.fill();		
		return c;
	}


	shade1.mipmaps[ 0 ] = mipmap('hs_11.jpg',32);
//	shade1.mipmaps[ 1 ] = mipmap( 'hs_12.jpg' );
//	shade1.mipmaps[ 2 ] = mipmap( 'hs_13.jpg' );
//	shade1.mipmaps[ 3 ] = mipmap( 'hs_14.jpg' );

	
	shade2.mipmaps[ 0 ] = mipmap( 'hs_21.jpg' ,32);
//	shade2.mipmaps[ 1 ] = mipmap( 'hs_22.jpg' );
//	shade2.mipmaps[ 2 ] = mipmap( 'hs_23.jpg' );
//	shade2.mipmaps[ 3 ] = mipmap( 'hs_24.jpg' );

	
	shade3.mipmaps[ 0 ] = mipmap( 'hs_31.jpg',32 );
//	shade3.mipmaps[ 1 ] = mipmap( 'hs_32.jpg' );
//	shade3.mipmaps[ 2 ] = mipmap( 'hs_33.jpg' );
//	shade3.mipmaps[ 3 ] = mipmap( 'hs_34.jpg' );

	
	shade4.mipmaps[ 0 ] = mipmap( 'hs_41.jpg',32 );
//	shade4.mipmaps[ 1 ] = mipmap( 'hs_42.jpg' );
//	shade4.mipmaps[ 2 ] = mipmap( 'hs_43.jpg' );
//	shade4.mipmaps[ 3 ] = mipmap( 'hs_44.jpg' );

	
	shade5.mipmaps[ 0 ] = mipmap( 'hs_51.jpg' ,32);
//	shade5.mipmaps[ 1 ] = mipmap( 'hs_52.jpg' );
//	shade5.mipmaps[ 2 ] = mipmap( 'hs_53.jpg' );
//	shade5.mipmaps[ 3 ] = mipmap( 'hs_54.jpg' );

	
	shade6.mipmaps[ 0 ] = mipmap( 'hs_61.jpg',32 );
//	shade6.mipmaps[ 1 ] = mipmap( 'hs_62.jpg' );
//	shade6.mipmaps[ 2 ] = mipmap( 'hs_63.jpg' );
//	shade6.mipmaps[ 3 ] = mipmap( 'hs_64.jpg' );



/*	for( var i = 0; i < hatchTextures1.length; i++ ) {
		var tex = hatchTextures1[i];
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
	}*/
	///float zoomLevel = shaderContents;
	var buckets = [0.0, 0.2, 0.4, 0.6, 0.8, 1.1];
	//var buckets = [0.0,0.3,0.6,0.9,1.2];
	var hatchShaderContents = HATCH_UTILITY.shaderContents();

	var material = new THREE.ShaderMaterial( { 
		  uniforms: THREE.UniformsUtils.merge([
		  	  THREE.UniformsLib['lights'],
			  { 
			  	shade1: { type: "t", value: null },
			  	shade2: { type: "t", value: null },
			  	shade3: { type: "t", value: null },
			  	shade4: { type: "t", value: null },
			  	shade5: { type: "t", value: null },
			  	shade6: { type: "t", value: null },
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

	material.uniforms.zoomLevel.value = zoomLevel;
	material.uniforms.repeat.value.set( 4, 4 );
	
	material.uniforms.shade1.value = shade1;
	material.uniforms.shade2.value = shade2;
	material.uniforms.shade3.value = shade3;
	material.uniforms.shade4.value = shade4;
	material.uniforms.shade5.value = shade5;
	material.uniforms.shade6.value = shade6;


	material.uniforms.shade1.value.wrapS = 
		material.uniforms.shade1.value.wrapT = THREE.RepeatWrapping;

	material.uniforms.shade2.value.wrapS = 
		material.uniforms.shade2.value.wrapT = THREE.RepeatWrapping;

	material.uniforms.shade3.value.wrapS = 
		material.uniforms.shade3.value.wrapT = THREE.RepeatWrapping;

	material.uniforms.shade4.value.wrapS = 
		material.uniforms.shade4.value.wrapT = THREE.RepeatWrapping;

	material.uniforms.shade5.value.wrapS = 
		material.uniforms.shade5.value.wrapT = THREE.RepeatWrapping;

	material.uniforms.shade6.value.wrapS = 
		material.uniforms.shade6.value.wrapT = THREE.RepeatWrapping;

	return material;
}
