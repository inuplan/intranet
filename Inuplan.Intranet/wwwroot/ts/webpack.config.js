var webpack = require("webpack");
var lib = [
    "react",
    "react-dom",
    "react-redux",
    "react-router",
    "react-bootstrap",
    "redux-thunk",
    "draft-js",
    "es6-object-assign",
    "es6-promise",
    "marked",
    "remove-markdown"
]
var externals = [
    "moment"
]

module.exports = {
    entry: {
        app: "./src/app.tsx",
        lib: lib,
    },
    output: {
        filename: "../../js/[name].js",
        path: "./dist",
        chunkFilename: "[id].chunk.js",
        publicPath: "/assets/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "lib",
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
            filename: "../../lib/[name].js"
        })
    ],
    externals: externals
};