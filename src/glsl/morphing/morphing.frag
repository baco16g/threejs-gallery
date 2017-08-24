varying vec2 vUv;
uniform sampler2D texture;
uniform float time;

void main() {

	// vec2 offset = vec2(sin(gl_FragCoord.x * .0019 * time), cos(gl_FragCoord.y)) * .01;
  // vec2 offset2 = vec2(sin(gl_FragCoord.x * .0019 + 2.0 * time), cos(gl_FragCoord.y)) * .01;
	float offsetX = sin(gl_FragCoord.x * .1 + 10.0 * time) * 0.01;
	float offsetY = sin(gl_FragCoord.y * .1 + 10.0 * time) * 0.01;
	// float offset = sin(gl_FragCoord.x * 0.01 + 1.0 * time) * 0.01;

  // vec4 dest = texture2D(texture, vec2(vUv.x + offsetX, vUv.y + offsetY));
  vec4 dest = texture2D(texture, vec2(vUv.x + offsetX, vUv.y + offsetY));
  gl_FragColor = dest;

}
