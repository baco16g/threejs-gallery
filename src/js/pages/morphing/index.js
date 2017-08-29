/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

class Morphing {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		this.loader = new THREE.TextureLoader();

		SHADER_LOADER.load((data) => { // shaderを使うときは, init()をラップする
			const vs = data.myShader.vertex; // `myShader`はdata-nameに合わせる
			const fs = data.myShader.fragment;

			this.loader.load('./assets/images/morphing/flower.png', texture => {
				this.init(vs, fs, texture);
			});
		});
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================
	init(vs, fs, texture) {

		//-------------------------------------------------------------------
		// ◆ untils
		//-------------------------------------------------------------------
		{
			this.stats = this.initStats();
		}

		//-------------------------------------------------------------------
		// ◆ renderer
		//-------------------------------------------------------------------
		{
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(0x000000); //背景色
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

			// const spotLight = new THREE.SpotLight(0xdddddd, 1);
			// spotLight.position.set(30, 100, 30);
			// spotLight.castShadow = true;
			// spotLight.shadow.mapSize.width = 2048;
			// spotLight.shadow.mapSize.height = 2048;
			// spotLight.shadow.camera.fov = THREE.Math.radToDeg(2 * spotLight.angle);
			// this.scene.add(spotLight);

			// const ambientLight = new THREE.AmbientLight(0x333333);
			// this.scene.add(ambientLight);
		}

		//-------------------------------------------------------------------
		// ◆ camera
		//-------------------------------------------------------------------
		{
			const perscamera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000); // fov(視野角),aspect,near,far
			const orthocamera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 10000);
			this.camera = perscamera;
			this.camera.position.set(0, 0, 400);
			this.camera.lookAt(this.scene.position);
		}

		//-------------------------------------------------------------------
		// ◆ orbitControls
		//-------------------------------------------------------------------
		{
			this.orbitControls = new THREE.OrbitControls(this.camera);
			this.orbitControls.autoRotate = false;
			this.orbitControls.userRotate = true;
			this.orbitControls.enableDamping = false;
			this.orbitControls.userZoom = false;
			this.orbitControls.userPan = false;
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
		// {
		// 	const envGeometry = new THREE.SphereGeometry(300, 50, 50);
		// 	const envMaterial = new THREE.MeshLambertMaterial({
		// 		side: THREE.BackSide,
		// 		wireframe: true,
		// 	});
		// 	this.env = new THREE.Mesh(envGeometry, envMaterial);
		// 	this.env.receiveShadow = true;
		// 	this.scene.add(this.env);
		// }

		//-------------------------------------------------------------------
		// ◆ object - plane
		//-------------------------------------------------------------------
		{
			const planeGeometry = new THREE.PlaneGeometry(300, 300, 20, 32);
			// const planeGeometry = new THREE.SphereGeometry(100, 100, 20);
			const planeMaterial = new THREE.ShaderMaterial({
				fragmentShader: fs,
				vertexShader: vs,
				uniforms: {
					time: {
						type: 'f',
						value: 0.0,
					},
					texture: {
						type: 't',
						value: texture,
					},
				},
				transparent: true,
				blending: THREE.NormalBlending,
				wireframe: false,
			});
			this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
			this.plane.position.set(0, 0, 0);
			this.plane.castShadow = true;
			this.scene.add(this.plane);
		}

		//-------------------------------------------------------------------
		// ◆ gui controls
		//-------------------------------------------------------------------
		// {
		// 	this.controls = new function() {
		// 		this.rotationSpeed = 0.05;
		// 	};

		// 	this.gui = new dat.GUI();
		// 	this.gui.add(this.controls, 'rotationSpeed', 0, 0.5);
		// }

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
		// this.orbitControls.update();
		this.animate();

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
		// this.plane.rotation.x += this.controls.rotationSpeed;
		// this.plane.rotation.y += this.controls.rotationSpeed;
		// this.plane.rotation.z += this.controls.rotationSpeed;

		let time = new Date().getTime();
		let c = 0.5 + 0.5 * Math.cos(time / 1000.0 * Math.PI);
		// this.plane.material.uniforms.color.value = c;
		this.plane.material.uniforms.time.value += 0.01;
	}
}


(() => {
	const morphing = new Morphing();
})();
