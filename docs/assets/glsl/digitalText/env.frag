#define GLSLIFY 1
uniform float time;

varying vec2 vUv;

float random (in float x) {
	return fract(sin(x)*1e4);
}

float random (in vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
	vec2 p = floor(st+v);
	return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main() {
	vec2 st = vUv;

	vec2 grid = vec2(100.,150.);
	st *= grid;

	vec2 ipos = floor(st);  // integer
	vec2 fpos = fract(st);  // fraction

	vec2 vel = vec2(time*.3*max(grid.x,grid.y)); // time
	vel *= vec2(-1.,0.0) * random(1.0+ipos.y); // direction

	vec3 color = vec3(0.);
	color.r = pattern(st,vel,1.0);
	color.g = pattern(st,vel,1.0);
	color.b = pattern(st,vel,1.0);

	// Margins
	color *= step(0.3,fpos.y);
	color *= vec3(0.17, 0.47, 0.79);

	gl_FragColor = vec4(color,1.0);
}
