/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

export default class PostProcess {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor(vs, fs, texture) {
		this.vs = vs;
		this.fs = fs;
		this.texture = texture;
		this.uniforms = null;
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================
	init() {
		this.setUniforms();
		this.obj = this.createMesh(this.vs, this.fs);
	}

	setUniforms() {
		this.uniforms = {
			time: {
				type: 'f',
				value: 0,
			},
			texture: {
				type: 't',
				value: this.texture,
			},
			resolution: {
				type: 'v2',
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
		};
	}

	createMesh(vs, fs) {
		return new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2, 2),
			new THREE.RawShaderMaterial({
				uniforms: this.uniforms,
				fragmentShader: fs,
				vertexShader: vs,
			}),
		);
	}

	render(time) {
		this.uniforms.time.value += time;
	}

	resize() {
		this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
	}
}
