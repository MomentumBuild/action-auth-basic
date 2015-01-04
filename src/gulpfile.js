var gulp = require('gulp');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var htmlify = require('gulp-angular-htmlify');
var templateCache = require('gulp-angular-templatecache');
var path = require('path');
var less = require('gulp-less');
var jasmine = require('gulp-jasmine');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');

var paths = {
  scripts: [
    'bower_components/angular/angular.min.js', 
    'bower_components/momentum-petition/dist/petition.js', 
    'bower_components/ng-lodash/build/ng-lodash.min.js', 
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    // 'bower_components/angular-strap/dist/angular-strap.min.js',
    // 'bower_components/angular-strap/dist/angular-strap.tpl.min.js',
    'bower_components/satellizer/satellizer.min.js',
    'bower_components/angular-loading-bar/build/loading-bar.min.js',
    'app.js',
    'templates.js',
    'app/**/*.js', 
  ],
  css: [ 
    'bower_components/ionicons/css/ionicons.min.css',
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/animate.css/animate.min.css',
    'app/**/*.less'
  ],
  pages: 'index.jade',
  templates: 'app/**/*.jade',
  root: [ '../../'],
  // testing: ['../tests/api/**/*.js'],
  fonts: ['bower_components/ionicons/fonts/*.*']
};

gulp.task('less', function () {
  gulp.src(paths.css)
    .pipe(concat('style.less'))
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest(paths.root[0]));
});

gulp.task('pages', function() {
  gulp.src(paths.pages)
    .pipe(jade())
    .pipe(htmlify())
    .pipe(gulp.dest(paths.root[0]));
});

gulp.task('templates', function() {
  gulp.src(paths.templates)
    .pipe(jade())
    .pipe(htmlify())
    .pipe(templateCache({
        // root: "/partials/",
        standalone: false,
        module: "actionExample",
      }))
    .pipe(gulp.dest(''));
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(concat('app.js'))
    // .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(paths.root[0]))
});

// gulp.task('api-testing', function () {
//     return gulp.src(paths.testing[0])
//         .pipe(jasmine());
// });

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch([ paths.css, paths.scripts, paths.templates, '*.jade' ], ['templates', 'pages', 'less', 'scripts']);
});


gulp.task('default', ['templates', 'pages', 'scripts', 'less', 'watch']);