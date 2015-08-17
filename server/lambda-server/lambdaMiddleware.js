'use strict';
import fs from 'fs';
import path from 'path';

const lamdaLocation = '../build';
const lambdaDirectory = './server/build';

export default function (req, res, next) {

  const foundLambda = getLambdaFunction(req);
  if (foundLambda) {
    executeLambdaFunction(foundLambda, req.body, function(result) {
      res.send(result);
    });
  }
  else {
    next();
  }

}

export let urlsToMonitor = getUrls(getLambdaScripts());
let lambdas = setupLambdas(urlsToMonitor);

function getLambdaScripts() {
  const results = fs.readdirSync(lambdaDirectory);
  return results.filter(file => {
    return file.indexOf('.lambda.js') > -1 && file.indexOf('lambda-server') === -1;
  });
}

function getUrls(lambdaFiles) {
  return lambdaFiles.map(file => {
    return file.replace('.lambda.js', '');
  });
}

function getLambdaFunction(req) {
  if(req.method === 'POST') {
    const url = req.url.replace('/', '');
    for (var i = 0; i < lambdas.length; i++) {
      var urlToCheck = lambdas[i].name.replace('/', '');

      if (url === urlToCheck)
        return lambdas[i];
    }
  }

  return false;
}

function setupLambdas() {
  let lambdaFunctions = [];
  urlsToMonitor.forEach(url => {
    let lambdaPath = '../' + url + '.js';
    const lambdaFunction = require('../hello-world.js')
    console.log('lambdaPath', lambdaPath);
    lambdaFunctions.push({
      name: url,
      lambda: lambdaFunction
    })
  });
  return lambdaFunctions;
}


function executeLambdaFunction(foundLambda, event, onComplete) {
  console.log('handle lambda request: ', foundLambda);

  const context = {
    succeed: function(response) {
      console.log('context succeed called!!!', response);
      onComplete(response);
    },
    fail: function () {
      console.log('context succeed called!!!');
      onComplete();
    }
  };

  foundLambda.lambda.handler(event, context);
}

