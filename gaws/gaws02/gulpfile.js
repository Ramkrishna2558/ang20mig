const gulp = require('gulp');

gulp.task('copy-client', function copyClient() {
  return gulp.src('client/**/*').pipe(gulp.dest('public/client'));
});

gulp.task('default', gulp.series('copy-client'));
