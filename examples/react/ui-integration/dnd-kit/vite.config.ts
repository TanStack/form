import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
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
  ],
})
