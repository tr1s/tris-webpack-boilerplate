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