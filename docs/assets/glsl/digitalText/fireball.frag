#define GLSLIFY 1
uniform float time;

varying vec2 vUv;
varying float noise;

//#pragma glslify: noise = require("glsl-noise/simplex/3d")

void main() {
	// compose the colour using the UV coordinate
	// and modulate it with the noise like ambient occlusion
	float n = 1.0 - 1.5 * noise ;
	vec3 color = vec3(n);
	gl_FragColor = vec4( color.rgb, 1.0 );
}
