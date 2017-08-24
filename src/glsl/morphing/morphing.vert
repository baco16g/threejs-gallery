varying vec2 vUv;
uniform float time;

#pragma glslify: pnoise = require("glsl-noise/periodic/3d");

void main() {
	vUv = uv;

	float b = 10.0 * pnoise(cos(time * 0.1) * 0.02 * position + vec3(time * 0.1), vec3(100.0));

  float tx = position.x;
  float ty = position.y + b;
  float tz = position.z + b;
  vec3 p = vec3(tx, ty, tz);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
