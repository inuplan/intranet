var webpack = require("webpack");
var lib = [
    "react",
    "react-dom",
    "draft-js",
        "es6-object-assign",
    "es6-promise",
    "marked",
    "react-bootstrap",
    "react-redux",
    "react-router",
    "redux-thunk",
    "remove-markdown"
]
var externals = [
    "moment"
]

module.exports = {
    entry: {
        app: "./wwwroot/ts/src/app.tsx",
        lib: lib
    },
    output: {
        filename: "[name].min.js",
        path: "./wwwroot/ts/dist",
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
    devtool: false,
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "lib",
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
            filename: "[name].min.js"
        })
    ],
    externals: externals
};