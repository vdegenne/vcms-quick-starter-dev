const gulp = require('gulp');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');
const runSeq = require('run-sequence');
const {init, reload} = require('browser-sync');
const { PolymerProject, HtmlSplitter, gulpFilter, pipeStreams, getOptimizeStreams } = require('polymer-micro-build-toolbox');
const mkdirp = require('mkdirp');
const merge = require('merge-stream');
const fs = require('fs-extra');
const path = require('path');


gulp.task('watch', () => {
  init({
    proxy: '<proxy-address-here>',
    port: 8085
  });

  gulp.watch(['src/**/*.html', 'src/**/*.php'], reload);
});


gulp.task('build', done => {
  runSeq('bundle:app', done);
});


gulp.task('clean:app', done => {
  fs.remove(path.join(__dirname, 'build'), done);
})

gulp.task('copy:app', ['clean:app'], done => {

  return gulp.src('src/**/*', { dot: true })
    .pipe(gulpif(/\.php$/, replace('app-shell.html', 'app-shell.bundle.html')))
    .pipe(gulp.dest('build'));

});

gulp.task('bundle:app', ['copy:app'], done => {

  let project = new PolymerProject({
    root: 'src/www',
    shell: 'components/_app/app-shell.html'
  });

  const htmlSplitter = new HtmlSplitter();
  const optimizeOptions = { css: { minify: true }, js: { minify: true }, html: { minify: true }};

  const buildStream = pipeStreams([
    merge(project.sources(), project.dependencies()),
    htmlSplitter.split(),
    getOptimizeStreams(optimizeOptions),
    htmlSplitter.rejoin(),
    project.bundler(),
    gulpFilter(f => f.path !== project.config.entrypoint)
  ]);

  mkdirp('build/www/components/_app', err => {
    if (err) {
      console.error(err);
    }
    else {
      buildStream.on('data', file => {
        file.pipe(fs.createWriteStream('build/www/components/_app/app-shell.bundle.html'));
      })
      .on('end', done);
    }
  })

});