var webpack = require("webpack");
var path = require("path");

var config = {
	"context": __dirname + "/chords",
	entry: {
		"Main": "app/Main",
	},
	output: {
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		publicPath: "./",
		sourceMapFilename : "[file].map",
	},
	resolve: {
		root: [
			__dirname + "/chords",
			path.resolve(__dirname, "chords/style")
		],
		fallback: path.resolve(__dirname, "node_modules"),
		modulesDirectories : ["node_modules", "style", "third_party/Tone.js/", "app", "third_party"],
		alias: {
			"StartAudioContext": path.resolve(__dirname, "node_modules/startaudiocontext/StartAudioContext.js"),
			"node-sass": "sass"
		}
	},
	resolveLoader: {
		fallback: path.resolve(__dirname, "node_modules"),
		alias: {
			"node-sass": "sass"
		}
	},
	 module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: "style!css!autoprefixer!sass"
			}
		]
	}
};

webpack(config, function(err, stats) {
    if (err || stats.hasErrors()) {
        console.error("BUILD ERRORS:", stats.toString("errors-only"));
    } else {
        console.log("BUILD SUCCESSFUL!");
    }
});
