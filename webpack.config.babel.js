import config from './config';
import path from 'path';
import webpack from 'webpack';

export default {
	devtool: '',
	entry: {
		"pages/digitalText": `${config.dirs.src}/js/pages/digitalText/index.js`,
		"pages/fireball": `${config.dirs.src}/js/pages/fireball/index.js`,
		"pages/morphing": `${config.dirs.src}/js/pages/morphing/index.js`,
		"pages/postprocess": `${config.dirs.src}/js/pages/postprocess/index.js`,
		"pages/matchmoving": `${config.dirs.src}/js/pages/matchmoving/index.js`,
	},
	output: {
		path: path.join(__dirname, config.tasks.babel.dest),
		filename: '[name].js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: require.resolve("jquery"),
				exclude: /node_modules/,
				loader: "expose-loader?$!expose-loader?jQuery",
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
	],
};
