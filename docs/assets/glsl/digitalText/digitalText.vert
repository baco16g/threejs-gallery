#define GLSLIFY 1
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float numChars;
uniform float numTextureGridRows;
uniform float numTextureGridCols;
uniform float textureTxtLength;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 randomValues;
attribute float charIndex;

varying vec4 vColor;
varying vec2 vUv;

const float PI = 3.1415926535897932384626433832795;

const float radius = 60.0;

vec3 rotateVec3(vec3 p, float angle, vec3 axis){
	vec3 a = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float r = 1.0 - c;
	mat3 m = mat3(
		a.x * a.x * r + c,
		a.y * a.x * r + a.z * s,
		a.z * a.x * r - a.y * s,
		a.x * a.y * r - a.z * s,
		a.y * a.y * r + c,
		a.z * a.y * r + a.x * s,
		a.x * a.z * r + a.y * s,
		a.y * a.z * r - a.x * s,
		a.z * a.z * r + c
	);
	return m * p;
}

float map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
	if(clamp == true) {
		if(value < inputMin) return outputMin;
		if(value > inputMax) return outputMax;
	}

	float p = (outputMax - outputMin) / (inputMax - inputMin);
	return ((value - inputMin) * p) + outputMin;
}

float getRad(float scale, float offset) {
	return map(mod(time * scale + offset, PI * 2.0), 0.0, PI * 2.0, -PI, PI, true);
}

void main() {
	vec3 pos = position;
	float theta;

	float animationVal = 2.0;

	// y軸を中心にリング状になるように文字を配置
	pos.z += animationVal * radius;
	theta = getRad(1.0, PI * 2.0 / numChars * charIndex);
	pos = rotateVec3(pos, animationVal * theta, vec3(0.0, 1.0, 0.0));

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

	// fragmentShaderに渡すcolorを計算
	//vColor = vec4(0.17, 0.47, 0.79, 1.0);
	vColor = vec4(0.16, 0.91, 0.95, 1.0);

	// fragmentShaderに渡すUV座標を計算
	float txtTextureIndex = mod(charIndex, textureTxtLength);
	float uUnit = 1.0 / numTextureGridCols;
	float vUnit = 1.0 / numTextureGridRows;
	vUv = vec2(
		(uv.x + mod(txtTextureIndex, numTextureGridCols)) * uUnit,
		(uv.y + floor(txtTextureIndex / numTextureGridCols)) * vUnit
	);
}
