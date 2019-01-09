const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: 'last 2 versions',
    }),
    require('cssnano')({
        preset: 'default',
    }),
    purgecss({
      content: ['./**/*.html'],
      keyframes: true
    })
  ]
}