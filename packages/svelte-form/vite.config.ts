import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// @ts-expect-error tsconfig with NodeNext throws an annoying error here which is not relevant
import packageJson from './package.json'

export default defineConfig({
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    globals: true,
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
  resolve: process.env.VITEST
    ? {
        conditions: ['browser'],
      }
    : undefined,
  plugins: [svelte({})],
})
