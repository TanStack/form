import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { extensions, ember } from '@embroider/vite'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  resolve: {
    alias: {
      '@tanstack/ember-form': fileURLToPath(
        new URL('./src/index.ts', import.meta.url),
      ),
    },
  },
  plugins: [
    ember(),
    babel({
      babelHelpers: 'inline',
      extensions,
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        tests: 'tests/index.html',
      },
    },
  },
})
