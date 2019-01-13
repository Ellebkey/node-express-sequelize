const gulp = require('gulp');
const gulpNodemon = require('gulp-nodemon');
const gulpEslint = require('gulp-eslint');
const gulpMocha = require('gulp-mocha');

const eslintSources = [
  'server/**/*.js',
  'index.js',
  'config/**/*.js',
  'tests/*.js'
];

const eslint = () => gulp.src(eslintSources)
  .pipe(gulpEslint())
  .pipe(gulpEslint.format());

const eslintFix = () => gulp.src(eslintSources, { base: './' })
  .pipe(gulpEslint({ fix: true }))
  .pipe(gulpEslint.format())
  .pipe(gulp.dest('./'));

const watchEslint = () => gulp.watch(eslintSources, gulp.series('eslint'));

const mochaTest = () => gulp.src('tests/*.js', { read: false })
  .pipe(gulpMocha({ reporter: 'spec' }));

const nodemon = () => {
  const script = 'index.js';

  const exec = 'node --inspect=127.0.0.1:9229';

  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '4040',
    TZ: 'utc'
  };

  const result = gulpNodemon({
    script,
    stdout: true,
    exec,
    env
  });

  return result;
};

// code quality
gulp.task('eslint', eslint);
gulp.task('eslint_fix', eslintFix);
gulp.task('eslint_watch', gulp.series(watchEslint));

// testing
gulp.task('test', mochaTest);

// app runner
gulp.task('default', gulp.parallel('eslint_watch', nodemon));
