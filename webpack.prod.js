const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CompressionPlugin = require('compression-webpack-plugin');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');


module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        sourceMap: true,
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
      prefix: '/images/icons/',
      icons: {
        appleIcon: false,
        appleStartup: false,
        android: false
      }
    }),
    // TODO: Fill out with your PWA name, description, color theme...
    new WebpackPwaManifest({
      name: 'Full Name',
      short_name: 'Short Name',
      description: 'A random description',
      theme_color: '#009688',
      background_color: '#f4f4f4',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      lang: 'en-US',
      Scope: '/',
      inject: true,
      fingerprints: true,
      ios: {
        'apple-mobile-web-app-status-bar-style': 'black-translucent'
      },
      publicPath: '.',
      includeDirectory: true,
      icons: [
        {
          src: path.resolve('./src/images/tris-package.svg'),
          sizes: [48, 72, 96, 128, 144, 192, 256, 384, 512],
          destination: path.join('images', 'icons')
        },
        {
          src: path.resolve('./src/images/tris-package.svg'),
          sizes: [40, 76, 80, 120, 152, 167, 180],
          destination: path.join('images', 'icons'),
          ios: true
        },
        {
          // Should be different image. "Apple startup image" or "Launch Screen Image"
          // Documentation: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
          src: path.resolve('./src/images/tris-package.svg'),
          sizes: 1024,
          destination: path.join('images', 'icons'),
          ios: 'startup'
        }
      ]
    }),
    new OfflinePlugin()
  ]
});
