const gulp = require('gulp');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');
const fs = require('fs-extra');
const path = require('path');
const runSeq = require('run-sequence');
const {exec} = require('child_process');
const merge = require('merge-stream');
const {PolymerProject, HtmlSplitter, gulpFilter, pipeStreams, getOptimizeStreams} = require('polymer-micro-build-toolbox');
const mkdirp = require('mkdirp');

const srcDir = 'src';
const buildDir = 'build';


gulp.task('build', done => {
  runSeq('copy', ['bundle:vcms', 'composer'], done);
});

gulp.task('clean', done => {
  fs.remove(path.join(__dirname, buildDir), done);
});


gulp.task('copy', ['clean'], done => {

  let app = gulp.src(`${srcDir}/src/www/components/_app/**/*`, { dot: true })
    .pipe(gulp.dest(`${buildDir}/src/www/components/_app`));

  let webcomponentsjs = gulp.src(`${srcDir}/src/www/bower_components/webcomponentsjs/**/*`, { dot: true })
    .pipe(gulp.dest(`${buildDir}/src/www/bower_components/webcomponentsjs`));

  let sources = gulp.src([`${srcDir}/src/**/*`, `!${srcDir}/src/www/{components,bower_components}/**/*`], { dot: true })
    .pipe(gulpif(/\.php$/, replace('vcms-shell.html', 'vcms-shell.min.html')))
    .pipe(gulp.dest(`${buildDir}/src`));

  let roots = gulp.src(`${srcDir}/{composer.json,gulpfile.js,package.json}`)
    .pipe(gulp.dest(`${buildDir}`));

  return merge(app, webcomponentsjs, sources, roots);
});



gulp.task('bundle:vcms', done => {

  const project = new PolymerProject({
    root: 'src/src/www',
    shell: 'components/vcms/vcms-shell.html'
  });

  const htmlSplitter = new HtmlSplitter();
  const optimizeOptions = { css: { minify: true }, js: { minify: true }, html: { minify: true }};

  let buildStream = pipeStreams([
    merge(project.sources(), project.dependencies()),
    htmlSplitter.split(),
    getOptimizeStreams(optimizeOptions),
    htmlSplitter.rejoin(),
    project.bundler(),
    gulpFilter(f => f.path !== project.config.entrypoint)
  ]);


  buildStream.on('data', file => {
    mkdirp(`${buildDir}/src/www/components/vcms`);
    file.pipe(fs.createWriteStream(`${buildDir}/src/www/components/vcms/vcms-shell.min.html`));
  })
  .on('end', done);
});



gulp.task('composer', done => {
  exec('cd build && composer install', (err, stdout, stderr) => {
    if (err) {
      console.log('couldn\'t run composer');
    }
    done();
  });
});

