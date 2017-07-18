/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

class RaySample {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		SHADER_LOADER.load((data) => { // shaderを使うときは, init()をラップする
			const vs = data.myShader.vertex; // `myShader`はdata-nameに合わせる
			const fs = data.myShader.fragment;

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
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(0x222222); //背景色
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
			// this.scene.add(this.light);

			const spotLight = new THREE.SpotLight(0xdddddd, 1);
			spotLight.position.set(30, 100, 30);
			spotLight.castShadow = true;
			spotLight.shadow.mapSize.width = 2048;
			spotLight.shadow.mapSize.height = 2048;
			spotLight.shadow.camera.fov = THREE.Math.radToDeg(2 * spotLight.angle);
			this.scene.add(spotLight);

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
			this.camera.position.set(200, 20, 200);
			this.camera.lookAt(this.scene.position);
		}

		//-------------------------------------------------------------------
		// ◆ orbitControls
		//-------------------------------------------------------------------
		{
			// this.orbitControls = new THREE.OrbitControls(this.camera);
			// this.orbitControls.autoRotate = false;
			// this.orbitControls.userRotate = true;
			// this.orbitControls.enableDamping = false;
			// this.orbitControls.userZoom = false;
			// this.orbitControls.userPan = false;
		}

		//-------------------------------------------------------------------
		// ◆ helper
		//-------------------------------------------------------------------
		// {
		// 	const gridHelper = new THREE.GridHelper(200, 50); // size, step
		// 	this.scene.add(gridHelper);
		// 	const axisHelper = new THREE.AxisHelper(200, 50);
		// 	this.scene.add(axisHelper);
		// 	const lightHelper = new THREE.DirectionalLightHelper(this.light, 20);
		// 	this.scene.add(lightHelper);
		// }

		//-------------------------------------------------------------------
		// ◆ object - env
		//-------------------------------------------------------------------
		{
			const envGeometry = new THREE.CubeGeometry(600, 300, 600);
			const envMaterial = new THREE.MeshLambertMaterial({
				color: 0xffffff,
				side: THREE.BackSide,
			});
			this.env = new THREE.Mesh(envGeometry, envMaterial);
			this.env.receiveShadow = true;
			this.scene.add(this.env);
		}

		//-------------------------------------------------------------------
		// ◆ object - cube
		//-------------------------------------------------------------------
		{
			// const cubeGeometry = new THREE.IcosahedronGeometry(40, 3);
			// const cubeMaterial = new THREE.ShaderMaterial({
			// 	fragmentShader: fs,
			// 	vertexShader: vs,
			// 	uniforms: {
			// 		color: {
			// 			type: 'f',
			// 			value: 0.0,
			// 		},
			// 		lightPosition: {
			// 			type: 'v3',
			// 			value: this.light.position,
			// 		},
			// 	},
			// });
			// this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
			// this.cube.position.set(-100, -70, -100);
			// this.cube.castShadow = true;
			// this.scene.add(this.cube);
		}

		//-------------------------------------------------------------------
		// ◆ gui controls
		//-------------------------------------------------------------------
		{
			this.controls = new function() {
				this.rotationSpeed = 0.05;
			};

			this.gui = new dat.GUI();
			this.gui.add(this.controls, 'rotationSpeed', 0, 0.5);
		}

		//-------------------------------------------------------------------
		// ◆ do render
		//-------------------------------------------------------------------
		{
			this.render();
			// メソッドをそのまま渡すと`not function`と怒られるので
			// 無名関数で囲って関数にする点に注意
			window.addEventListener('resize', () => {
				this.onResize();
			}, false);
		}
	}

	//===================================================================
	// ◆ サブセット関数
	//===================================================================


	//===================================================================
	// ◆ メイン関数
	//===================================================================

	render() {
		this.stats.update();
		//this.orbitControls.update();
		// this.animate();

		requestAnimationFrame(() => {
			this.render();
		});
		this.renderer.render(this.scene, this.camera);
	}

	onResize() {
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
		// 今回は不要
	}
}


(() => {
	const sample = new RaySample();
})();
