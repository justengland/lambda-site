const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const watchFiles = ['server/**/*', 'end-to-end/**/*', 'dev-server/**/*'];

//function startExpressServer() {
//
//  app.use(tinylr.middleware({ app: app }));
//  app.use(require('connect-livereload')({port: 4002}));
//  app.listen(3000, '0.0.0.0');
//}

function notifyLiveReload(event) {
  console.log('NotifyLiveReload', event)
  var fileName = require('path').relative(__dirname, event.path);

  console.log(JSON.stringify(tinylr, 0 ,2))

  //var reload = tinylr();
  //reload.changed({
  //  body: {
  //    files: [fileName]
  //  }
  //});
}

//gulp.task('livereload', function() {
//  tinylr = require('tiny-lr')();
//  tinylr.listen(35729);
//});

gulp.task('watch', function() {
  gulp.watch(watchFiles, notifyLiveReload);
});

//gulp.task('server', function() {
//  startExpressServer();
//});
var nodemonStarted = false;
gulp.task('nodemon', function (cb) {
  return nodemon({
    script: './dev-server/app.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!nodemonStarted) {
      cb();
      nodemonStarted = true;
    }
  });
});

gulp.task('default', ['nodemon'], function() {

})
