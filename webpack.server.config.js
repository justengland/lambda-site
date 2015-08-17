var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: {
    'lambda-server': [
      'webpack/hot/signal.js',
      './server/lambda-server/main',
    ],
    'hello-world': [
      'webpack/hot/signal.js',
      './server/hello-world',
    ],
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '/server/build'),
    filename: '[name].lambda.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] },
    ]
  },
  node: {
    __dirname: true,
    __filename: true
  },
  externals: nodeModules,
  recordsPath: path.join(__dirname, 'server/build/_records'),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
    new webpack.HotModuleReplacementPlugin({ quiet: true })
  ]
}
