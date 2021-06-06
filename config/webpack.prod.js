const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin');
const Terser = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:5].css',
    }),
    new BundleAnalyzerPlugin(),
  ],
  optimization: {
    minimizer: [new OptimizeCssAssets(), new Terser()],
  },
};

module.exports = merge(baseConfig, prodConfig);
