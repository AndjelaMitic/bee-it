var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var styleSRC = 'src/scss/**/*.scss';
var styleDIST = 'dist/css/';

var jsSRC = 'src/js/**/*.js';
var jsDIST = 'dist/js/';

gulp.task('style', async function(){
  gulp.src(styleSRC)
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
  .pipe(gulp.dest(styleDIST))
});

gulp.task('js', async function(){
  gulp.src(jsSRC)
  .pipe(gulp.dest(jsDIST))
});

gulp.task('watch',gulp.parallel('style','js'), async function(){
   gulp.watch(styleSRC,['style']);
   gulp.watch(jsSRC,['js'])
});

gulp.task('default',gulp.series('style','js','watch'));
