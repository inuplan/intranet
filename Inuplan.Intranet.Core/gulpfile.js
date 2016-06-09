"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    babelify = require("babelify"),
    sourcemaps = require("gulp-sourcemaps"),
    buffer = require("vinyl-buffer"),
    source = require("vinyl-source-stream");

// =======================
// ----  1. Constants ----
// =======================

var webroot = "./wwwroot/";

var config = {
    babel: {
        presets: ["react", "es2015"]
    },
    extensions: [ '.jsx', '.js', '.json' ]
};

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
    bundle: webroot + "js/bundle.js",
    app: webroot + "js/app.jsx"
};

// =============================
// ----  2. Gulp user tasks ----
// =============================

gulp.task("bundle:debug", function() {
    return browserify(paths.app, {
            debug: true,
            extensions: config.extensions
        })
        .transform(babelify, config.babel)
        .bundle()
        .pipe(source(paths.bundle))
        .pipe(gulp.dest("."));
});

gulp.task("bundle:release", function() {
    return browserify(paths.app, {
            debug: false,
            extensions: config.extensions
        })
        .transform(babelify, config.babel)
        .bundle()
        .pipe(source(paths.bundle))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest("."));
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
