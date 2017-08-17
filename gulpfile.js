const gulp = require('gulp');
const fs = require('fs-extra');
const path = require('path');
const runSeq = require('run-sequence');
const {exec} = require('child_process');
const merge = require('merge-stream');

const src_dir = 'src';
const build_dir = 'build';

const filesToCopy = [
  `${src_dir}/.bowerrc`,
  `${src_dir}/bower.json`,
  `${src_dir}/composer.json`,
  `${src_dir}/gulpfile.js`,
  `${src_dir}/package.json`
];


gulp.task('build', done => {
  runSeq('clean', 'copy', 'composer', 'done', done);
});
gulp.task('done', done => {
  console.log('done building');
  done();
});

gulp.task('copy', _ => {

  /** Components */
  const components = gulp.src(
    `${src_dir}/src/www/components/{application-name,webcomponentsjs}/**/*`,
    { dot: true }
  ).pipe(gulp.dest(`${build_dir}/src/www/components`));

  /** Src */
  const src = gulp.src([
    `${src_dir}/src/**/*`,
    `!${src_dir}/src/www/components/**/*`,
  ], {
      dot: true
  }).pipe(gulp.dest(`${build_dir}/src`));

  /** Root */
  const root = gulp.src(filesToCopy, { dot: true })
                  .pipe(gulp.dest(build_dir));

  return merge(components, src, root);
});

gulp.task('composer', done => {
  exec('cd build && composer install', (err, stdout, stderr) => {
    if (err) {
      console.log('couldn\'t run composer');
    }
    done();
  });
});

gulp.task('clean', done => {
  fs.remove(path.join(__dirname, build_dir), done);
});