uniform float time;

varying vec2 vUv;

#pragma glslify: noise = require("glsl-noise/simplex/3d")

void main() {
	float n = noise(vec3(gl_FragCoord.xy * 0.008, time));
	gl_FragColor.rgb = vec3(n / 0.1, n / 0.2, n / 0.5);
	gl_FragColor.a	 = 1.0;
}
