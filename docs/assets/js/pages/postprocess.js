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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

var Background = function () {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	function Background(vs, fs, textureSrc) {
		_classCallCheck(this, Background);

		this.vs = vs;
		this.fs = fs;
		this.textureSrc = textureSrc;
		this.uniforms = null;
		this.obj = null;
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================


	_createClass(Background, [{
		key: 'init',
		value: function init() {
			this.setUniforms();
		}
	}, {
		key: 'setUniforms',
		value: function setUniforms() {
			this.uniforms = {
				texture: {
					type: 't',
					value: null
				},
				imageResolution: {
					type: 'v2',
					value: new THREE.Vector2(1024, 1024)
				},
				resolution: {
					type: 'v2',
					value: new THREE.Vector2(window.innerWidth, window.innerHeight)
				}
			};
		}
	}, {
		key: 'loadTexture',
		value: function loadTexture(callback) {
			var _this = this;

			var loader = new THREE.TextureLoader();
			loader.load(this.textureSrc, function (texture) {
				texture.magFilter = THREE.NearestFilter;
				texture.minFilter = THREE.NearestFilter;
				_this.uniforms.texture.value = texture;

				_this.obj = _this.createMesh(_this.vs, _this.fs);
				callback();
			});
		}
	}, {
		key: 'createMesh',
		value: function createMesh(vs, fs) {
			return new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.RawShaderMaterial({
				uniforms: this.uniforms,
				fragmentShader: fs,
				vertexShader: vs
			}));
		}
	}, {
		key: 'resize',
		value: function resize() {
			this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
		}
	}]);

	return Background;
}();

exports.default = Background;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

var PostProcess = function () {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	function PostProcess(vs, fs, texture) {
		_classCallCheck(this, PostProcess);

		this.vs = vs;
		this.fs = fs;
		this.texture = texture;
		this.uniforms = null;
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================


	_createClass(PostProcess, [{
		key: 'init',
		value: function init() {
			this.setUniforms();
			this.obj = this.createMesh(this.vs, this.fs);
		}
	}, {
		key: 'setUniforms',
		value: function setUniforms() {
			this.uniforms = {
				time: {
					type: 'f',
					value: 0
				},
				texture: {
					type: 't',
					value: this.texture
				},
				resolution: {
					type: 'v2',
					value: new THREE.Vector2(window.innerWidth, window.innerHeight)
				}
			};
		}
	}, {
		key: 'createMesh',
		value: function createMesh(vs, fs) {
			return new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.RawShaderMaterial({
				uniforms: this.uniforms,
				fragmentShader: fs,
				vertexShader: vs
			}));
		}
	}, {
		key: 'render',
		value: function render(time) {
			this.uniforms.time.value += time;
		}
	}, {
		key: 'resize',
		value: function resize() {
			this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
		}
	}]);

	return PostProcess;
}();

exports.default = PostProcess;

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global SHADER_LOADER b:true*/

var _background = __webpack_require__(0);

var _background2 = _interopRequireDefault(_background);

var _postprocess = __webpack_require__(1);

var _postprocess2 = _interopRequireDefault(_postprocess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PostProcessApp = function () {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	function PostProcessApp() {
		var _this = this;

		_classCallCheck(this, PostProcessApp);

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		SHADER_LOADER.load(function (data) {
			var vsbg = data.background.vertex;
			var fsbg = data.background.fragment;
			var vspp = data.postprocess.vertex;
			var fspp = data.postprocess.fragment;

			_this.init(vsbg, fsbg, vspp, fspp);
		});
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================


	_createClass(PostProcessApp, [{
		key: 'init',
		value: function init(vsbg, fsbg, vspp, fspp) {
			var _this2 = this;

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
				this.bg = new _background2.default(vsbg, fsbg, '/assets/images/postprocess/texture.png');
				this.pp = new _postprocess2.default(vspp, fspp, this.renderbg.texture);
				this.bg.init();
				this.pp.init();

				this.bg.loadTexture(function () {
					_this2.scenebg.add(_this2.bg.obj);
					_this2.scenepp.add(_this2.pp.obj);
				});
			}

			//-------------------------------------------------------------------
			// ◆ do render
			//-------------------------------------------------------------------
			{
				this.render();
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

			var time = this.clock.getDelta();

			this.stats.update();
			this.animate();

			this.renderer.render(this.scenebg, this.camerabg, this.renderbg);
			this.pp.render(time);
			this.renderer.render(this.scenepp, this.camerapp);

			requestAnimationFrame(function () {
				_this3.render();
			});
		}
	}, {
		key: 'onResize',
		value: function onResize() {
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
	}, {
		key: 'initStats',
		value: function initStats() {
			var stats = new Stats();
			stats.setMode(0);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';
			document.getElementById("output-stats").appendChild(stats.domElement);
			return stats;
		}
	}, {
		key: 'animate',
		value: function animate() {
			return;
		}
	}]);

	return PostProcessApp;
}();

(function () {
	var postProcessApp = new PostProcessApp();
})();

/***/ })
/******/ ]);