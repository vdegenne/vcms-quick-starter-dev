const gulp = require('gulp');
const {init, reload} = require('browser-sync');


gulp.task('watch', () => {
  init({
    proxy: '<proxy-address-here>',
    port: 8085
  });

  gulp.watch(['src/**/*.html', 'src/**/*.php'], reload);
});