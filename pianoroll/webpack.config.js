var webpack = require("webpack");
var path = require("path");

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
	"context": __dirname,
	entry: {
		"PianoRoll": "app/Main",
	},
	output: {
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		publicPath: "./build/",
		sourceMapFilename : "[file].map",
	},
	resolve: {
		root: [
			__dirname,
			path.resolve(__dirname, "style"),
			path.resolve(__dirname, "midi")
		],
		fallback: path.resolve(__dirname, "../node_modules"),
		modulesDirectories : ["node_modules", path.resolve(__dirname, "../node_modules"), "style", "app", "third_party", "third_party/Tone.js/"],
		alias: {
			"StartAudioContext": path.resolve(__dirname, "../arpeggios/node_modules/startaudiocontext/StartAudioContext.js")
		}
	},
	resolveLoader: {
		fallback: path.resolve(__dirname, "../node_modules")
	},
	plugins: PROD ? [
	    new webpack.optimize.UglifyJsPlugin({minimize: true})
	  ] : [],
	 module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: "style!css!autoprefixer!sass"
			},
			{
				test: /\.(png|gif)$/,
				loader: "url-loader",
			},
			{
				test: /\.json$/,
				loader: "json",
			},
			{
				test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader : "file-loader?name=images/font/[hash].[ext]"
			}
		]
	}
};
