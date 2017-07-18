/*global $ b:true*/
/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global WebFont b:true*/
/*global SHADER_LOADER b:true*/

class DigitalText {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		this.texture = null;
		this.numChars = 48;
		this.charWidth = 32;
		this.numTextureGridCols = 16;
		this.textureGridSize = 128;
		this.txts = '';

		for (let i = 0; i < this.numChars; i++) {
			let num = Math.floor(Math.random() * 2);
			if (num === 1) {
				this.txts += 'I';
			} else {
				this.txts += '0';
			}
		}

		// シェーダー
		SHADER_LOADER.load((data) => { // shaderを使うときは, init()をラップする
			const vs = {
				dtv: data.dtShader.vertex,
				fbv: data.fbShader.vertex,
				env: data.enShader.vertex,
			};
			const fs = {
				dtf: data.dtShader.fragment,
				fbf: data.fbShader.fragment,
				enf: data.enShader.fragment,
			};

			this.init(vs, fs);
		});
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================
	init(vs, fs) {

		//-------------------------------------------------------------------
		// ◆ untils
		//-------------------------------------------------------------------
		{
			this.stats = this.initStats();
			this.loader = new THREE.TextureLoader();
		}

		//-------------------------------------------------------------------
		// ◆ renderer
		//-------------------------------------------------------------------
		{
			this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this.renderer.setClearColor(0xffffff); //背景色
			this.renderer.setPixelRatio(window.devicePixelRatio || 1);
			this.renderer.setSize(this.width, this.height);
			this.renderer.shadowMap.enabled = true;
			this.output.appendChild(this.renderer.domElement);
		}

		//-------------------------------------------------------------------
		// ◆ scene
		//-------------------------------------------------------------------
		{
			this.scene = new THREE.Scene();
		}

		//-------------------------------------------------------------------
		// ◆ light
		//-------------------------------------------------------------------
		{
			this.light = new THREE.DirectionalLight(0xeeeeee, 1);
			this.light.position.set(30, 100, 30);
			this.scene.add(this.light);

			const ambientLight = new THREE.AmbientLight(0x333333);
			this.scene.add(ambientLight);
		}

		//-------------------------------------------------------------------
		// ◆ camera
		//-------------------------------------------------------------------
		{
			const perscamera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000); // fov(視野角),aspect,near,far
			const orthocamera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 10000);
			this.camera = perscamera;
			this.camera.position.set(0, 200, 600);
			this.camera.lookAt(this.scene.position);
		}

		//-------------------------------------------------------------------
		// ◆ controls
		//-------------------------------------------------------------------
		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

		//-------------------------------------------------------------------
		// ◆ object - env
		//-------------------------------------------------------------------
		{
			const envGeometry = new THREE.SphereGeometry(600, 50, 50);
			const envMaterial = new THREE.ShaderMaterial({
				transparent: true,
				side: THREE.BackSide,
				uniforms: {
					time: { type: 'f', value: 0.0 },
					lightPosition: { type: 'v3', value: this.light.position },
				},
				vertexShader: vs.env,
				fragmentShader: fs.enf,
			});
			this.envMesh = new THREE.Mesh(envGeometry, envMaterial);
			this.envMesh.receiveShadow = true;
			this.envMesh.rotation.y -= 500.0;
			this.scene.add(this.envMesh);
		}

		//-------------------------------------------------------------------
		// ◆ object - cube
		//-------------------------------------------------------------------
		{
			const cubeGeometry = new THREE.IcosahedronGeometry(40, 3);
			const cubeMaterial = new THREE.ShaderMaterial({
				transparent: true,
				uniforms: {
					time: { type: 'f', value: 0.0 },
					lightPosition: { type: 'v3', value: this.light.position },
				},
				vertexShader: vs.fbv,
				fragmentShader: fs.fbf,
			});
			this.cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
			this.cubeMesh.position.set(0, 0, 0);
			this.cubeMesh.castShadow = true;
			this.scene.add(this.cubeMesh);
		}

		//-------------------------------------------------------------------
		// ◆ object - chars
		//-------------------------------------------------------------------
		{
			this.charsGeometry = new THREE.BufferGeometry();
			this.charsMaterial = new THREE.RawShaderMaterial({
				transparent: true,
				side: THREE.DoubleSide,
				uniforms: {
					txtTexture: { type: 't' },
					time: { type: 'f', value: 0.0 },
					numChars: { type: 'f', value: this.numChars },
					numTextureGridCols: { type: 'f', value: this.numTextureGridCols },
					numTextureGridRows: { type: 'f', value: 1 },
					textureTxtLength: { type: 'f', value: 1 },
				},
				vertexShader: vs.dtv,
				fragmentShader: fs.dtf,
			});

			this.createCharsMaterial(this.txts, 'arial');
			this.createCharsGeometry();
			this.charsMesh = new THREE.Mesh(this.charsGeometry, this.charsMaterial);
			this.scene.add(this.charsMesh);
		}

		//-------------------------------------------------------------------
		// ◆ do render
		//-------------------------------------------------------------------
		{
			this.render();
			window.addEventListener('resize', () => {
				this.onResize();
			}, false);
		}
	}

	//===================================================================
	// ◆ メイン関数
	//===================================================================

	render() {
		this.stats.update();
		this.controls.update();
		this.animate();

		requestAnimationFrame(() => {
			this.render();
		});
		this.renderer.render(this.scene, this.camera);
	}

	onResize() {
		this.controls.handleResize();
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	initStats() {
		const stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.getElementById("output-stats").appendChild(stats.domElement);
		return stats;
	}

	animate() {
		let time = new Date().getTime();
		this.charsMesh.material.uniforms.time.value += 0.01;
		this.cubeMesh.material.uniforms.time.value += 0.01;
		this.envMesh.material.uniforms.time.value += 0.01;
	}


	//===================================================================
	// ◆ サブセット関数
	//===================================================================

	//-------------------------------------------------------------------
	// ◆ charsMaterial
	//-------------------------------------------------------------------
	createCharsMaterial(txt, fontFamily) {
		let texture = null;
		let textureTxtLength = txt.length;
		let numTextureGridRows = Math.ceil(textureTxtLength / this.numTextureGridCols);

		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.width = this.textureGridSize * this.numTextureGridCols;
		canvas.height = this.textureGridSize * numTextureGridRows;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = 'bold ' + (this.textureGridSize * 0.8) + 'px ' + fontFamily;
		ctx.textAlign = 'center';
		ctx.fillStyle = '#ffffff';

		let colIndex;
		let rowIndex;

		for(let i = 0, l = textureTxtLength; i < l; i++) {
			colIndex = i % this.numTextureGridCols;
			rowIndex = Math.floor(i / this.numTextureGridCols);

			// canvasに文字を描画
			ctx.fillText(
				txt.charAt(i),
				colIndex * this.textureGridSize / 2 + this.textureGridSize / 2 / 2, // FIXME: geidsizeをXは半分に
				rowIndex * this.textureGridSize + this.textureGridSize * 0.8,
				this.textureGridSize
			);
		}

		texture = new THREE.Texture(canvas);
		texture.flipY = false;
		texture.needsUpdate = true;

		this.charsMaterial.uniforms.txtTexture.value = texture;
		this.charsMaterial.uniforms.numTextureGridRows.value = numTextureGridRows;
		this.charsMaterial.uniforms.textureTxtLength.value = textureTxtLength;

		// document.body.appendChild(canvas);
		// $(canvas).css('background-color', '#000');
		// $('.l-wrapper').remove();
	}

	//-------------------------------------------------------------------
	// ◆ charsGeometry
	//-------------------------------------------------------------------
	createCharsGeometry() {
		// attributes用の配列を生成
		let vertices = [];
		let charIndices = [];
		let randomValues = [];
		let uvs = [];
		let indices = [];

		let charHeight = this.charWidth;
		let charHalfWidth = this.charWidth / 2;
		let charHalfHeight = charHeight / 2;

		// this.numCharsの数だけplaneを生成
		for(let i = 0; i < this.numChars; i++) {

			// GLSLで使用するランダムな値
			let randomValue = [
				Math.random(),
				Math.random(),
				Math.random(),
			];


			// 頂点データを生成

			// 左上
			vertices.push(-charHalfWidth);  // x
			vertices.push(charHalfHeight);  // y
			vertices.push(0);               // z

			uvs.push(0);
			uvs.push(0);

			charIndices.push(i);  // 何文字目かを表すインデックス番号

			randomValues.push(randomValue[0]);  // GLSLで使用するランダムな値 (vec3になるので3つ)
			randomValues.push(randomValue[1]);  // GLSLで使用するランダムな値 (vec3になるので3つ)
			randomValues.push(randomValue[2]);  // GLSLで使用するランダムな値 (vec3になるので3つ)


			// 右上
			vertices.push(charHalfWidth);
			vertices.push(charHalfHeight);

			vertices.push(0);

			uvs.push(1);
			uvs.push(0);

			charIndices.push(i);

			randomValues.push(randomValue[0]);
			randomValues.push(randomValue[1]);
			randomValues.push(randomValue[2]);


			// 左下
			vertices.push(-charHalfWidth);
			vertices.push(-charHalfHeight);

			vertices.push(0);

			uvs.push(0);
			uvs.push(1);

			charIndices.push(i);

			randomValues.push(randomValue[0]);
			randomValues.push(randomValue[1]);
			randomValues.push(randomValue[2]);


			// 右下
			vertices.push(charHalfWidth);
			vertices.push(-charHalfHeight);

			vertices.push(0);

			uvs.push(1);
			uvs.push(1);

			charIndices.push(i);

			randomValues.push(randomValue[0]);
			randomValues.push(randomValue[1]);
			randomValues.push(randomValue[2]);


			// ポリゴンを生成するインデックスをpush (三角形ポリゴンが2枚なので6個)
			let indexOffset = i * 4;
			indices.push(indexOffset + 0);
			indices.push(indexOffset + 2);
			indices.push(indexOffset + 1);
			indices.push(indexOffset + 2);
			indices.push(indexOffset + 3);
			indices.push(indexOffset + 1);
		}

		// attributes
		this.charsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
		this.charsGeometry.addAttribute('randomValues', new THREE.BufferAttribute(new Float32Array(randomValues), 3));
		this.charsGeometry.addAttribute('charIndex', new THREE.BufferAttribute(new Uint16Array(charIndices), 1));
		this.charsGeometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

		// index
		this.charsGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

		this.charsGeometry.computeVertexNormals();
	}
}



(() => {
	const digitalText = new DigitalText();
})();
