import path from 'node:path'
import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json' with { type: 'json' }

const componentsEntry = path.resolve(__dirname, './src/components/index.tsx')

const isBareImport = (id: string) =>
  !id.startsWith('.') &&
  !id.startsWith('/') &&
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
        if (chunk.facadeModuleId !== componentsEntry) {
          return null
        }

        return `import './style.css';\n${code}`
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
    environment: 'happy-dom',
    globals: true,
  },
})
