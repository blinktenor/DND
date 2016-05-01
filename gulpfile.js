var gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('lint', function () {
  gulp.src(['public/DND/app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);
