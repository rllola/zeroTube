var path = require('path');

module.exports = {
    entry: "./app/app.js",
    output: {
        filename: "public/js/all.js",
        sourceMapFilename: "public/js/all.map"
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
            },
        ]
    }
}
