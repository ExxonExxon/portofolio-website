import { defineConfig } from "vite";
import { resolve, join } from "path";
import {
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
  copyFileSync,
} from "fs";

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

/* ─── Photo Renamer — dev-only tool API ───────────────────────────
   Serves /api/photos and /api/rename while `npm run dev` is running.
   Never ships to the build: configureServer only runs in dev.
   ──────────────────────────────────────────────────────────────── */

const ROOT = import.meta.dirname;
const IMG_DIR = resolve(ROOT, "assets/photography-images");
const PUBLIC_IMG_DIR = resolve(ROOT, "public/assets/photography-images");
const PHOTOS_FILE = resolve(ROOT, "src/scripts/photography.js");
const HOME_FILE = resolve(ROOT, "index.html");
const PHOTO_PAGE_FILE = resolve(ROOT, "photography/index.html");

const ENTRY_RE =
  /\{\s*src:\s*"([^"]+)",\s*alt:\s*"([^"]*)",\s*year:\s*(\d+)\s*\}/g;
const SAFE_NAME_RE = /^[a-z0-9][a-z0-9_-]*\.webp$/i;

function readGallery() {
  const entries = [];
  const photosSrc = readFileSync(PHOTOS_FILE, "utf-8");
  const homeSrc = readFileSync(HOME_FILE, "utf-8");
  ENTRY_RE.lastIndex = 0;
  let m;
  while ((m = ENTRY_RE.exec(photosSrc))) {
    entries.push({
      name: m[1].split("/").pop(),
      alt: m[2],
      year: Number(m[3]),
      featured: homeSrc.includes(m[1]),
    });
  }
  return entries;
}

function readUnlisted() {
  const inGallery = new Set(readGallery().map((p) => p.name));
  return readdirSync(PUBLIC_IMG_DIR)
    .filter((f) => f.endsWith(".webp") && !inGallery.has(f))
    .sort();
}

function send(res, code, data) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

// Replace only when the needle is unique in the file (safe alt rewrite).
function replaceUnique(text, needle, replacement) {
  return text.split(needle).length - 1 === 1
    ? text.split(needle).join(replacement)
    : text;
}

function rewritePhotosJs(renames, adds) {
  let src = readFileSync(PHOTOS_FILE, "utf-8");
  let changed = false;
  const renamed = [];

  for (const r of renames) {
    const oldSrc = `/assets/photography-images/${r.from}`;
    if (!src.includes(oldSrc)) continue;
    const lines = src.split("\n");
    let touched = false;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].includes(oldSrc)) continue;
      const oldAlt = (lines[i].match(/alt:\s*"([^"]*)"/) || [])[1] ?? null;
      const oldYear = (lines[i].match(/year:\s*(\d+)/) || [])[1] ?? null;
      lines[i] = lines[i].split(oldSrc).join(`/assets/photography-images/${r.to}`);
      if (r.alt && oldAlt !== null && oldAlt !== r.alt) {
        lines[i] = lines[i]
          .split(`alt: "${oldAlt}"`)
          .join(`alt: "${r.alt}"`);
      }
      if (r.year !== undefined && oldYear !== null && String(r.year) !== oldYear) {
        lines[i] = lines[i]
          .split(`year: ${oldYear}`)
          .join(`year: ${r.year}`);
      }
      touched = true;
    }
    if (touched) {
      src = lines.join("\n");
      changed = true;
      const parts = [];
      if (r.from !== r.to) parts.push(`${r.from} -> ${r.to}`);
      if (
        r.year !== undefined &&
        r.oldYear !== undefined &&
        String(r.year) !== String(r.oldYear)
      )
        parts.push(`year ${r.oldYear} -> ${r.year}`);
      renamed.push(parts.join(" · ") || r.from);
    }
  }

  const added = [];
  if (adds.length) {
    const block = adds
      .map(
        (a) =>
          `  { src: "/assets/photography-images/${a.name}", alt: "${a.alt}", year: ${a.year} },`,
      )
      .join("\n");
    const arrStart = src.indexOf("const photos = [");
    const idx = arrStart === -1 ? -1 : src.indexOf("];", arrStart);
    if (idx !== -1) {
      src = src.slice(0, idx) + block + "\n" + src.slice(idx);
      changed = true;
      added.push(...adds.map((a) => a.name));
    }
  }

  if (changed) writeFileSync(PHOTOS_FILE, src);
  return { path: "src/scripts/photography.js", renamed, added };
}

function rewriteHomeHtml(renames) {
  let html = readFileSync(HOME_FILE, "utf-8");
  const renamed = [];
  for (const r of renames) {
    const oldSrc = `/assets/photography-images/${r.from}`;
    if (!html.includes(oldSrc)) continue;
    html = html.split(oldSrc).join(`/assets/photography-images/${r.to}`);
    renamed.push(`${r.from} -> ${r.to}`);
    if (r.alt && r.oldAlt) {
      html = replaceUnique(html, `alt="${r.oldAlt}"`, `alt="${r.alt}"`);
    }
  }
  if (renamed.length) writeFileSync(HOME_FILE, html);
  return { path: "index.html", renamed };
}

