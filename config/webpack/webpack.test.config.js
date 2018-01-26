const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'cheap-module-source-map',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: [
              'transform-class-properties',
              [
                'transform-runtime',
                {
                  helpers: false,
                  polyfill: false,
                  regenerator: true,
                  moduleName: 'babel-runtime'
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
