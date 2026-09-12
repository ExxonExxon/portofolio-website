import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync, readdirSync } from "fs";
import { photosPlugins } from "./dev/photos/photos-plugin.js";

// Every src/partials/*.html is injected wherever <!-- @partial <name> -->
// appears. Unknown names fail the build instead of shipping silently.
const partialsDir = resolve(import.meta.dirname, "src/partials");
const partials = Object.fromEntries(
  readdirSync(partialsDir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => [
      file.replace(/\.html$/, ""),
      readFileSync(resolve(partialsDir, file), "utf-8").trim(),
    ]),
);

function htmlPartialsPlugin() {
  return {
    name: "html-partials",
    transformIndexHtml(html) {
      return html.replace(
        /<!--\s*@partial\s+([\w-]+)\s*-->/g,
        (match, name) => {
          if (!(name in partials)) {
            throw new Error(
              `Unknown partial "${name}". Available: ${Object.keys(partials).join(", ")}`,
            );
          }
          return partials[name];
        },
      );
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
        webDesign: resolve(import.meta.dirname, "web-design/index.html"),
        pricing: resolve(import.meta.dirname, "web-design/pricing/index.html"),
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
