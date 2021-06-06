# webpack学习笔记

> 模块化打包工具，一切皆模块

<!-- vscode-markdown-toc -->
* 1. [核心概念](#)
* 2. [安装依赖](#-1)
* 3. [webpack.config.js](#webpack.config.js)
	* 3.1. [配置示例](#-1)
	* 3.2. [loader](#loader)
	* 3.3. [plugins](#plugins)
	* 3.4. [source-map](#source-map)
	* 3.5. [HMR(Hot Module Replacement)](#HMRHotModuleReplacement)
	* 3.6. [babel](#babel)
	* 3.7. [polyfill](#polyfill)
* 4. [.babelrc](#babelrc)
* 5. [TreeeShaking](#TreeeShaking)
* 6. [dev 与 pro 的区别](#devpro)
	* 6.1. [dev环境](#dev)
	* 6.2. [pro环境](#pro)
	* 6.3. [共同点](#-1)
	* 6.4. [配置方案](#-1)
	* 6.5. [配置示例](#-1)
		* 6.5.1. [目录结构](#-1)
		* 6.5.2. [webpack.prod.js](#webpack.prod.js)
		* 6.5.3. [webpack.dev.js](#webpack.dev.js)
		* 6.5.4. [webpack.base.js](#webpack.base.js)
		* 6.5.5. [package.json](#package.json)
* 7. [打包优化](#-1)
	* 7.1. [入口配置](#-1)
		* 7.1.1. [entry多入口](#entry)
	* 7.2. [抽取公共代码](#-1)
		* 7.2.1. [splitchunks](#splitchunks)
	* 7.3. [动态加载](#-1)
		* 7.3.1. [按需加载](#-1)
		* 7.3.2. [懒加载](#-1)
	* 7.4. [Css文件代码分割](#Css)
		* 7.4.1. [mini-css-extract-plugin](#mini-css-extract-plugin)
		* 7.4.2. [optimize-css-assets-webpack-plugin](#optimize-css-assets-webpack-plugin)
* 8. [代码包分析工具](#-1)
	* 8.1. [webpack-bundle-analyzer](#webpack-bundle-analyzer)
		* 8.1.1. [webpack.prod.js](#webpack.prod.js-1)
* 9. [获取环境参数](#-1)
	* 9.1. [yargs](#yargs)
		* 9.1.1. [package.json](#package.json-1)
		* 9.1.2. [webpack.base.js](#webpack.base.js-1)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name=''></a>核心概念

- loader、plugins、Entry、Output、SourceMap、DevServer、Hmr、[--watch]、Babel
- TreeShaking、环境区分、CodeSpliting、打包分析、代码分割、环境变量使用

##  2. <a name='-1'></a>安装依赖

- webpack
- webpack-cli

##  3. <a name='webpack.config.js'></a>webpack.config.js

自定义webpack配置，会覆盖默认配置

###  3.1. <a name='-1'></a>配置示例

```jsx
const path = require('path');

module.exports = {
	// 默认production，打包文件压缩，开发：development，不被压缩
	mode: 'production',
	// 入口文件
	// entry: './src/index.js', // 简化写法
	entry: {
		main: './src/index.js',
	},
	// 输出
	output: {
		// 自定义打包文件名
		filename: 'index.js',
		// 尽量写绝对路径，避免不同环境下路径解析的方式不一致
		path: path.resolve(__dirname, 'dist'),
	},
};
```

通过 `npx webpack --config webpack.config.js` 执行打包。

###  3.2. <a name='loader'></a>loader

文件预处理器，对文件的特定的处理方案，需要安装相关的loader依赖

```jsx
// ...
module.exports = {
	// ...
	module: {
		rules: [
			{
				test: /\.(jpg|png|gif)$/, // 指定检测图片相关类型的文件
				use: {
					loader: 'file-loader',
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
				test: /\.(less|css)$/, // 指定检测less相关类型的文件
				use: {
					loader: ['style-loader', 'css-lodaer', 'less-loader'], // compiles Less to Css
				},
			},
		],
	},
}
// ...
```

###  3.3. <a name='plugins'></a>plugins

```jsx
const HtmlWebpackPlugin = require('html-webpack-plguin');
// ...
module.exports = {
	// ...
	plguins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
}
// ...
```

###  3.4. <a name='source-map'></a>source-map

用于定位打包后的源码

```jsx
// ...
module.exports = {
	// ...
	// eval-cheap-module-source-map 开发模式推荐
  // cheap-module-source-map 生产模式推荐
	devtool: 'eval-cheap-module-source-map',
},
```

###  3.5. <a name='HMRHotModuleReplacement'></a>HMR(Hot Module Replacement)

开启步骤：

1. 使用 `webpack-dev-server` 作为服务器启动
2. devServer中配置 `hot: true` 
3. plugins中配置 `hotModuleReplacementPlugin` 
4. js模块中增加 `module.hot.acceput` 增加 HMR 代码

webpack.config.js

```jsx
// ...
module.exports = {
	// ...
	devServer: {
		// 定位服务访问目录
		contenBase: path.join(__dirname, 'dist'),
		port: 8081,
	},
}
```

package.json

```json
{
	// ...
	"scripts": {
		// ...
		"dev": "webpack-dev-server"
	}
}
```

###  3.6. <a name='babel'></a>babel

js的编译器

```bash
npm install @babel/core @babel/preset-env babel-loader -D
```

```jsx
// ...
module.exports = {
	// ...
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					// 转换ES5+语法
					presets: ['@babel/preset-env'],
				},
				exclude: /node_modules/,
			},
		],
	},
}
// ...
```

标准引入的语法：箭头函数、let、const等可以被转换

标准引入的全局变量，部分原生对象新增的原型链上的方法：Promise、Symbol、set等无法被转换，此时需要用到 `polyfill` 进行兼容处理。

###  3.7. <a name='polyfill'></a>polyfill

```bash
npm install @babel/polyfill -D
```

index.js

```jsx
// 在页面中引入，如果在webpack中配置了 useBuiltIn 则不需要在页面中手动引入
import '@babel/polyfill';
```

webpack.config.js

```jsx
// ...
module.exports = {
	// ...
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					// 转换ES5+语法
					presets: ['@babel/preset-env', {
						// 必须同时设置corejs，默认使用corejs@2，我们需要用的是corejs@3
						useBuiltIn: 'usage', // options: 'useage', 'entry', false
						corejs: 3,
					}],
				},
				exclude: /node_modules/,
			},
		],
	},
}
// ...
```

全局变量形式将方法注入，在开发类库、UI组件时会造成全局变量的污染，这时候就需要用到 `@babel/plugin-transform-runtime` ，以闭包的形式注入，保证全局环境不被污染。

```bash
npm install @babel/plugin-transform-runtime @babel/runtime-corejs3 -D
```

webpack.config.js

```bash
// ...
module.exports = {
	// ...
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					plugins: [
						'@babel/plugin-transform-runtime', {
							corejs: 3,
						},
					],
				},
				exclude: /node_modules/,
			},
		],
	},
}
// ...
```

##  4. <a name='babelrc'></a>.babelrc

隔离babel配置与其他webpack配置

.babelrc

```bash
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```

##  5. <a name='TreeeShaking'></a>TreeeShaking

摇树优化

webpack4中将 `mode` 设置成 `production` 会自动进行摇树优化。

##  6. <a name='devpro'></a>dev 与 pro 的区别

###  6.1. <a name='dev'></a>dev环境

- devServer
- sourceMap
- 接口代理 proxy

###  6.2. <a name='pro'></a>pro环境

- treeShaking
- 代码压缩
- 提供公共代码

###  6.3. <a name='-1'></a>共同点

- 同样的入口
- 部分相同的代码处理

###  6.4. <a name='-1'></a>配置方案

- webpack.prod.js
- webpack.dev.js
- webpack.base.js 开发环境与生产环境公用的代码
- 使用 webpack-merge 进行配置合并

###  6.5. <a name='-1'></a>配置示例

####  6.5.1. <a name='-1'></a>目录结构

|-- project

|-- config

|-- webpack.base.js

|-- webpack.dev.js

|-- webpack.prod.js

####  6.5.2. <a name='webpack.prod.js'></a>webpack.prod.js

```jsx
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const prodConfig = {
	mode: 'production',
};
module.exports = merge(baseConfig, prodConfig);
```

####  6.5.3. <a name='webpack.dev.js'></a>webpack.dev.js

```jsx
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const devConfig = {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8081,
	},
	plugins: [
		new webpack.HotModuleReplacementPlguin(),
	],
};
module.exports = merge(baseConfig, devConfig);
```

####  6.5.4. <a name='webpack.base.js'></a>webpack.base.js

```jsx
const path = require('path');
const HtmlWebpackPlguin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: {
		index: './src/index.js',
		demo: './src/demo.js',
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, '../dist'),
	},
	module: {
		rules: [
			{
				test: /\.(jpb|png|gif)$/, // 指定检测图片相关类型的文件
				use: {
					loader: 'file-loader',
				},
			},
			{
				test: /\.ttf$/, // 指定检测字体相关类型的文件
				use: {
					loader: 'file-loader',
					name: '[name].[hash5].[ext]',
					outputpath: 'assets/',
				},
			},
			{
				test: /\.(less|css)$/, // 指定检测less相关类型的文件
				use: {
					loader: ['css-lodaer', 'less-loader'], // compiles Less to Css
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlguin({
			template: './src/index.html',
		}),
		new CleanWebpackPlugin(),
	],
};
```

####  6.5.5. <a name='package.json'></a>package.json

```json
// ...
"scripts": {
	"build:dev": "webpack --coinfig ./config/webpack.dev.js",
	"build:prod": "webpack --coinfig ./config/webpack.prod.js",
	"dev:server": "webpack-dev-server --config ./config/webpack.dev.js"
},
// ...
```

##  7. <a name='-1'></a>打包优化

###  7.1. <a name='-1'></a>入口配置

####  7.1.1. <a name='entry'></a>entry多入口

以引入JQuery为例，如果在每个页面中引入非常麻烦，我们可以在webpack配置中统一注入。

webpack.base.js

```jsx
// ...
entry: {
	// ...
	jquery: 'jquery',
},
// ...
plugins: [
	// ...
	nwe webpack.ProvidePlguin({
		$: 'jquery',
	}),
],
```

###  7.2. <a name='-1'></a>抽取公共代码

####  7.2.1. <a name='splitchunks'></a>splitchunks

`splitchunksPlugins` 

webpack.base.js

```jsx
// ...
module.exports = {
	// ...
	output: {
		chunkFilename: (pathData) => {
      return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
    },
    path: path.join(__dirname, '../dist'),
	},
	// ...
	optimization: {
		splitChunks: {
			chunks: 'all', // 从哪些chunks中抽取代码
			cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的问题
          priority: -10, // 优先级
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
```

###  7.3. <a name='-1'></a>动态加载

`@babel/plguin-syntax-dynamic-import`
.babelrc

```json
{
	"plugins": [
		"@babel/plugin-syntax-dynamic-import",
		// ...
	]
}
```

####  7.3.1. <a name='-1'></a>按需加载

####  7.3.2. <a name='-1'></a>懒加载

index.js

```jsx
import (/*webpackChunkName: 'jquery'*/ 'jquery').then(({default: $}) => {
	console.log($.length);
});
```

###  7.4. <a name='Css'></a>Css文件代码分割

配置代码分割压缩CSS代码的时候，会覆盖默认配置，所以需要手动配置压缩JS代码

####  7.4.1. <a name='mini-css-extract-plugin'></a>mini-css-extract-plugin

一般用于生产环境

配置示例

webpack.prod.js

```jsx
// ...
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prodConfig = {
	// ...
	module: {
		rules: [
			{
				test: /\.(less)$/, // 指定检测less相关类型的文件
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		// ...
		new MiniCssExtractPlugin({
			filename: '[name].[hash:5].css',
		}),
	]
};
```

####  7.4.2. <a name='optimize-css-assets-webpack-plugin'></a>optimize-css-assets-webpack-plugin

一般在生产环境下配置

配置示例

webpack.prod.js

```jsx
// ...
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const prodConfig = {
	// ...
	optimization: {
		minimizer: [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin(), // 由于CSS压缩优化配置导致原来默认压缩JS的配置被覆盖了，所以需要用TerserWebpackPlugin插件进行JS压缩
		],
	}
};
```

##  8. <a name='-1'></a>代码包分析工具

###  8.1. <a name='webpack-bundle-analyzer'></a>webpack-bundle-analyzer

####  8.1.1. <a name='webpack.prod.js-1'></a>webpack.prod.js

```jsx
// ...
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const prodConfig = {
	plugins: [
		// ...
		new WebpackBundleAnalyzer(),
	]
};
```

##  9. <a name='-1'></a>获取环境参数

###  9.1. <a name='yargs'></a>yargs

####  9.1.1. <a name='package.json-1'></a>package.json

```json
// ...
"scripts": {
	"build:dev": "webpack --coinfig ./config/webpack.dev.js",
	"build:prod": "webpack --coinfig ./config/webpack.prod.js --env production --myenv me",
	"dev:server": "webpack-dev-server --config ./config/webpack.dev.js"
},
// ...
```

####  9.1.2. <a name='webpack.base.js-1'></a>webpack.base.js

```jsx
// ...
const argv = require('yargs').argv;
console.log('环境参数: ', argv.env, argv.myenv); // production me
// 使用: argv.env === 'production' ? '' : '';
```