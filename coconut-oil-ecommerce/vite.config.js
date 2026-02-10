import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',  // Explicitly set root directory
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
    open: false,
    cors: true
  }
})
