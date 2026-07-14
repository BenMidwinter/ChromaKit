import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://BenMidwinter.github.io/ChromaKit/
// Local `npm run dev` / `npm run preview` keep base `/` unless GITHUB_PAGES=1.
const base = process.env.GITHUB_PAGES === '1' ? '/ChromaKit/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    // Prefer .ts sources when both a shim .js and .ts exist (Phase A lib migration).
    extensions: ['.ts', '.tsx', '.mts', '.mjs', '.js', '.jsx', '.json'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})