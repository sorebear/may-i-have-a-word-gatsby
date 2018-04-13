const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const autoPrefixer = require('gulp-autoprefixer');

gulp.task('default', () => {
  return gulp
  .src('src/scss/main.scss')
  .pipe(
    sass({
      outputStyle: 'compressed'
    })
  )
  .pipe(autoPrefixer())
  .pipe(gulp.dest('src/layouts'));
});
