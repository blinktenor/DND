var gulp = require('gulp');
var eslint = require('gulp-eslint');
var inject = require('gulp-inject');

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

gulp.task('default', ['lint', 'wiredep']);
