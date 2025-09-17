import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/devtools-production.tsx'],
})
