# tris-webpack-boilerplate

[![Build Status](https://travis-ci.com/tr1s/tris-webpack-boilerplate.svg?branch=master)](https://travis-ci.com/tr1s/tris-webpack-boilerplate)
[![](https://img.shields.io/david/tr1s/tris-webpack-boilerplate.svg)](https://github.com/tr1s/tris-webpack-boilerplate)
[![](https://img.shields.io/david/dev/tr1s/tris-webpack-boilerplate.svg)](https://github.com/tr1s/tris-webpack-boilerplate)
[![](https://img.shields.io/badge/chat-twitter-blue.svg)](https://twitter.com/triscodes)
![](https://img.shields.io/github/license/tr1s/tris-webpack-boilerplate.svg)
[![](https://img.shields.io/badge/buy%20me%20a%20tea-donate-yellow.svg)](https://paypal.me/Nightizm)

![](https://i.imgur.com/qZQF2Ju.jpg)

__This webpack boilerplate is for beginner, intermediate, and advanced developers looking to create static websites immediately while acheiving all the right optimizations to score perfect on [Google Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/) and [Google Lighthouse Reports](https://developers.google.com/web/tools/lighthouse/)__ — This is an evolution of [tris-gulp-boilerplate](https://github.com/tr1s/tris-gulp-boilerplate), now with Webpack 4. Webpack is the new standard for bundling JS which [Gulp](https://gulpjs.com/) wasn't capable of. Thankfully Webpack can both run tasks and build js 💪.

The goal of this project/boilerplate is to reach the following people:

1. __The beginners__ 👶, who although use Gulp/Webpack/Node/Npm still need more thorough explainations than the more acquainted developers. They want things to work, but they want to know _how_ and _why_ as well.
2. __The side-project hustlers__ 🏃‍♀️, those with all the great ideas but don't want to waste time with setup. They need to get their ideas, apps, and websites out and into the browser... _fast_.
3. __The obsessive compulsive__ 🕵️‍♂️, people who are obsessed with getting those perfect scores on performance and optimizaitons reports. People who are digitally organized and pride themselves knowing that all their files are minimized, compressed, zipped, and ready to ship!

Feel free to fork and create your own workflows based off this template! Everyone's a little different, I understand.

Now that version 1 status has been acheived, that means everything works but __more thorough documentation will soon come__.

___

## Usage:

You need [git](https://git-scm.com/) and [node.js](https://nodejs.org/) on your computer before running.

1. `git clone https://github.com/tr1s/tris-webpack-boilerplate.git your-project-name`
2. `cd your-project-name`
3. `npm install`
4. `npm start`

You're all set, start coding 👩‍💻👨‍💻 !

Remove everything in the `src/styles/` folder, `src/index.html` and `src/index.scss/` if you'd like to start 100% fresh and/or create your own Sass worklow. I based my folder structure off the [7-1 pattern](https://vanseodesign.com/css/sass-directory-structures/).

___

## Features:

- [Webpack config split](#wcs)
- [Webpack development server](#wds)
- [HTML assets + minification](#html)
- [SCSS to CSS + autoprefixing](#sass)
- [ES6 transpiling](#es6)
- [Defering Scripts](#defer)
- [Image assets + compression](#img)
- [Font loading](#font)
- [Asset compression (gzip)](#gzip)
- [Sourcemaps](#source)
- [Favicon generation](#favi)
- [Offline first and caching](#offline)

___

## Features Explained:

<a name="wcs"/></a>

##### Webpack Config Split

Instead of having one big `webpack.config.js`, we'll split our production and development builds into two new configs called `webpack.dev.js` and `webpack.prod.js`. Configurations we want on both development and production will go in the `webpack.common.js` config.

When we run `npm start`, it will run the dev build based off the `webpack.dev.js` config which has already merged the `webpack.common.js` into itself.

```js
/* webpack.dev.js */

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

/* as you can see it merges our common config then adds extra code */

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
});
```

Since we want our development to be as accurate as possible, we keep our development and production builds identical. The only differences are that we use a lighter weight source map for development. Our production build will handle compressing images, minifying html/css/js, outputting favicons, and caching, so the code won't change, it will just become better suited for production when you're ready to take your site live.

```js
/* webpack.prod.js */

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

/* all the requires for optimizations and plugins */

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CompressionPlugin = require('compression-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

/* as you can see it merges our common config then adds extra code */

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },
  plugins: [
    new CompressionPlugin({
      test: /\.(html|css|js)(\?.*)?$/i // only compressed html/css/js, skips compressing sourcemaps etc
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      gifsicle: { // lossless gif compressor
        optimizationLevel: 9
      },
      pngquant: ({ // lossy png compressor, remove for default lossless
        quality: '75'
      }),
      plugins: [imageminMozjpeg({ // lossy jpg compressor, remove for default lossless
        quality: '75'
      })]
    }),
    new FaviconsWebpackPlugin({
      logo: './src/images/tris-package.svg',
      icons: {
        twitter: true,
        windows: true
      }
    }),
    new OfflinePlugin()
  ]
});
```
___

<a name="wds"/></a>

##### Webpack development server

The webpack-dev-server is configured in the package.json. `npm start` will run the server and open your project in the browser using the `webpack.dev.js` config. `npm start` is npm's default script, so you don't need to add `run` to it. But for the build you need to type `npm run build`.

```json
"scripts": {
  "start": "webpack-dev-server --open --config webpack.dev.js",
  "build": "webpack --config webpack.prod.js"
},
```
___

<a name="html"/></a>

##### HTML assets and minification

We use the [html-loader](https://github.com/webpack-contrib/html-loader) to export HTML as a string and minify the output. This allows you to import your `src/index.html` from your `src/index.js`.

```js
/* webpack.common.js */

{
  test: /\.html$/,
  use: [{
    loader: 'html-loader',
    options: {
      minimize: true
    }
  }]
},
```

```js
/* src/index.js */

import './index.html';
```

We then use [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to create a new `index.html` which will then go in the `dist` folder upon build. It will also work in development build as well since it's in the `webpack.common.js`.

The `template:` option is where you're pulling your HTML template from. You can use your own html template or you can even use it with handlebars template, [among a few others](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md).

The `inject:` option is where your assets will go. Webpack will put your bundled `webpack-bundle.js` at the bottom of the body by default, but here I switched it to `head` because we'll be using the [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin) to defer the scripts in the head, [which helps your websites performance](https://flaviocopes.com/javascript-async-defer/).

```js
/* webpack.common.js */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

plugins: [
  new HtmlWebpackPlugin({
    title: 'tris-webpack-boilerplate',
    filename: 'index.html',
    template: './src/index.html',
    inject: 'head'
  }),
  new HtmlWebpackPlugin({
    title: 'tris-404-page',
    filename: '404.html',
    template: './src/404.html',
    inject: 'head'
  }),
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer'
  }),
],
```
Read more about [loaders](https://webpack.js.org/concepts/loaders/).
___

<a name="sass"/></a>

##### SCSS to CSS + autoprefixing

In order to use Sass/SCSS, we need to use a few loaders to get our desired results. The [css-loader](https://github.com/webpack-contrib/css-loader), [postcss-loader](https://github.com/postcss/postcss-loader), and the [sass-loader](https://github.com/webpack-contrib/sass-loader).

`test:` is using regex to check for any sass, scss, or css files and then runs them through these three loaders.

```js
/* webpack.common.js */
{
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ]
},
```

The second part of the loader sequence, the `postcss-loader`, that's where you'll be minifying and autoprefixing your css. To do this we create a `postcss.config.js` inside the `src/` folder and configure it like so...

```js
/* postcss.config.js */

module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: 'last 2 versions',
    }),
    require('cssnano')({
        preset: 'default',
    })
  ]
}
```

Read up on [autoprefixer](https://github.com/postcss/autoprefixer) and [cssnano](https://cssnano.co/) to configure it more to your liking if need be. Additionally read up on [postcss](http://julian.io/some-things-you-may-think-about-postcss-and-you-might-be-wrong/) in general as it is a very powerful tool to have in your arsenal.

The [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) is the final step as it acts as a loader as well as extracts the CSS and puts it into the head of your website.

```js
/* webpack.common.js */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");


plugins: [
  new MiniCssExtractPlugin({
    filename: 'webpack-bundle.css',
    chunkFilename: '[id].css'
  })
],
```
___

<a name="es6"/></a>

##### ES6 transpiling

You may want to use the latest JavaScript features and syntax, but not all browsers support them yet. [Babel](https://babeljs.io/) will handle that for us.

Here we are testing for all js files excluding the `node_modules` folder, then running it through the [babel-loader](https://github.com/babel/babel-loader) with the [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env) preset.

```js
/* webpack.common.js */

{
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
}
```

This time we're venturing into the `webpack.prod.js` file. When we run `npm run build`, our outputted js will be minified and have full sourcemaps. Running in dev mode via `npm start` we'll still have lighter sourcemaps but the js will not be minified.

```js
/* webpack.prod.js */

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },
});
```

## Gotcha's:

Coming Soon _(hint: I want to murder jQuery)_

___

Hope this helped! Follow me on [twitter](https://twitter.com/triscodes) if you'd like. 💎✨🌸