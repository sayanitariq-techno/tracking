import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: yahan aapke repo ka naam base me hona chahiye
export default defineConfig({
  plugins: [react()],
  base: '/tracking/',
})
