var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var jsonServer = require("gulp-json-srv");
const { parallel } = require('gulp');


// SASS
function scss(cb) {
   return gulp.src(`src/scss/**/*.scss`)
     .pipe(sourcemaps.init())
     .pipe(sass({
       errorLogToConsole: true,
       outputStyle: 'compressed'
     }))
     .on('error',console.error.bind(console))
     .pipe(autoprefixer({
       browsers:['last 2 versions'],
       cascade:false
     }))
     .pipe(sourcemaps.write('./'))
     .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(`dist/css/`))

   cb();
}

exports.scss = scss;

// JS
function js(cb) {
   return gulp.src(`src/js/**/*.js`)
   .pipe(uglify())
   .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(`dist/js/`))
   cb();
}

exports.js = js;


//JSON SERVER
var server = jsonServer.create();

function json(cb) {
   return gulp.src(`slider.json`)
   .pipe(server.pipe())
   cb();
}

exports.json = json;


//WATCHER
function wtc() {
      gulp.watch(['src/scss/**/*.scss'], scss);
     gulp.watch(['src/js/**/*.js'], js);
}

exports.default = parallel(wtc,json);
