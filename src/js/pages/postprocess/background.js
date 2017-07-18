/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

export default class Background {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor(vs, fs, textureSrc) {
		this.vs = vs;
		this.fs = fs;
		this.textureSrc = textureSrc;
		this.uniforms = null;
		this.obj = null;
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================
	init() {
		this.setUniforms();
	}

	setUniforms() {
		this.uniforms = {
			texture: {
				type: 't',
				value: null,
			},
			imageResolution: {
				type: 'v2',
				value: new THREE.Vector2(1024, 1024),
			},
			resolution: {
				type: 'v2',
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
		};
	}

	loadTexture(callback) {
		const loader = new THREE.TextureLoader();
		loader.load(this.textureSrc, texture => {
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			this.uniforms.texture.value = texture;

			this.obj = this.createMesh(this.vs, this.fs);
			callback();
		});
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

	resize() {
		this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
	}
}
