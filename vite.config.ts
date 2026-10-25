import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site under /<repo>/; Vercel serves it from the domain root.
export default defineConfig({
  base: process.env.BASE_PATH ?? (process.env.VERCEL ? '/' : '/fhnet-island/'),
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
