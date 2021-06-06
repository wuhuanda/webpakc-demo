const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
  },
  plugins: [new HotModuleReplacementPlugin()],
};

module.exports = merge(baseConfig, devConfig);
