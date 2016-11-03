"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util"),
    fs = require("fs"),
    sourcemaps = require("gulp-sourcemaps"),
    buffer = require("vinyl-buffer"),
    source = require("vinyl-source-stream"),
    browserify = require("browserify");

// =======================
// ----  1. Constants ----
// =======================

var webroot = "./wwwroot/";
var noderoot = "./node_modules/";

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
    vendorsDest: webroot + "lib/",
    vendors: "vendors.js",
    vendorsMin: "vendors.min.js",
    react: noderoot + "react/dist/react.js",
    reactMin: noderoot + "react/dist/react.min.js",
    reactDom: noderoot + "react-dom/dist/react-dom.js",
    reactDomMin: noderoot + "react-dom/dist/react-dom.min.js",
    redux: noderoot + "redux/dist/redux.js",
    reduxMin: noderoot + "redux/dist/redux.min.js",
    reduxThunk: noderoot + "redux-thunk/dist/redux-thunk.js",
    reduxThunkMin: noderoot + "redux-thunk/dist/redux-thunk.min.js",
    reactRouter: noderoot + "react-router/umd/ReactRouter.js",
    reactRouterMin: noderoot + "react-router/umd/ReactRouter.min.js",
    reactRedux: noderoot + "react-redux/dist/react-redux.js",
    reactReduxMin: noderoot + "react-redux/dist/react-redux.min.js",
    underscore: noderoot + "underscore/underscore.js",
    underscoreMin: noderoot + "underscore/underscore-min.js",
    isomorphicFetch: noderoot + "isomorphic-fetch/fetch-npm-browserify.js",
    marked: noderoot + "marked/index.js",
    markedMin: noderoot + "marked/marked.min.js",
    removeMarkdown: noderoot + "remove-markdown/index.js",
    reactBootstrap: noderoot + "react-bootstrap/lib/index.js",
    reactBootstrapMin: noderoot + "react-bootstrap/dist/react-bootstrap.min.js",
    charts: noderoot + "chart.js/src/chart.js",
    chartsMin: noderoot + "chart.js/dist/Chart.min.js"
};

var vendors = [
    { file: paths.react, expose: 'react' },
    { file: paths.reactDom, expose: 'react-dom' },
    { file: paths.redux, expose: 'redux' },
    { file: paths.reactRouter, expose: 'react-router' },
    { file: paths.reactRedux, expose: 'react-redux' },
    { file: paths.underscore, expose: 'underscore' },
    { file: paths.reduxThunk, expose: 'redux-thunk' },
    { file: paths.isomorphicFetch, expose: 'isomorphic-fetch' },
    { file: paths.marked, expose: 'marked' },
    { file: paths.removeMarkdown, expose: 'remove-markdown' },
    { file: paths.reactBootstrap, expose: 'react-bootstrap' },
    { file: paths.charts, expose: 'chart-js' }
]

var vendorsMin = [
    { file: paths.reactMin, expose: 'react' },
    { file: paths.reactDomMin, expose: 'react-dom' },
    { file: paths.reduxMin, expose: 'redux' },
    { file: paths.reactRouterMin, expose: 'react-router' },
    { file: paths.reactReduxMin, expose: 'react-redux' },
    { file: paths.underscoreMin, expose: 'underscore' },
    { file: paths.reduxThunkMin, expose: 'redux-thunk' },
    { file: paths.isomorphicFetch, expose: 'isomorphic-fetch' },
    { file: paths.markedMin, expose: 'marked' },
    { file: paths.removeMarkdown, expose: 'remove-markdown' },
    { file: paths.reactBootstrapMin, expose: 'react-bootstrap' },
    { file: paths.chartsMin, expose: 'chart-js' }
]

// =============================
// ----  2. Gulp user tasks ----
// =============================

gulp.task("bundle:vendors", function () {
    const b = browserify({
        debug: true
    });

    b.require(vendors);
    b.bundle()
        .pipe(source(paths.vendors))
        .pipe(buffer())
        .pipe(gulp.dest(paths.vendorsDest));
});

gulp.task("bundle:vendors-min", function () {
    const b = browserify({
        debug: false
    });

    b.require(vendorsMin);
    b.bundle()
        .pipe(source(paths.vendorsMin))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.vendorsDest));
});

// ===============================
// ----  3. Private functions ----
// ===============================


// ============================
// ----  4. Pre-made tasks ----
// ============================

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);
