/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.EdgeBlendShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"tNormalEdge": { type: "t", value: null },
		"tDepthEdge": { type: "t", value: null },
		"tTestEdge": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tNormalEdge;",
		"uniform sampler2D tDepthEdge;",
		"uniform sampler2D tTestEdge;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 normalEdgeTexel = texture2D( tNormalEdge, vUv );",
			"vec4 depthEdgeTexel = texture2D( tDepthEdge, vUv );",
			"float threshold = 0.3;",
			"if( normalEdgeTexel.r >= threshold || ",
				"normalEdgeTexel.g >= threshold || ",
				"normalEdgeTexel.b >= threshold || ",
				"depthEdgeTexel.r >= threshold || ",
				"depthEdgeTexel.g >= threshold || ",
				"depthEdgeTexel.b >= threshold  ",
			") {",
				" gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);",
			"} else {",
				" gl_FragColor = texture2D( tDiffuse, vUv );",
			"}",
		"}"

	].join("\n")

};
