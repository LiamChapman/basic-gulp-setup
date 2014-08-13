/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-livereload gulp-cache --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

// Styles
gulp.task('styles', function() {
  return gulp.src('public/media/src/styles/main.scss')
    .pipe(sass({ style: 'expanded', require: ['susy']})) 
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/media/dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())    
    .pipe(gulp.dest('public/media/dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(['public/media/src/scripts/vendor/*.js', 'public/media/src/scripts/**/*.js'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/media/dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/media/dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('public/media/src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/media/dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['public/media/dist/styles', 'public/media/dist/scripts', 'public/media/dist/images'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('public/media/src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('public/media/src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('public/media/src/images/**/*', ['images']);

  // Create LiveReload server
  var server = livereload();

  // Watch any files in dist/, reload on change
  gulp.watch(['public/media/dist/**']).on('change', function(file) {
    server.changed(file.path);
  });

});
