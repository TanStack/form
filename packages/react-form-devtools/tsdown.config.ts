import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    dts: true,
    clean: true,
  },
  {
    entry: { production: 'src/production.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    dts: true,
    clean: false,
  },
])
