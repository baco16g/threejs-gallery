/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

var FireBall = function () {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	function FireBall() {
		var _this = this;

		_classCallCheck(this, FireBall);

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		SHADER_LOADER.load(function (data) {
			// shaderを使うときは, init()をラップする
			var vs = data.myShader.vertex; // `myShader`はdata-nameに合わせる
			var fs = data.myShader.fragment;

			_this.init(vs, fs);
		});
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================


	_createClass(FireBall, [{
		key: 'init',
		value: function init(vs, fs) {
			var _this2 = this;

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
				var perscamera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000); // fov(視野角),aspect,near,far
				var orthocamera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 10000);
				this.camera = perscamera;
				this.camera.position.set(200, 20, 200);
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
			{
				var envGeometry = new THREE.SphereGeometry(300, 50, 50);
				var envMaterial = new THREE.MeshLambertMaterial({
					side: THREE.BackSide,
					wireframe: true
				});
				this.env = new THREE.Mesh(envGeometry, envMaterial);
				this.env.receiveShadow = true;
				this.scene.add(this.env);
			}

			//-------------------------------------------------------------------
			// ◆ object - cube
			//-------------------------------------------------------------------
			{
				var cubeGeometry = new THREE.IcosahedronGeometry(40, 3);
				var cubeMaterial = new THREE.ShaderMaterial({
					fragmentShader: fs,
					vertexShader: vs,
					uniforms: {
						color: {
							type: 'f',
							value: 0.0
						},
						time: {
							type: 'f',
							value: 0.0
						},
						lightPosition: {
							type: 'v3',
							value: this.light.position
						}
					}
				});
				this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
				this.cube.position.set(0, 0, 0);
				this.cube.castShadow = true;
				this.scene.add(this.cube);
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
				window.addEventListener('resize', function () {
					_this2.onResize();
				}, false);
			}
		}

		//===================================================================
		// ◆ サブセット関数
		//===================================================================


		//===================================================================
		// ◆ メイン関数
		//===================================================================

	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			this.stats.update();
			this.orbitControls.update();
			this.animate();

			requestAnimationFrame(function () {
				_this3.render();
			});
			this.renderer.render(this.scene, this.camera);
		}
	}, {
		key: 'onResize',
		value: function onResize() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}, {
		key: 'initStats',
		value: function initStats() {
			var stats = new Stats();
			stats.setMode(0); // 0: fps, 1: ms
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';
			document.getElementById("output-stats").appendChild(stats.domElement);
			return stats;
		}
	}, {
		key: 'animate',
		value: function animate() {
			// this.cube.rotation.x += this.controls.rotationSpeed;
			// this.cube.rotation.y += this.controls.rotationSpeed;
			// this.cube.rotation.z += this.controls.rotationSpeed;

			var time = new Date().getTime();
			var c = 0.5 + 0.5 * Math.cos(time / 1000.0 * Math.PI);
			this.cube.material.uniforms.color.value = c;
			this.cube.material.uniforms.time.value += 0.01;
		}
	}]);

	return FireBall;
}();

(function () {
	var fireball = new FireBall();
})();

/***/ })

/******/ });