function rewritePhotoPageHtml(renames) {
  let html = readFileSync(PHOTO_PAGE_FILE, "utf-8");
  const renamed = [];
  for (const r of renames) {
    const oldEncoded = encodeURIComponent(r.from);
    const target = `photography-images/${r.to}`;
    const rawNeedle = `photography-images/${r.from}`;
    const encNeedle = `photography-images/${oldEncoded}`;
    let touched = false;
    if (html.includes(rawNeedle)) {
      html = html.split(rawNeedle).join(target);
      touched = true;
    }
    if (encNeedle !== rawNeedle && html.includes(encNeedle)) {
      html = html.split(encNeedle).join(target);
      touched = true;
    }
    if (r.alt && r.oldAlt) {
      const before = html;
      html = replaceUnique(html, `"name": "${r.oldAlt}"`, `"name": "${r.alt}"`);
      touched = touched || before !== html;
    }
    if (touched) renamed.push(`${r.from} -> ${r.to}`);
  }
  if (renamed.length) writeFileSync(PHOTO_PAGE_FILE, html);
  return { path: "photography/index.html", renamed };
}

function photoRenamerPlugin() {
  return {
    name: "photo-renamer-dev-tool",
    configureServer(server) {
      server.middlewares.use("/api/photos", (req, res) => {
        send(res, 200, { photos: readGallery(), unlisted: readUnlisted() });
      });

      server.middlewares.use("/api/rename", (req, res) => {
        if (req.method !== "POST") return send(res, 405, { error: "POST only" });
        let body = "";
        req.on("data", (c) => {
          body += c;
          if (body.length > 1e6) req.destroy();
        });
        req.on("end", () => {
          let payload;
          try {
            payload = JSON.parse(body);
          } catch {
            return send(res, 400, { error: "invalid JSON body" });
          }
          const { renames = [], adds = [] } = payload;

          // Sanitize text fields.
          for (const r of renames) {
            if (r.alt) r.alt = String(r.alt).replace(/["\\]/g, "");
            if (r.oldAlt) r.oldAlt = String(r.oldAlt).replace(/["\\]/g, "");
            if (r.year !== undefined && r.year !== null && r.year !== "")
              r.year = Number(r.year);
          }
          for (const a of adds) {
            a.alt = String(a.alt ?? "").replace(/["\\]/g, "");
            a.year = Number(a.year);
          }

          const errors = [];
          const currentFiles = new Set(readdirSync(IMG_DIR));
          const publicFiles = new Set(readdirSync(PUBLIC_IMG_DIR));
          const galleryNames = new Set(readGallery().map((p) => p.name));
          const targets = new Set();

          for (const r of renames) {
            if (!r.from || !r.to) {
              errors.push("every rename needs from and to");
              continue;
            }
            if (!SAFE_NAME_RE.test(r.to)) {
              errors.push(
                `invalid new name "${r.to}" (use letters, numbers, - and _)`,
              );
              continue;
            }
            if (
              r.year !== undefined &&
              (!Number.isFinite(r.year) || r.year < 2000 || r.year > 2100)
            ) {
              errors.push(`bad year for ${r.from}`);
              continue;
            }
            if (r.from === r.to) continue;
            if (!currentFiles.has(r.from) || !publicFiles.has(r.from)) {
              errors.push(`file not found: ${r.from}`);
              continue;
            }
            if (targets.has(r.to)) {
              errors.push(`duplicate target: ${r.to}`);
              continue;
            }
            if (
              (currentFiles.has(r.to) || publicFiles.has(r.to)) &&
              !renames.some((x) => x.from === r.to)
            ) {
              errors.push(`name already taken: ${r.to}`);
              continue;
            }
            targets.add(r.to);
          }

          for (const a of adds) {
            if (!a.name || !SAFE_NAME_RE.test(a.name)) {
              errors.push(`invalid photo name: ${a.name}`);
              continue;
            }
            if (galleryNames.has(a.name)) {
              errors.push(`already in gallery: ${a.name}`);
              continue;
            }
            if (!publicFiles.has(a.name)) {
              errors.push(`not found in public folder: ${a.name}`);
              continue;
            }
            if (!Number.isFinite(a.year)) {
              errors.push(`bad year for ${a.name}`);
              continue;
            }
          }

          if (errors.length)
            return send(res, 400, { error: "validation failed", errors });

          const renamed = [];
          for (const r of renames) {
            if (r.from === r.to) continue;
            renameSync(join(IMG_DIR, r.from), join(IMG_DIR, r.to));
            renameSync(join(PUBLIC_IMG_DIR, r.from), join(PUBLIC_IMG_DIR, r.to));
            renamed.push(`${r.from} -> ${r.to}`);
          }

          for (const a of adds) {
            copyFileSync(join(PUBLIC_IMG_DIR, a.name), join(IMG_DIR, a.name));
          }

          const files = [
            rewritePhotosJs(renames, adds),
            rewriteHomeHtml(renames),
            rewritePhotoPageHtml(renames),
          ];

          send(res, 200, {
            ok: true,
            renamed,
            added: adds.map((a) => a.name),
            files: files.map((f) => ({
              path: f.path,
              renames: f.renamed.length,
              adds: f.added?.length ?? 0,
            })),
          });
        });
      });
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
    photoRenamerPlugin(),
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
