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

			"void main() {",
				"vUv = uv;",
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

			"uniform int zoomLevel;",
			"uniform sampler2D hatchTextures[BUCKET_SIZE]; ",
			"uniform sampler2D hatchTextures1[BUCKET_SIZE];",
			"uniform sampler2D hatchTextures2[BUCKET_SIZE];",
			"uniform sampler2D hatchTextures3[BUCKET_SIZE];",
			"uniform sampler2D hatchTextures4[BUCKET_SIZE];",
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
			    			"mult = abs(addedLights[c] - buckets[i])/(buckets[i] - buckets[i-1]);",
		    				"textureColor = (1.0-mult)*texture2D(hatchTextures[BUCKET_SIZE-i-1],vUv);",
		    				"textureColor = textureColor + mult*texture2D(hatchTextures[BUCKET_SIZE-i],vUv);",
			    			"break;",
			    		"}",

				    "}	",
			    "}",

			    "gl_FragColor = textureColor;",
			"}"
		].join('\n')
	}
}

HATCH_UTILITY.getShaderMaterial = function( shaderContents ) {
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
	var hatchShaderContents = HATCH_UTILITY.shaderContents();

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
		  vertexShader: hatchShaderContents.vertexShader, 
		  fragmentShader: "#define BUCKET_SIZE " + 
		  				  buckets.length + " \n" + 
		  				  hatchShaderContents.fragmentShader,  
		  transparent: true,
		  lights: true
	} );

	material.uniforms.hatchTextures.value = hatchTextures;
	material.uniforms.hatchTextures1.value = hatchTextures1;
	material.uniforms.hatchTextures2.value = hatchTextures2;
	material.uniforms.hatchTextures3.value = hatchTextures3;
	material.uniforms.hatchTextures4.value = hatchTextures4;

	return material;
}
