// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. ADD THIS IMPORT

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. THIS LINE CALLS THE IMPORT
  ],
})