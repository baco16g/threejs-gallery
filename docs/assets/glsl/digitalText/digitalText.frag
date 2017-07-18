precision mediump float;
#define GLSLIFY 1

uniform sampler2D txtTexture;  // テクスチャ

varying vec4 vColor;  // 文字色
varying vec2 vUv;     // UV座標

// メインの処理
void main(){
	vec4 color = texture2D(txtTexture, vUv) * vColor;
	if(color.a == 0.0) {
		discard;
	} else {
		gl_FragColor = color;
	}
}
