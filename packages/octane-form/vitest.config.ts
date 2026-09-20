import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { octane } from 'octane/compiler/vite'
import { defineConfig } from 'vitest/config'

const root = dirname(fileURLToPath(import.meta.url))
const alias = {
  '@tanstack/form-core': resolve(root, '../form-core/src/index.ts'),
  '@tanstack/octane-form': resolve(root, 'src/index.ts'),
  '@tanstack/react-form': resolve(root, '../react-form/src/index.ts'),
}

export default defineConfig({
  test: {
    watch: false,
    projects: [
      {
        plugins: [
          octane({ ssr: false, hmr: false, exclude: ['/react-form/'] }),
        ],
        resolve: { alias },
        test: {
          name: 'octane-form',
          root,
          environment: 'jsdom',
          globals: true,
          include: ['tests/conformance/**/*.test.ts'],
          setupFiles: ['tests/conformance/test-setup.ts'],
        },
      },
      {
        plugins: [octane({ ssr: true, hmr: false })],
        resolve: {
          alias: [
            {
              find: /^octane$/,
              replacement: fileURLToPath(import.meta.resolve('octane/server')),
            },
            ...Object.entries(alias).map(([find, replacement]) => ({
              find,
              replacement,
            })),
          ],
        },
        test: {
          name: 'octane-form-ssr',
          root,
          environment: 'node',
          include: ['tests/ssr/**/*.test.ts'],
        },
      },
    ],
  },
})
