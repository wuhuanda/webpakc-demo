const path = require('path');
const { ProvidePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { argv } = require('yargs');

argv.env && console.log('[ 环境参数 ]', argv.env);

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    chunkFilename: (pathData) => {
      return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
    },
    path: path.join(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:5].[ext]',
            outputPath: 'assets/imgs/',
          },
        },
      },
      {
        test: /\.ttf$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:5].[ext]',
            outputPath: 'assets/fonts/',
          },
        },
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(),
    new ProvidePlugin({
      _: 'lodash',
      lodash: 'lodash',
      _merge: ['lodash', 'merge'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
