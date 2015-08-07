var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: {
    app: './www/assets/js/app.jsx',
    devServer: 'webpack/hot/dev-server'
  },
  output: {
    filename: '[name]_bundle.js', // Will output App_wp_bundle.js
    path: __dirname + '/assets/bundles',
    publicPath: 'http://localhost:8080/assets' // Required for webpack-dev-server
  },
  inline: true,
  watch: true,
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader?stage=2', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!less?strictMath&noIeCompat' }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
