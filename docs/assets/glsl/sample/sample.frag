#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform vec3 lightPosition;

void main(void) {
	vec3 lightDirection = normalize(lightPosition - vWorldPosition);

	// simpliest hardcoded lighting ^^
	float c = 0.35 + max(0.0, dot(vNormal, lightDirection)) * 0.4;

	gl_FragColor = vec4(c, c, c, 1.0);
}
