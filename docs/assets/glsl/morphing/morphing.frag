#define GLSLIFY 1
varying vec2 vUv;
uniform sampler2D texture;
uniform float time;

void main() {

	// vec2 offset = vec2(sin(gl_FragCoord.x * .0019), cos(gl_FragCoord.y)) * .01;
  // vec2 offset2 = vec2(sin(gl_FragCoord.x * .0019 + 2.0 * time), cos(gl_FragCoord.y)) * .01;
	float offset = sin(gl_FragCoord.x * .0019 + 2.0 * time) * 0.01;

  vec4 dest = texture2D(texture, vec2(vUv.x, vUv.y + offset));
  gl_FragColor = dest;

}
