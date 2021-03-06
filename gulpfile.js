var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync')
    .create();

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date())
        .getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
    ' */\n',
    ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
        .pipe(gulp.dest('./public/vendor/bootstrap'))

    // Font Awesome
    gulp.src([
        './node_modules/font-awesome/**/*',
        '!./node_modules/font-awesome/{less,less/*}',
        '!./node_modules/font-awesome/{scss,scss/*}',
        '!./node_modules/font-awesome/.*',
        '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
        .pipe(gulp.dest('./public/vendor/font-awesome'))

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./public/vendor/jquery'))

    // jQuery Easing
    gulp.src([
        './node_modules/jquery.easing/*.js'
    ])
        .pipe(gulp.dest('./public/vendor/jquery-easing'))

    // Magnific Popup
    gulp.src([
        './node_modules/magnific-popup/dist/*'
    ])
        .pipe(gulp.dest('./public/vendor/magnific-popup'))

    // Scrollreveal
    gulp.src([
        './node_modules/scrollreveal/dist/*.js'
    ])
        .pipe(gulp.dest('./public/vendor/scrollreveal'))

});

// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./public/scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        })
            .on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
    return gulp.src([
        './public/css/*.css',
        '!./public/css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
        './public/js/*.js',
        '!./public/js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

//Minify HTML
gulp.task('html:minify', function () {
    return gulp.src('./public/index.dev.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true
        }))
        .pipe(rename(('./public/index.html')))
        .pipe(gulp.dest('.'));
});

//HTML
gulp.task('html', ['html:minify']);

// Default task
gulp.task('default', ['css', 'js', 'html', 'vendor']);

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
});

// Dev task
gulp.task('dev', ['css', 'js', 'html', 'browserSync'], function () {
    gulp.watch('./public/scss/*.scss', ['css']);
    gulp.watch('./public/js/*.js', ['js']);
    gulp.watch('./public/index.dev.html', ['html']);
    gulp.watch('./public/index.dev.html', browserSync.reload);
});
