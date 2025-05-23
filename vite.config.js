import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true
  },
  server: {
    port: 3000,
    host: true
  }
})