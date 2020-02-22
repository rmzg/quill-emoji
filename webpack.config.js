const path = require("path");
//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = {
	entry: "./src/quill-emoji.js",
	output: {
		filename: "quill-emoji.js",
		path: path.resolve(__dirname, "dist"),
		library: "QuillEmoji",
		libraryTarget: "umd"
	},
	target: "web",
	mode: "production",
	externals: {
		quill: {
			commonjs: "quill",
			commonjs2: "quill",
			amd: "quill",
			root: "Quill"
		}
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"resolve-url-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(jpg|png|gif)$/i,
				include: /src/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192
						}
					}
				]
			},
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, "src/")],
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [["@babel/preset-env", { modules: false }]],
						plugins: ["@babel/plugin-proposal-class-properties"]
					}
				}
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({ cache: true }),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "quill-emoji.css",
			chunkFilename: "[id].css"
		})
	]
};

module.exports = config;
