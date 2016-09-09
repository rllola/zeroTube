const webpack = require('webpack')

module.exports = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  entry: ['bootstrap/dist/js/bootstrap.min.js', './app/app.js'],
  output: {
    filename: 'public/js/all.js',
    sourceMapFilename: 'public/js/all.map'
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      'window.Tether': 'tether'
    })
  ],
  devtool: '#source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
}
