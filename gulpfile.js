var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var inject = require('gulp-inject');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

gulp.task('lint', function () {
    return gulp
        .src(['public/DND/app/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('wiredep', function () {
    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/DND/bower_components',
        ignorePath: './public'
    };
    var wiredep = require('wiredep').stream;
    return gulp
        .src('./public/DND/index.html')
        .pipe(wiredep(options))
        .pipe(inject(gulp.src([
            './public/DND/app/**/*.js',
            '!./public/DND/bower_components/**/*.js',
            './public/DND/css/**/*.css'
        ]), { relative: true }))
        .pipe(gulp.dest('./public/DND/'))
});

gulp.task('serve', ['wiredep'], function () {
    var options = {
        script: './bin/www',
        delayTime: 1,
        env: {
            'PORT': 3000,
            'NODE_ENV': 'dev'
        }
    };
    return nodemon(options)
        .on('restart', function () {
            setTimeout(function () {
                browserSync.notify('reloading now...');
                browserSync.reload({ stream: false });
            }, 1000);
        })
        .on('start', function () {
            gutil.log('Started the server.');
            startBrowserSync();
        })
        .on('crash', function () { /*  */ })
        .on('exit', function () { /*  */ });
});

function startBrowserSync() {
    if (browserSync.active) {
        return;
    }

    var options = {
        proxy: 'localhost:3000',
        port: 3001,
        files: ['./public/DND/app/**/*'],
        startPath: '/DND/',
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 500
    };
    browserSync(options);
}

gulp.task('default', ['lint', 'wiredep']);
