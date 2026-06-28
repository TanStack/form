import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  tsconfig: './tsconfig.build.json',
  format: ['esm', 'cjs'],
  unbundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  fixedExtension: false,
  exports: true,
  publint: {
    strict: true,
  },
})
