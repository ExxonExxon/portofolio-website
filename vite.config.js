import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";
import { photosPlugins } from "./dev/photos/photos-plugin.js";

// HTML partials (nav/footer) injected at build + dev time.
const partials = {
  nav: readFileSync(
    resolve(import.meta.dirname, "src/partials/nav.html"),
    "utf-8",
  ).trim(),
  footer: readFileSync(
    resolve(import.meta.dirname, "src/partials/footer.html"),
    "utf-8",
  ).trim(),
};

function htmlPartialsPlugin() {
  return {
    name: "html-partials",
    transformIndexHtml(html) {
      return html
        .replace("<!-- @partial nav -->", partials.nav)
        .replace("<!-- @partial footer -->", partials.footer);
    },
  };
}

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        photography: resolve(import.meta.dirname, "photography/index.html"),
        contact: resolve(import.meta.dirname, "contact/index.html"),
        projects: resolve(import.meta.dirname, "projects/index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
      },
    },
    cssMinify: true,
    minify: "esbuild",
    sourcemap: false,
  },
  server: {
    open: false,
    port: 3000,
  },
  plugins: [...photosPlugins, htmlPartialsPlugin()],
});
