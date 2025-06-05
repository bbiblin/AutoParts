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
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    mimeTypes: {
      '.js': 'application/javascript',
      '.css': 'text/css'
    },
    port: 3000,
    host: true
  }
})
