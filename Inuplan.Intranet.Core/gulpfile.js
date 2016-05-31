/// <binding BeforeBuild='transform:react-dev' Clean='clean' ProjectOpened='watch:react-dev' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps");

var webroot = "./wwwroot/";

var config = {
    babel: {
        presets: ["react", "es2015"]
    }
};

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
    reactComponents: webroot + "js/**/*.jsx",
    reactConcatDest: webroot + "js/components.min.js",
    reactDest: webroot + "js/"
};

gulp.task("transform:react-dev", function() {
    return gulp.src("./wwwroot/js/**/*.jsx")
        .pipe(sourcemaps.init())
        .pipe(babel(config.babel))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.reactDest));
});

gulp.task("watch:react-dev", function () {
    gulp.watch(paths.reactComponents, ["transform:react-dev"]);
});

gulp.task("transform:react-final", function () {
    return gulp.src([paths.reactComponents, "!" + paths.minJs])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat(paths.reactConcatDest))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("."));
});

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
