import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

const partials = {
  nav: readFileSync(resolve(import.meta.dirname, "src/partials/nav.html"), "utf-8").trim(),
  footer: readFileSync(resolve(import.meta.dirname, "src/partials/footer.html"), "utf-8").trim(),
};

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        contact: resolve(import.meta.dirname, "contact.html"),
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
  plugins: [
    {
      name: "html-partials",
      transformIndexHtml(html) {
        return html
          .replace("<!-- @partial nav -->", partials.nav)
          .replace("<!-- @partial footer -->", partials.footer);
      },
    },
  ],
});
