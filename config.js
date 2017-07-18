import minimist from 'minimist';

const envSettings = {
	string: 'env',
	default: {
		env: process.env.NODE_ENV || 'development',
	},
};

const options = minimist(process.argv.slice(2), envSettings);
const production = options.env === 'production';

const config = {
	dirs: {
		src: './src',
		dest: './docs',
	},
	absDirs: {
		src: '/src',
		dest: '/docs',
	},
	envProduction: production,
};

const tasks = {
	pug: {
		src: [`${config.dirs.src}/pug/!(_)*.pug`],
		dest: `${config.dirs.dest}`,
		options: {
			pretty: true,
			basedir: __dirname + `${config.absDirs.src}`,
		},
	},
	sass: {
		src: `${config.dirs.src}/sass/!(_)*.{scss,sass}`,
		dest: `${config.dirs.dest}/assets/css`,
		options: {
			outputStyle: 'expanded',
		},
	},
	babel: {
		src: `${config.dirs.src}/js/pages/*.js`,
		dest: `${config.dirs.dest}/assets/js`,
	},
	vendor: {
		src: `${config.dirs.src}/js/vendor/*.js`,
		dest: `${config.dirs.dest}/assets/js`,
	},
	util: {
		src: `${config.dirs.src}/js/util/*.js`,
		dest: `${config.dirs.dest}/assets/js`,
	},
	lib: {
		src: `${config.dirs.src}/js/lib/*.js`,
		dest: `${config.dirs.dest}/assets/js`,
	},
	"glsl": {
		src: `${config.dirs.src}/glsl/**/*.{vert,frag}`,
		dest: `${config.dirs.dest}/assets/glsl/`,
	},
	images: {
		src: `${config.dirs.src}/images/**/*.{png,jpg,gif,svg,ico}`,
		dest: `${config.dirs.dest}/assets/images`,
	},
	watch: {
		pug: [`${config.dirs.src}/pug/**/*.pug`],
		sass: [`${config.dirs.src}/sass/**/*.scss`],
		babel: [`${config.dirs.src}/js/pages/**/*.js`, `!${config.dirs.src}/js/vendor/**/*.js`],
		vendor: [`${config.dirs.src}/js/vendor/*.js`],
		util: [`${config.dirs.src}/js/util/*.js`],
		lib: [`${config.dirs.src}/js/lib/*.js`],
		images: [`${config.dirs.src}/images/**/*`],
		glsl: [`${config.dirs.src}/glsl/**/*`],
	},
	clean: [
		config.dirs.dest,
	],
};

config.tasks = tasks;
module.exports = config;
