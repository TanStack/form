import { defineConfig } from 'vite'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})
