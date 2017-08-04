/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

export default class Background {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor(textureSrc) {
		this.textureSrc = textureSrc;
		this.obj = null;
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================
	init() {
		return;
	}

	loadTexture(callback) {
		let texture = new THREE.Texture(this.textureSrc);
		texture.needsUpdate = true;
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;

		this.obj = this.createMesh(texture);
		callback();
	}

	createMesh(texture) {
		return new THREE.Mesh(
			new THREE.BoxGeometry(100, 100, 100),
			new THREE.MeshPhongMaterial({
				map: texture,
			}),
		);
	}

	resize() {
		this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
	}
}
