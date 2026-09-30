import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { octane } from 'octane/compiler/vite'
import { defineConfig } from 'vitest/config'
import packageJson from './package.json' with { type: 'json' }

const root = dirname(fileURLToPath(import.meta.url))
const alias = {
  '@tanstack/form-core': resolve(root, '../form-core/src/index.ts'),
  '@tanstack/octane-form': resolve(root, 'src/index.ts'),
}

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*'],
      extension: ['.ts', '.tsrx'],
    },
    projects: [
      {
        plugins: [octane({ ssr: false, hmr: false }) as never],
        resolve: { alias },
        test: {
          name: packageJson.name,
          root,
          dir: './tests',
          environment: 'jsdom',
          globals: true,
          include: ['**/*.test.{ts,tsrx}'],
          exclude: ['**/server.test.tsrx'],
          setupFiles: ['./tests/test-setup.ts'],
          typecheck: { enabled: true },
        },
      },
      {
        plugins: [octane({ ssr: true, hmr: false }) as never],
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
          name: `${packageJson.name}:ssr`,
          root,
          dir: './tests',
          environment: 'node',
          include: ['**/server.test.tsrx'],
        },
      },
    ],
  },
})
