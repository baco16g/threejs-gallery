/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

import Background from './background';
import Postprocess from './postprocess';

class PostProcessApp {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		SHADER_LOADER.load((data) => {
			const vsbg = data.background.vertex;
			const fsbg = data.background.fragment;
			const vspp = data.postprocess.vertex;
			const fspp = data.postprocess.fragment;

			this.init(vsbg, fsbg, vspp, fspp);
		});
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================
	init(vsbg, fsbg, vspp, fspp) {

		//-------------------------------------------------------------------
		// ◆ untils
		//-------------------------------------------------------------------
		{
			this.stats = this.initStats();
			this.clock = new THREE.Clock();
		}

		//-------------------------------------------------------------------
		// ◆ renderer
		//-------------------------------------------------------------------
		{
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(0x000000);
			this.renderer.setPixelRatio(window.devicePixelRatio || 1);
			this.renderer.setSize(this.width, this.height);
			this.renderer.shadowMap.enabled = true;
			this.output.appendChild(this.renderer.domElement);
			this.renderbg = new THREE.WebGLRenderTarget(this.width, this.height);
		}

		//-------------------------------------------------------------------
		// ◆ scene
		//-------------------------------------------------------------------
		{
			this.scenepp = new THREE.Scene();
			this.scenebg = new THREE.Scene();
		}

		//-------------------------------------------------------------------
		// ◆ light
		//-------------------------------------------------------------------
		{
			this.light = new THREE.DirectionalLight(0xeeeeee, 1);
			this.light.position.set(30, 100, 30);
			this.scenebg.add(this.light);
		}

		//-------------------------------------------------------------------
		// ◆ camera
		//-------------------------------------------------------------------
		{
			this.camerabg = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
			this.camerapp = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

			this.camerabg.position.set(0, 0, 100);
			this.camerabg.lookAt(new THREE.Vector3());
		}

		//-------------------------------------------------------------------
		// ◆ obj
		//-------------------------------------------------------------------
		{
			this.bg = new Background(vsbg, fsbg, './assets/images/postprocess/texture.png');
			this.pp = new Postprocess(vspp, fspp, this.renderbg.texture);
			this.bg.init();
			this.pp.init();

			this.bg.loadTexture(() => {
				this.scenebg.add(this.bg.obj);
				this.scenepp.add(this.pp.obj);
			});
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
	// ◆ サブセット関数
	//===================================================================


	//===================================================================
	// ◆ メイン関数
	//===================================================================

	render() {
		const time = this.clock.getDelta();

		this.stats.update();
		this.animate();

		this.renderer.render(this.scenebg, this.camerabg, this.renderbg);
		this.pp.render(time);
		this.renderer.render(this.scenepp, this.camerapp);

		requestAnimationFrame(() => {
			this.render();
		});
	}

	onResize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.output.width = window.innerWidth;
		this.output.height = window.innerHeight;
		this.camerabg.aspect = window.innerWidth / window.innerHeight;
		this.camerabg.updateProjectionMatrix();
		this.bg.resize();
		// this.pp.resize();
		// this.renderbg.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	initStats() {
		const stats = new Stats();
		stats.setMode(0);
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.getElementById("output-stats").appendChild(stats.domElement);
		return stats;
	}

	animate() {
		return;
	}
}


(() => {
	const postProcessApp = new PostProcessApp();
})();
