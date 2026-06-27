import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'

export default defineConfig({
  plugins: [
    devtools({
      injectSource: {
        enabled: true,
      },
    }),
    react({
      babel: {
        overrides: [
          {
            test: './src/**/*.tsx',
            plugins: ['babel-plugin-react-compiler'],
          },
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
