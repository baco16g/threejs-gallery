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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global $ b:true*/
/*global THREE b:true*/
/*global Stats b:true*/
/*global dat b:true*/
/*global WebFont b:true*/
/*global SHADER_LOADER b:true*/

var DigitalText = function () {

	//===================================================================
	// ◆ コンストラクタ
	// - canvasのセッティング
	//===================================================================
	function DigitalText() {
		var _this = this;

		_classCallCheck(this, DigitalText);

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.output = document.getElementById('output-webgl') || document.createElement('div');

		this.texture = null;
		this.numChars = 48;
		this.charWidth = 32;
		this.numTextureGridCols = 16;
		this.textureGridSize = 128;
		this.txts = '';

		for (var i = 0; i < this.numChars; i++) {
			var num = Math.floor(Math.random() * 2);
			if (num === 1) {
				this.txts += 'I';
			} else {
				this.txts += '0';
			}
		}

		// シェーダー
		SHADER_LOADER.load(function (data) {
			// shaderを使うときは, init()をラップする
			var vs = {
				dtv: data.dtShader.vertex,
				fbv: data.fbShader.vertex,
				env: data.enShader.vertex
			};
			var fs = {
				dtf: data.dtShader.fragment,
				fbf: data.fbShader.fragment,
				enf: data.enShader.fragment
			};

			_this.init(vs, fs);
		});
	}

	//===================================================================
	// ◆ 初期実行関数
	//===================================================================


	_createClass(DigitalText, [{
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

				var ambientLight = new THREE.AmbientLight(0x333333);
				this.scene.add(ambientLight);
			}

			//-------------------------------------------------------------------
			// ◆ camera
			//-------------------------------------------------------------------
			{
				var perscamera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000); // fov(視野角),aspect,near,far
				var orthocamera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 10000);
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
				var envGeometry = new THREE.SphereGeometry(600, 50, 50);
				var envMaterial = new THREE.ShaderMaterial({
					transparent: true,
					side: THREE.BackSide,
					uniforms: {
						time: { type: 'f', value: 0.0 },
						lightPosition: { type: 'v3', value: this.light.position }
					},
					vertexShader: vs.env,
					fragmentShader: fs.enf
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
				var cubeGeometry = new THREE.IcosahedronGeometry(40, 3);
				var cubeMaterial = new THREE.ShaderMaterial({
					transparent: true,
					uniforms: {
						time: { type: 'f', value: 0.0 },
						lightPosition: { type: 'v3', value: this.light.position }
					},
					vertexShader: vs.fbv,
					fragmentShader: fs.fbf
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
						textureTxtLength: { type: 'f', value: 1 }
					},
					vertexShader: vs.dtv,
					fragmentShader: fs.dtf
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
				window.addEventListener('resize', function () {
					_this2.onResize();
				}, false);
			}
		}

		//===================================================================
		// ◆ メイン関数
		//===================================================================

	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			this.stats.update();
			this.controls.update();
			this.animate();

			requestAnimationFrame(function () {
				_this3.render();
			});
			this.renderer.render(this.scene, this.camera);
		}
	}, {
		key: 'onResize',
		value: function onResize() {
			this.controls.handleResize();
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
			var time = new Date().getTime();
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

	}, {
		key: 'createCharsMaterial',
		value: function createCharsMaterial(txt, fontFamily) {
			var texture = null;
			var textureTxtLength = txt.length;
			var numTextureGridRows = Math.ceil(textureTxtLength / this.numTextureGridCols);

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = this.textureGridSize * this.numTextureGridCols;
			canvas.height = this.textureGridSize * numTextureGridRows;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = 'bold ' + this.textureGridSize * 0.8 + 'px ' + fontFamily;
			ctx.textAlign = 'center';
			ctx.fillStyle = '#ffffff';

			var colIndex = void 0;
			var rowIndex = void 0;

			for (var i = 0, l = textureTxtLength; i < l; i++) {
				colIndex = i % this.numTextureGridCols;
				rowIndex = Math.floor(i / this.numTextureGridCols);

				// canvasに文字を描画
				ctx.fillText(txt.charAt(i), colIndex * this.textureGridSize / 2 + this.textureGridSize / 2 / 2, // FIXME: geidsizeをXは半分に
				rowIndex * this.textureGridSize + this.textureGridSize * 0.8, this.textureGridSize);
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

	}, {
		key: 'createCharsGeometry',
		value: function createCharsGeometry() {
			// attributes用の配列を生成
			var vertices = [];
			var charIndices = [];
			var randomValues = [];
			var uvs = [];
			var indices = [];

			var charHeight = this.charWidth;
			var charHalfWidth = this.charWidth / 2;
			var charHalfHeight = charHeight / 2;

			// this.numCharsの数だけplaneを生成
			for (var i = 0; i < this.numChars; i++) {

				// GLSLで使用するランダムな値
				var randomValue = [Math.random(), Math.random(), Math.random()];

				// 頂点データを生成

				// 左上
				vertices.push(-charHalfWidth); // x
				vertices.push(charHalfHeight); // y
				vertices.push(0); // z

				uvs.push(0);
				uvs.push(0);

				charIndices.push(i); // 何文字目かを表すインデックス番号

				randomValues.push(randomValue[0]); // GLSLで使用するランダムな値 (vec3になるので3つ)
				randomValues.push(randomValue[1]); // GLSLで使用するランダムな値 (vec3になるので3つ)
				randomValues.push(randomValue[2]); // GLSLで使用するランダムな値 (vec3になるので3つ)


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
				var indexOffset = i * 4;
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
	}]);

	return DigitalText;
}();

(function () {
	var digitalText = new DigitalText();
})();

/***/ })

/******/ });