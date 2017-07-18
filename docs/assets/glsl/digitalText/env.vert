#define GLSLIFY 1
uniform float time;

varying vec2 vUv;

// ----------------------------------------------------------------------------
// サブ関数の実行
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// メイン関数の実行
// ----------------------------------------------------------------------------

void main() {
	vUv = uv;

	vec3 newPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}