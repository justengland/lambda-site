var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

module.exports = {
  entry: [
     'webpack-dev-server/client?http://localhost:3000',
     'webpack/hot/only-dev-server',
    './client/components/main.js',
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] },
    ]
  },
  output: {
    path: path.join(__dirname, 'client/build'),
    publicPath: 'http://localhost:3000/build',
    filename: 'main.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({ quiet: true })
  ]

}
