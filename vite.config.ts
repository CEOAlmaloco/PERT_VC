import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  /** Misma URL habitual (5174) y acceso por IP de la red local (móvil u otro PC). */
  server: {
    port: 5174,
    strictPort: false,
    host: true,
  },
  preview: {
    port: 5174,
    strictPort: false,
    host: true,
  },
})
