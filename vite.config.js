import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages can't send security headers, so the policy ships as a meta tag.
// It's added to production builds only: the dev server needs inline scripts for hot reload.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

const csp = () => ({
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
})

// BASE_PATH is set by the GitHub Pages workflow. It is "/" for a <user>.github.io repo,
// or "/<repo>/" for a project repo.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), csp()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
