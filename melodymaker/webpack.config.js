var webpack = require("webpack");
var path = require("path");

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
	"context": __dirname,
	entry: {
		"Main": "app/Main",
	},
	output: {
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		sourceMapFilename : "[file].map",
	},
	resolve: {
		root: [
			__dirname,
			path.resolve(__dirname, "style")
		],
		fallback: path.resolve(__dirname, "../arpeggios/node_modules"),
		modulesDirectories : ["style", "app", "third_party/Tone.js/", "third_party", "node_modules", path.resolve(__dirname, "../arpeggios/node_modules")],
		alias: {
			"StartAudioContext": path.resolve(__dirname, "../arpeggios/node_modules/startaudiocontext/StartAudioContext.js")
		}
	},
	resolveLoader: {
		fallback: path.resolve(__dirname, "../arpeggios/node_modules")
	},
	plugins: PROD ? [
	    new webpack.optimize.UglifyJsPlugin({minimize: true})
	  ] : [],
	 module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: "style!css!autoprefixer-loader!sass"
			},
			{
				test: /\.json$/,
				loader: "json"
			},
			{
				test: /\.(png|gif)$/,
				loader: "url-loader",
			}, 
			{
				test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader : "file-loader?name=images/font/[hash].[ext]"
			}
		]
	}
};
