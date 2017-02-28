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
        filename: "[name].js",
        path: "./dist",
        chunkFilename: "[id].chunk.js",
        publicPath: "/assets/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "lib",
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
            filename: "[name].js"
        })
    ],
    externals: externals
};