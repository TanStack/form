module.exports = {
  type: 'react-component',
  babel: {
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
  },
  npm: {
    esModules: true
    // umd: {
    //   global: 'ReactForm',
    //   externals: {
    //     react: 'React'
    //   }
    // }
  }
}
