const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(__dirname, '../../dev/index.js'),
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../../docs/public'),
    publicPath: '/'
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
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '../../dev/index.html'), to: path.join(__dirname, '../../docs/public/index.html') },
      { from: path.join(__dirname, '../../dev/assets'), to: path.join(__dirname, '../../docs/public/assets') },
    ])
  ]
};
