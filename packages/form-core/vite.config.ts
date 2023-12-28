import { defineConfig } from 'vitest/config'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts(), externalizeDeps()],
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
  },
  test: {
    name: 'form-core',
    dir: './src',
    watch: false,
    environment: 'jsdom',
    globals: true,
    coverage: { provider: 'istanbul' },
  },
})
