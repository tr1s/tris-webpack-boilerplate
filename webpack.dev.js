const { join } = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { WebpackPluginServe } = require('webpack-plugin-serve');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: ['webpack-plugin-serve/client'],
  plugins: [
    new WebpackPluginServe({
      host: 'localhost',
      open: true,
      static: join(__dirname, 'dist'),
    })
  ],
  watch: true,
});