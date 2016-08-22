var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var pkg = require('./package.json');

var isDev = parseInt(process.env.YO_DEBUG);

var entries = path.join(__dirname, 'src/index.js');
var filename = 'index.js';
var wpath = '.';
var wpublicpath = '';
var plugins = [];
var output = {
    filename: filename,
    chunkFilename: '[id].chunk.js',
    path: wpath,
    publicPath: wpublicpath
};

if (isDev) {
  entries = path.join(__dirname, 'examples/simple.js');
  filename = '[name].js';
  wpath = path.join(__dirname, './examples/__build__');
  wpublicpath = '/__build__/';
  output =
  plugins = plugins.concat([
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]);
} else {
  output['libraryTarget'] = "umd";
  output['library'] = 'yo-collapsable';
  output['umdNamedDefine'] = true;
}

module.exports = {
  entry: entries,
  output: output,
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },
  plugins: plugins
};
