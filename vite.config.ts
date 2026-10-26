import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Vercel serves the site from the domain root; BASE_PATH overrides it for sub-path hosting.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
