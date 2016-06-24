"use strict";

// Plugins
var            gulp = require('gulp'),
            connect = require('connect'),
  connectLivereload = require('connect-livereload'),
     gulpLivereload = require('gulp-livereload'),
               sass = require('gulp-sass'),
             prefix = require('gulp-autoprefixer'),
             jshint = require('gulp-jshint'),
           sequence = require('gulp-sequence'),
             rimraf = require('rimraf'),
            stylish = require('jshint-stylish'),
            nodemon = require('gulp-nodemon'),
             gulpConcat = require('gulp-concat'),
             rename = require('gulp-rename'),
             uglify = require('gulp-uglify'),
             sourcemaps = require('gulp-sourcemaps');

// paths & files
var path = {
        src: 'src/',
       html: 'src/**/*.html',
         js: 'src/js/*.js',
       sass: 'src/css/sass/**/*.scss',
        css: 'src/css/',
};

// ports
var localPort =  3000,
       lrPort = 35729;

//start local server
gulp.task('start', function () {
  nodemon({
    script: 'app.js'
  , tasks: ['clean', 'sass:build', 'sass' ,'copy:build', 'js-work', 'jshint-frontend', 'jshint-backend']
  , ignore: ['public/**/*','src/js/concat.js','src/js/script.js','src/css/styles.css']
  , ext: 'js html scss css svg png jpg gif jade'
  , verbose: true
  , env: { 'NODE_ENV': 'development' }
  }).on('restart', function () {
      console.log('restarted!')
  })
})




// jshint
gulp.task( 'jshint-frontend', function() {
  gulp.src( path.js )
    .pipe( jshint({laxcomma:true}) )
    .pipe( jshint.reporter( stylish ) );
});

gulp.task( 'jshint-backend', function() {
  gulp.src( 'routes/*.js' )
    .pipe( jshint({laxcomma:true}) )
    .pipe( jshint.reporter( stylish ) );
});

// compile sass
gulp.task( 'sass', function() {
  gulp.src( path.sass )
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe( sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal'
    }))
    .pipe( prefix() )
    .pipe(sourcemaps.write())
    .pipe( gulp.dest( path.css ) );
});

gulp.task('sass:build', function() {
  gulp.src( path.sass )
  .pipe( sass({
    outputStyle:'compressed'
  }))
  .pipe( prefix() )
  .pipe( gulp.dest( path.css ) );
});


// default task
gulp.task( 'default', ['start'] );

gulp.task('copy:build', function() {
  gulp.src([
    './src/css/**/*.css',
    './src/**/*.html',
    './src/fonts/**/*.*',
    './src/doc/**/*.*',
    './src/images/**/*.*',
    './src/favicon.ico'
  ], { base: './src' })
  .pipe(gulp.dest('public'));
});

gulp.task('clean', function(cb) {
  rimraf('./dist', cb);
})

gulp.task('build', function(cb) {
  sequence('clean', 'sass:build', 'sass' ,'copy:build', 'js-work', 'start')(cb);
});

gulp.task('js-work', function(){
    return gulp.src(['./src/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(gulpConcat('concat.js'))
        .pipe(rename('script.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'));
});
