import { defineConfig } from 'tsdown'
import solid from 'rolldown-plugin-solid'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    dts: true,
    plugins: [solid()],
    clean: true,
  },
  {
    entry: { production: 'src/production.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    dts: true,
    plugins: [solid()],
    clean: false,
  },
])
