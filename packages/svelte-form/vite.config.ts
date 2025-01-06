import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte';
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
  plugins: [
    svelte({
    })
  ]
})
