var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');


/**
 * Build (Webpack)
 */

gulp.task('clean:build', function() {
    del('./public/js/*');
});

gulp.task('build', ['clean:build'], function() {
  return gulp.src('./app/app.js')
    .pipe(webpack(webpackConfig))
    .on('error', function handleError() {
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest('./'));
});

gulp.task('watch:build', function() {
  return gulp.watch('./app/**/*', ['build']);
});


/**
 * Main tasks
 */

gulp.task('watch', ['build', 'watch:build']);
gulp.task('default', ['watch']);
