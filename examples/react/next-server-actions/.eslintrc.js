module.exports = {
  extends: 'next/core-web-vitals',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
