/*global $ b:true*/
/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global WebFont b:true*/
/*global SHADER_LOADER b:true*/

class SongBird {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		// シェーダー
		SHADER_LOADER.load((data) => { // shaderを使うときは, init()をラップする
			const vs = {
				fbv: data.fbShader.vertex,
				// env: data.enShader.vertex,
			};
			const fs = {
				fbf: data.fbShader.fragment,
				// enf: data.enShader.fragment,
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
		// {
		// 	const envGeometry = new THREE.SphereGeometry(600, 50, 50);
		// 	const envMaterial = new THREE.ShaderMaterial({
		// 		transparent: true,
		// 		side: THREE.BackSide,
		// 		uniforms: {
		// 			time: { type: 'f', value: 0.0 },
		// 			lightPosition: { type: 'v3', value: this.light.position },
		// 		},
		// 		vertexShader: vs.env,
		// 		fragmentShader: fs.enf,
		// 	});
		// 	this.envMesh = new THREE.Mesh(envGeometry, envMaterial);
		// 	this.envMesh.receiveShadow = true;
		// 	this.envMesh.rotation.y -= 500.0;
		// 	this.scene.add(this.envMesh);
		// }

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
	}

}



(() => {
	const digitalText = new SongBird();
})();
