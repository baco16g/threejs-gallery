#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform float time;

void main() {
	vUv = uv;

	// adding some displacement based on the vertex position
	vec3 offset = vec3(
		sin(position.x * 10.0 + time) * 15.0,
		sin(position.y * 10.0 + time + 31.512) * 15.0,
		sin(position.z * 10.0 + time + 112.512) * 15.0
	);

	vec3 pos = position + offset;

	vNormal = normalMatrix * vec3(normal + normalize(offset) * 0.2);

	vec4 worldPosition = modelViewMatrix * vec4( pos, 1.0 );
	vWorldPosition = worldPosition.xyz;

	gl_Position = projectionMatrix * worldPosition;
}
