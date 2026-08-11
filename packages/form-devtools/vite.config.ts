import path from 'node:path'
import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'
import packageJson from './package.json' with { type: 'json' }

const normalizeChunkPath = (id: string | null | undefined) =>
  id?.replaceAll(path.sep, '/')

const componentsEntry = normalizeChunkPath(
  path.resolve(import.meta.dirname, './src/components/index.tsx'),
)

const isBareImport = (id: string) =>
  !id.startsWith('.') &&
  !path.isAbsolute(id) &&
  !id.startsWith('\0') &&
  !id.startsWith('@/') &&
  id !== '@'

export default defineConfig({
  plugins: [
    solid({ hot: false }),
    tailwindcss(),
    {
      name: 'form-devtools-css-entry',
      renderChunk(code, chunk) {
        const isComponentsChunk =
          normalizeChunkPath(chunk.facadeModuleId) === componentsEntry ||
          Object.keys(chunk.modules).some(
            (moduleId) => normalizeChunkPath(moduleId) === componentsEntry,
          )

        if (!isComponentsChunk) {
          return null
        }

        return `import './style.css';\n${code}`
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    lib: {
      entry: {
        index: 'src/index.ts',
        production: 'src/production.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style',
    },

    rolldownOptions: {
      external: isBareImport,
    },
  },
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    globals: true,
    browser: {
      enabled: true,
      // CI runners (ubuntu-latest) ship with Google Chrome preinstalled, so
      // use it rather than downloading playwright's own browser build
      provider: playwright(
        process.env.CI ? { launchOptions: { channel: 'chrome' } } : {},
      ),
      instances: [{ browser: 'chromium', headless: true }],
    },
  },
})
