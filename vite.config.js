import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssPlugin from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcssPlugin,
        autoprefixer,
      ],
    },
  },
  resolve: {
    alias: {
      '@react-oauth/google': '/node_modules/@react-oauth/google'
    }
  }
})