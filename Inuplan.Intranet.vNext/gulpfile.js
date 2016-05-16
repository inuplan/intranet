/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps");

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.reactComponents = paths.webroot + "js/**/*.jsx";
paths.reactConcatDest = paths.webroot + "js/components.min.js";
paths.reactDest = paths.webroot + "js/";

gulp.task("transform:react-final", function () {
    return gulp.src([paths.reactComponents, "!" + paths.minJs])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat(paths.reactConcatDest))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("."));
});

gulp.task("transform:react-dev", function () {
    return gulp.src(paths.reactComponents)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.reactDest));
});

gulp.task("watch:react-dev", function () {
    gulp.watch(paths.reactComponents, ["transform:react-dev"]);
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
