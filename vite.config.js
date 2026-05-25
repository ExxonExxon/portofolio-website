import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),

      },
    },
    cssMinify: true,
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    open: false,
    port: 3000,
  },
})
