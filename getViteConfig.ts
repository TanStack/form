import { defineConfig } from 'vitest/config'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import dts from 'vite-plugin-dts'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface GetViteConfigOptions {
  dirname: string
  // Relative to `dirname`
  entryPath: string
}

export const getDefaultViteConfig = ({
  dirname,
  entryPath,
}: GetViteConfigOptions) =>
  defineConfig({
    plugins: [
      dts({
        root: dirname,
        entryRoot: `${dirname}/src`,
        outDir: `${dirname}/dist/mjs`,
        afterBuild: () => {
          // To pass publint (`npm x publint@latest`) and ensure the
          // package is supported by all consumers, we must export types that are
          // read as ESM. To do this, there must be duplicate types with the
          // correct extension supplied in the package.json exports field.
          copyFileSync(
            `${dirname}/dist/mjs/index.d.ts`,
            `${dirname}/dist/mjs/index.d.mts`,
          )
        },
        compilerOptions: {
          module: 'esnext' as never,
        },
      }),
      dts({
        root: dirname,
        entryRoot: `${dirname}/src`,
        outDir: `${dirname}/dist/cjs`,
        afterBuild: () => {
          copyFileSync(
            `${dirname}/dist/cjs/index.d.ts`,
            `${dirname}/dist/cjs/index.d.cts`,
          )
        },
        compilerOptions: {
          module: 'commonjs' as never,
        },
      }),
      externalizeDeps(),
      {
        name: 'copy-mjs-cjs-to-index',
        closeBundle() {
          copyFileSync(
            `${dirname}/dist/mjs/index.mjs`,
            `${dirname}/dist/mjs/index.js`,
          )
          copyFileSync(
            `${dirname}/dist/cjs/index.cjs`,
            `${dirname}/dist/cjs/index.js`,
          )
        },
      },
    ],
    build: {
      outDir: `${dirname}/dist`,
      minify: false,
      sourcemap: true,
      lib: {
        entry: resolve(dirname, entryPath),
        formats: ['es', 'cjs'],
        fileName: (format) => {
          if (format === 'cjs') return `cjs/index.cjs`
          return `mjs/index.mjs`
        },
      },
    },
  })
