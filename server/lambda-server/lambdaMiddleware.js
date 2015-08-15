'use strict'

exports = module.exports = function lambdaHandler(req, res, next) {

  //console.log('<-----    lambdaMiddleware', req); // log the request
  console.log('<-----    lambdaMiddleware', req.url);

  if(req.url.indexOf('lambda') > -1) {
    res.send('lambda');
  }
  else {
    next();
  }

};
