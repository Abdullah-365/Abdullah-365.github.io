import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is set by the GitHub Pages workflow. It is "/" for a <user>.github.io repo,
// or "/<repo>/" for a project repo.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
