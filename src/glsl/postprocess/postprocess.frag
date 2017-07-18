precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;
varying vec2 vTexCoord;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: random = require("glsl-random");


const float interval = 3.0;

void main(void){

	// テクスチャから座標情報を取得
	vec4 samplerColor = texture2D(texture, vUv);

	vec2 uv = vUv;

	// UV座標を再計算し、画面を歪ませる
	 float vignet = length(uv);
	 uv /= 1.0 - vignet * 0.2;

	// colorの初期化
	vec3 color = vec3(0, 0, 0);

	// RGBの値をずらす
	color.r = texture2D(texture, uv).r;
	color.g = texture2D(texture, uv - vec2(0.002, 0)).g;
	color.b = texture2D(texture, uv - vec2(0.004, 0)).b;

	// RGBノイズ
	color.r = random(uv + vec2(123.0 + time, 0.0));
	color.g = random(uv + vec2(123.0 + time, 1.0));
	color.b = random(uv + vec2(123.0 + time, 2.0));

	// ピクセルごとに描画するRGBを決める
	float floorX = mod(uv.x * resolution.x / 3.0, 1.0);
	color.r *= (floorX > 0.3333) ? floorX : 0.0;
	color.g *= (floorX < 0.3333 || floorX > 0.6666) ? floorX : 0.0;
	color.b *= (floorX < 0.6666) ? floorX : 0.0;

	// スキャンラインを描画
	float scanLineColor = sin(time * 10.0 + uv.y * 500.0) / 2.0 + 0.5;
	color *= 0.5 + clamp(scanLineColor + 0.5, 0.0, 1.0) * 0.5;

	// スキャンラインの残像を描画
	float tail = clamp((fract(uv.y + time * 10.0) - 1.0 + snoise3(vec3(time, 0, 0))) / min(snoise3(vec3(time, 0.0, 0.0)), 1.0), 0.6, 1.0);
	color *= tail;


	// 最終出力カラー
	gl_FragColor = samplerColor * vec4(color, 1.0);
}
