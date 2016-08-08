
module.exports = {
  target: 'web',
  node: {
    fs: 'empty'
  },
  entry: './app/app.js',
  output: {
    filename: 'public/js/all.js',
    sourceMapFilename: 'public/js/all.map'
  },
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
