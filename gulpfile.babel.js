import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import fs from 'fs';
import browserSync from 'browser-sync';
import pngquant from 'imagemin-pngquant';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import webpackStream from 'webpack-stream';
import config from './config';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// ==========================================================================
// Task function
// ==========================================================================

// HtmlIndex
function pug() {
	return gulp.src(config.tasks.pug.src)
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.data(function(file){
		let dirname = './json/';
		let files = fs.readdirSync(dirname);
		let json = {};
		files.forEach((filename) => {
			json[filename.replace('.json', '')] = require(dirname + filename);
		});
		return { data: json };
	}))
	.pipe($.pug(config.tasks.pug.options))
	.pipe(gulp.dest(config.tasks.pug.dest))
	.pipe(reload({ stream: true }));
}

// Sass compile
function sass() {
	return gulp.src(config.tasks.sass.src)
	.pipe($.if(!config.envProduction, $.sourcemaps.init()))
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.sass(config.tasks.sass.options))
	.pipe($.if(!config.envProduction, $.sourcemaps.write()))
	.pipe($.pleeease({
		autoprefixer: ['last 2 versions'],
		minifier: !config.envProduction ? false : true,
		mqpacker: true,
	}))
	.pipe($.size({ title: 'sass' }))
	.pipe($.concat('common.css'))
	.pipe(gulp.dest(config.tasks.sass.dest))
	.pipe(reload({ stream: true }));
}

// Js compile
function babel() {
	return gulp.src(config.tasks.babel.src)
		.pipe($.plumber())
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest(config.tasks.babel.dest));
}

function vendor() {
	return gulp.src(config.tasks.vendor.src)
		.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
		.pipe($.concat('vendor.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(config.tasks.vendor.dest))
		.pipe(reload({ stream: true }));
}

function util() {
	return gulp.src(config.tasks.util.src)
		.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
		.pipe($.concat('util.js'))
		//.pipe($.uglify())
		.pipe(gulp.dest(config.tasks.util.dest))
		.pipe(reload({ stream: true }));
}

function lib() {
	return gulp.src(config.tasks.lib.src)
		.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
		.pipe($.concat('lib.js'))
		//.pipe($.uglify())
		.pipe(gulp.dest(config.tasks.lib.dest))
		.pipe(reload({ stream: true }));
}

// Image optimize
function images() {
	return gulp.src(config.tasks.images.src, { since: gulp.lastRun(images) })
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.imagemin({
		progressive: true,
		use: [pngquant({ quality: '60-80', speed: 1 })],
	}))
	.pipe(gulp.dest(config.tasks.images.dest))
	.pipe($.size({ title: 'images' }))
	.pipe(reload({ stream: true }));
}

// Glsl compile
function glsl() {
	return gulp.src(config.tasks.glsl.src)
		.pipe($.glslify())
		.pipe(gulp.dest(config.tasks.glsl.dest))
		.pipe(reload({ stream: true }));
}

// copy
function video() {
	return gulp.src(config.tasks.video.src)
		.pipe(gulp.dest(config.tasks.video.dest))
		.pipe(reload({ stream: true }));
}

// Build folder delete
function clean(cb) {
	return del([config.dirs.dest]).then(() => cb());
}

// Local server
function bs(cb) {
	return browserSync.init(null, {
		server: {
			baseDir: config.dirs.dest,
		},
		open: 'external',
		ghostMode: false,
		notify: false,
	}, cb);
}

// ==========================================================================
// Tasks
// ==========================================================================

// Watch
gulp.task('watch', (done) => {
	gulp.watch(config.tasks.watch.pug, gulp.series(pug));
	gulp.watch(config.tasks.watch.sass, gulp.series(sass));
	gulp.watch(config.tasks.watch.babel, gulp.series(babel));
	gulp.watch(config.tasks.watch.images, gulp.series(images));
	gulp.watch(config.tasks.watch.vendor, gulp.series(vendor));
	gulp.watch(config.tasks.watch.util, gulp.series(util));
	gulp.watch(config.tasks.watch.lib, gulp.series(lib));
	gulp.watch(config.tasks.watch.glsl, gulp.series(glsl));
	gulp.watch(config.tasks.watch.video, gulp.series(video));
	done();
});

// Default Build
gulp.task('build', gulp.series(
	clean,
	gulp.parallel(pug, sass, babel, vendor, util, lib, glsl, images, video),
	bs,
));

// Default Build
gulp.task('default', gulp.series('build', 'watch'));
