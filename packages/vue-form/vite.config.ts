import { defineConfig } from 'vitest/config'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import dts from 'vite-plugin-dts'
import { copyFileSync } from 'node:fs'

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/mjs',
      afterBuild: () => {
        // To pass publint (`npm x publint@latest`) and ensure the
        // package is supported by all consumers, we must export types that are
        // read as ESM. To do this, there must be duplicate types with the
        // correct extension supplied in the package.json exports field.
        copyFileSync('dist/mjs/index.d.ts', 'dist/mjs/index.d.mts')
      },
      compilerOptions: {
        module: 'esnext',
      },
    }),
    dts({
      outDir: 'dist/cjs',
      afterBuild: () => {
        copyFileSync('dist/cjs/index.d.ts', 'dist/cjs/index.d.cts')
      },
      compilerOptions: {
        module: 'commonjs',
      },
    }),
    externalizeDeps(),
    {
      name: 'copy-mjs-cjs-to-index',
      closeBundle() {
        copyFileSync('dist/mjs/index.mjs', 'dist/mjs/index.js')
        copyFileSync('dist/cjs/index.cjs', 'dist/cjs/index.js')
      },
    },
  ],
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'cjs') return `cjs/index.cjs`
        return `mjs/index.mjs`
      },
    },
  },
  test: {
    name: 'vue-query',
    dir: './src',
    watch: false,
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    coverage: { provider: 'istanbul' },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
