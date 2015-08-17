const gulp = require('gulp');
const ignore = require('gulp-ignore');
const rimraf = require('gulp-rimraf');

const path = require('path');
const fs = require('fs');
// const DeepMerge = require('deep-merge');
const nodemon = require('nodemon');

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackClientConfig = require('./webpack.client.config.js');
const webpackServerConfig = require('./webpack.server.config.js');

const clientPort = 3000;
const clientPath = './client';
const clientStaticPath = clientPath + '/build';
const serverPort = 3001;

// tasks

function onBuild(done) {
  return function(err, stats) {
    if(err) {
      console.log('Error', err);
    }
    else {
      console.log(stats.toString());
    }

    if(done) {
      done();
    }
  }
}

gulp.task('client-build', function(done) {
  // webpack(frontendConfig).run(onBuild(done));
  webpack(webpackClientConfig).run(onBuild(done));
});

gulp.task('client-watch', function() {
  webpack(webpackClientConfig).watch(100, onBuild());

  new WebpackDevServer(webpack(webpackClientConfig), {
    contentBase: clientPath,
    publicPath: webpackClientConfig.output.publicPath,
    hot: true
  }).listen(clientPort, 'localhost', function (err, result) {
      if(err) {
        console.log(err);
      }
      else {
        console.log('webpack dev server listening at localhost:', clientPort);
      }
    });
});

gulp.task('server-build', function(done) {
  webpack(webpackServerConfig).run(onBuild(done));
});

gulp.task('server-watch', function(done) {
  var firedDone = false;
  webpack(webpackServerConfig).watch(100, function(err, stats) {
    if(!firedDone) {
      firedDone = true;
      done();
    }

    console.log('---->  restart node');
    nodemon.restart();
  });
});

gulp.task('build', ['client-build', 'server-build']);
gulp.task('watch', ['client-watch', 'server-watch']);

gulp.task('clean', function() {
  return gulp.src('**/build/*', { read: false }) // much faster
    // .pipe(ignore('node_modules/**'))
    .pipe(rimraf());
});

gulp.task('default', ['server-watch', 'client-watch'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'server/build/lambda-server.lambda.js'),
    //ignore: ['*'],
    //watch: ['foo/'],
    //ext: 'noop'
  }).on('restart', function() {
    console.log('Patched!');
  });
});
