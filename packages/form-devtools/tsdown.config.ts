import { defineConfig } from 'tsdown'
import solid from 'rolldown-plugin-solid'

const makeSolid = (ssr = false) =>
  solid({ solid: { generate: ssr ? 'ssr' : 'dom' } })

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    plugins: [makeSolid()],
    clean: true,
  },
  {
    entry: { server: 'src/index.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    plugins: [makeSolid(true)],
    dts: false,
    clean: false,
  },
  {
    entry: { 'production/index': 'src/production.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    plugins: [makeSolid()],
    clean: false,
  },
  {
    entry: { 'production/server': 'src/production.ts' },
    format: ['esm'],
    outDir: 'dist',
    fixedExtension: false,
    plugins: [makeSolid(true)],
    dts: false,
    clean: false,
  },
])
