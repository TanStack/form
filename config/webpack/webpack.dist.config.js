const path = require('path');
// const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: [
    path.join(__dirname, '../../src/index.js')
  ],
  // target: 'node', // in order to ignore built-in modules like path, fs, etc.
  // externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    // Uncomment redux and react-redux section if dont want to bundle them into dist

    // redux: {
    //   commonjs: 'redux',
    //   commonjs2: 'redux',
    //   amd: 'redux',
    //   root: 'Redux'
    // },
    // 'react-redux': {
    //   commonjs: 'react-redux',
    //   commonjs2: 'react-redux',
    //   amd: 'react-redux',
    //   root: 'ReactRedux'
    // },
    'prop-types': {
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
      root: 'PropTypes'
    }
  },
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
  }
};
