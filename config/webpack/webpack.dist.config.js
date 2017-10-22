const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(__dirname, '../../src/index.js')
  ],
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    ]
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../../dist/'),
    library: 'react-form',
    libraryTarget: 'umd',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '../../package.json'), to: path.join(__dirname, '../../dist/package.json') }
    ])
  ]
};
