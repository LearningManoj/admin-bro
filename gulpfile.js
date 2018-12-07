const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');
const concat = require('gulp-concat');
const path = require('path');

gulp.task('sass', () => {
  return gulp.src('admin/frontend/styles/**/*.sass')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('admin/frontend/assets/styles'));
});

gulp.task('vendorJs', () => {
  return gulp.src([
    path.join('admin/frontend/scripts/vendor/', '*.js'),
    path.join(process.env.NODE_PATH, 'bulma-calendar/dist/js/bulma-calendar.min.js')
  ], { base: 'app' })
  .pipe(concat('vendor.js'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('admin/frontend/assets/scripts'));
});

gulp.task('js', () => {
  gulp.src(path.join('admin/frontend/scripts/', '*.js'), { base: 'app' })
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('admin/frontend/assets/scripts'));
});

gulp.task('nodemon', () => {
  return nodemon({
    script: 'example.js'
  });
});

gulp.task('watch', () => {
  gulp.watch('admin/frontend/styles/**/*.sass', ['sass']);
  gulp.watch('admin/frontend/scripts/**/*.js', ['js']);
});

gulp.task('default', ['nodemon', 'vendorJs', 'sass', 'js', 'watch']);
