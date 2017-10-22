const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(__dirname, '../../dev/index.js')
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../../dev'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, '../../dev'),
    hot: true,
    host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /node_modules\/.*\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader',
      }
    ]
  }
};
