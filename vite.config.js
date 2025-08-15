import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu']
    }
  },
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent' 
    }
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu']
  }
})