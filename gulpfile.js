// Load Gulp and all of our Gulp plugins
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

// Load other npm modules
const del = require('del');
const glob = require('glob');
const path = require('path');
const isparta = require('isparta');
const babelify = require('babelify');
const watchify = require('watchify');
const buffer = require('vinyl-buffer');
const esperanto = require('esperanto');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');

// Gather the library data from `package.json`
const manifest = require('./package.json');
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));

// Webpack
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackClientConfig = require('./webpack.client.config.js');
const webpackServerConfig = require('./webpack.server.config.js');

// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean-tmp', function(cb) {
  del(['tmp'], cb);
});

// Send a notification when JSCS fails,
// so that you know your changes didn't build
function jscsNotify(file) {
  if (!file.jscs) { return; }
  return file.jscs.success ? false : 'JSCS failed';
}

function createLintTask(taskName, files) {
  gulp.task(taskName, function() {
    return gulp.src(files)
      .pipe($.plumber())
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failOnError())
      .pipe($.jscs())
      .pipe($.notify(jscsNotify));
  });
}

// Lint our source code
createLintTask('lint-src', ['src/**/*.js']);

// Lint our test code
createLintTask('lint-test', ['test/**/*.js']);

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function(done) {
  esperanto.bundle({
    base: 'src',
    entry: config.entryFileName,
  }).then(function(bundle) {
    var res = bundle.toUmd({
      // Don't worry about the fact that the source map is inlined at this step.
      // `gulp-sourcemaps`, which comes next, will externalize them.
      sourceMap: 'inline',
      name: config.mainVarName
    });

    $.file(exportFileName + '.js', res.code, { src: true })
      .pipe($.plumber())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.babel())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .pipe($.filter(['*', '!**/*.js.map']))
      .pipe($.rename(exportFileName + '.min.js'))
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .on('end', done);
  })
  .catch(done);
});

function test() {
  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
    .pipe($.mocha({reporter: 'dot', globals: config.mochaGlobals}));
}

gulp.task('coverage', ['lint-src', 'lint-test'], function(done) {
  require('babel-core/register');
  gulp.src(['src/**/*.js'])
    .pipe($.istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      return test()
        .pipe($.istanbul.writeReports())
        .on('end', done);
    });
});

// Lint and run our tests
gulp.task('test', ['lint-src', 'lint-test'], function() {
  require('babel-core/register');
  return test();
});

// Ensure that linting occurs before browserify runs. This prevents
// the build from breaking due to poorly formatted code.
gulp.task('build-in-sequence', function(callback) {
  runSequence(['lint-src', 'lint-test'], 'browserify', callback);
});

function launchWebpack(onComplete) {

}

function launchWebpackDevServer(onComplete) {

  var server = new WebpackDevServer(webpack(webpackFrontEndConfig), {
    contentBase: 'www',
    quiet: false,
    colors: true,
    noInfo: true,
    publicPath: "/assets/",
    stats: { colors: true }
  });

  // Let requests to /assets/* through
  server.use('/assets/', function(req, res, next) {
    next();
  });

  // Let the request for the test runner through
  server.use('/test.html', function(req, res, next) {
    next();
  });

  // Serve other requests from the index file
  server.use('/*', function(req, res) {
    res.sendFile(__dirname + '/www/index.html');
  });

  // Run the server
  server.listen(8080, "localhost", function (err) {
    if (err) {
      throw new gutil.PluginError('Webpack dev server', err);
    }
    onComplete();
    gutil.log("Development server ready http://localhost:8080/");
  });

  return server;

}

function launchLambdaLocal(onComplete) {

}

gulp.task("webpack-lambda", function(callback) {
  // run webpack
  webpack({
    // configuration
  }, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task("webpack-frontend", function(callback) {
  // run webpack
  webpack({
    // configuration
  }, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('serve', function() {
  //1. run your script as a server
  var server = gls.new('server.js');
  server.start();

  //2. run script with cwd args, e.g. the harmony flag
  var server = gls.new(['--harmony', 'myapp.js']);
  //this will achieve `node --harmony myapp.js`
  //you can access cwd args in `myapp.js` via `process.argv`
  server.start();

  //use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch(['static/**/*.css', 'static/**/*.html'], function () {
    server.notify.apply(server, arguments);
  });
  gulp.watch('myapp.js', server.start.bind(server)); //restart my server
});

// These are JS files that should be watched by Gulp. When running tests in the browser,
// watchify is used instead, so these aren't included.
const jsWatchFiles = ['src/**/*', 'test/**/*'];
// These are files other than JS files which are to be watched. They are always watched.
const otherWatchFiles = ['package.json', '**/.eslintrc', '.jscsrc'];

// Run the headless unit tests as you make changes.
gulp.task('watch', function() {
  const watchFiles = jsWatchFiles.concat(otherWatchFiles);

  launchWebpackDevServer(function() {
    gulp.watch(watchFiles, ['test']);
  });
});

// Set up a livereload environment for our spec runner
gulp.task('test-browser', ['build-in-sequence'], function() {
  $.livereload.listen({port: 35729, host: 'localhost', start: true});
  return gulp.watch(otherWatchFiles, ['build-in-sequence']);
});

// An alias of test
gulp.task('default', ['test']);
