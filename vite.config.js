import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: base ko aapke repo naam se match hona chahiye
export default defineConfig({
  plugins: [react()],
  base: '/tracking/',
})
