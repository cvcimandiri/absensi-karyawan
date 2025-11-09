import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // agar bisa di-deploy ke Netlify / Vercel tanpa error path
})
