var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

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
    .pipe(gulp.dest(`dist/js/`))
   cb();
}

exports.js = js;

function wtc() {
     return gulp.watch(['src/scss/**/*.scss'], scss);
     gulp.watch(['src/js/**/*.js'], js);
}

exports.default = wtc;
