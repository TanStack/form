const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
    path: path.join(__dirname, '../../'),
    library: 'react-form',
    libraryTarget: 'umd',
  }
};
