const _ = require('lodash');
const gulp = require('gulp');
const gulpNodemon = require('gulp-nodemon');
const gulpEslint = require('gulp-eslint');
const defaultAssets = require('./config/assets/default');

const allJS = _.union(
  defaultAssets.server.gulpConfig,
  defaultAssets.server.allJS,
  defaultAssets.server.controllers,
  defaultAssets.server.models,
  defaultAssets.server.routes,
  defaultAssets.server.policies,
  defaultAssets.server.validations,
  defaultAssets.server.helpers
);

const eslint = () => gulp.src(allJS)
  .pipe(gulpEslint())
  .pipe(gulpEslint.format());

const eslintFix = () => gulp.src(allJS, { base: './' })
  .pipe(gulpEslint({ fix: true }))
  .pipe(gulpEslint.format())
  .pipe(gulp.dest('./'));

const watchEslint = () => gulp.watch(allJS, gulp.series('eslint'));

const nodemon = () => {
  const script = 'index.js';

  const exec = 'node --inspect=127.0.0.1:9229';

  const env = {
    NODE_ENV: process.env.NODE_ENV,
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

// app runner
gulp.task('default', gulp.parallel('eslint_watch', nodemon));
