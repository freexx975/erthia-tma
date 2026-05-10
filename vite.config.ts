
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ton: ['@tonconnect/ui-react', '@ton/ton'],
          telegram: ['@telegram-apps/sdk-react'],
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    https: false,
    allowedHosts: ['lingo-recoup-monument.ngrok-free.dev'],
  }
})
