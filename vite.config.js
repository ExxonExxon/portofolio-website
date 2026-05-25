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
        facebook: resolve(__dirname, 'facebook-clone/index.html'),
        spotify: resolve(__dirname, 'spotify-clone/index.html'),
        wikipedia: resolve(__dirname, 'wikipedia-refined/index.html'),
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
