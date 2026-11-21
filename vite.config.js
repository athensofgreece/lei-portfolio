import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Content-Security-Policy in index.html is for the live site. While running `npm run dev`,
// Vite adds styles and scripts inline, which that policy blocks (the page then shows with no CSS).
// So the policy is removed only in dev. The built site keeps it.
const devWithoutCsp = () => ({
  name: 'dev-without-csp',
  apply: 'serve',
  transformIndexHtml: (html) => html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i, ''),
})

// base './' lets the built site work on GitHub Pages at any repo path.
export default defineConfig({ base: './', plugins: [react(), devWithoutCsp()] })
