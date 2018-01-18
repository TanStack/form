module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactForm',
      externals: {
        react: 'React',
      },
    },
  },
}
