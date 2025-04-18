import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
  resolve: process.env.VITEST
    ? {
        conditions: ['browser'],
      }
    : undefined,
})
