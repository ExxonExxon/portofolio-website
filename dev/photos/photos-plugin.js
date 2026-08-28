import { resolve, join } from "path";
import {
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
  copyFileSync,
} from "fs";

/**
 * Photos plugin — dev-only.
 *
 * Everything photo-related lives here so vite.config.js stays tiny.
 *
 *   - Reads/writes the single source of truth at src/data/photos.json.
 *   - Injects the homepage photo strip from the `featured` photos at build/dev.
 *   - Exposes two dev-only editor APIs (/api/home-photos, /api/photos, /api/rename).
 *
 * The API endpoints run only inside `configureServer`, which Vite calls only in
 * `npm run dev`. They never ship to the build, and the HTML tool pages in this
 * folder sit outside public/, so nothing here is deployable.
 */

const ROOT = resolve(import.meta.dirname, "../..");
const IMG_DIR = resolve(ROOT, "assets/photography-images");
const PUBLIC_IMG_DIR = resolve(ROOT, "public/assets/photography-images");
const PHOTOS_JSON = resolve(ROOT, "src/data/photos.json");
const HOME_FILE = resolve(ROOT, "index.html");
const PHOTO_PAGE_FILE = resolve(ROOT, "photography/index.html");

const MAX_FEATURED = 4;
const SAFE_NAME_RE = /^[a-z0-9][a-z0-9_-]*\.webp$/i;

/* ─────────────────────────── Data layer ─────────────────────────── */

function readPhotos() {
  return JSON.parse(readFileSync(PHOTOS_JSON, "utf-8")).photos;
}

function writePhotos(photos) {
  writeFileSync(PHOTOS_JSON, JSON.stringify({ photos }, null, 2) + "\n");
}

function readGallery() {
  return readPhotos().map((p) => ({
    name: p.src.split("/").pop(),
    alt: p.alt,
    year: p.year,
    featured: !!p.featured,
  }));
}

function readUnlisted() {
  const inGallery = new Set(readGallery().map((p) => p.name));
  return readdirSync(PUBLIC_IMG_DIR)
    .filter((f) => f.endsWith(".webp") && !inGallery.has(f))
    .sort();
}

// Stable anchor id per photo, mirrors the gallery page (photo-sun-looking-down).
function photoId(photo) {
  const base = photo.src
    .split("/")
    .pop()
    .replace(/\.webp$/i, "");
  return (
    "photo-" +
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

/* ─────────────────────────── Small helpers ─────────────────────────── */

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

function readBody(req, onEnd) {
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
      return onEnd(null);
    }
    onEnd(payload);
  });
}

/* ───────────────────────── Homepage photo strip ───────────────────────── */

function buildPhotoStrip() {
  const featured = readPhotos()
    .filter((p) => p.featured)
    .slice(0, MAX_FEATURED);
  if (!featured.length) return "";

  const tile = (p, i) => {
    const offset = i % 2 === 1 ? " photo-card--offset" : "";
    // 50/50 tilt direction, matching the JS-built gallery cards.
    const tilt =
      Math.random() < 0.5
        ? " photo-card--tilt-left"
        : " photo-card--tilt-right";
    return `
          <a href="/photography/#${photoId(p)}" class="photo-card photo-card--cover${offset}${tilt}">
            <div class="photo-card__frame">
              <img
                src="${p.src}"
                alt="${p.alt}"
                loading="lazy"
                decoding="async"
              />
            </div>
            <span class="photo-card__caption">${p.alt}</span>
          </a>`;
  };

  return featured.map(tile).join("\n");
}

/* ──────────────── File rewrites used by the renamer tool ──────────────── */

function rewritePhotosJson(renames, adds) {
  const photos = readPhotos();
  let changed = false;
  const renamed = [];

  for (const r of renames) {
    const oldSrc = `/assets/photography-images/${r.from}`;
    const hit = photos.find((p) => p.src === oldSrc);
    if (!hit) continue;
    const parts = [];
    if (r.from !== r.to) {
      hit.src = `/assets/photography-images/${r.to}`;
      parts.push(`${r.from} -> ${r.to}`);
    }
    if (r.alt && hit.alt !== r.alt) {
      hit.alt = r.alt;
      parts.push("alt updated");
    }
    if (r.year !== undefined && hit.year !== r.year) {
      hit.year = r.year;
      parts.push(`year ${r.year}`);
    }
    changed = true;
    renamed.push(parts.join(" · ") || r.from);
  }

  const added = [];
  for (const a of adds) {
    photos.push({
      src: `/assets/photography-images/${a.name}`,
      alt: a.alt,
      year: a.year,
      featured: false,
    });
    changed = true;
    added.push(a.name);
  }

  if (changed) writePhotos(photos);
  return { path: "src/data/photos.json", renamed, added };
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

/* ────────────────────────── Dev tool: renamer ────────────────────────── */

function photoRenamerPlugin() {
  return {
    name: "photo-renamer-dev-tool",
    configureServer(server) {
      server.middlewares.use("/api/photos", (req, res) => {
        send(res, 200, { photos: readGallery(), unlisted: readUnlisted() });
      });

      server.middlewares.use("/api/rename", (req, res) => {
        if (req.method !== "POST")
          return send(res, 405, { error: "POST only" });

        readBody(req, (payload) => {
          if (!payload) return send(res, 400, { error: "invalid JSON body" });

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
            renameSync(
              join(PUBLIC_IMG_DIR, r.from),
              join(PUBLIC_IMG_DIR, r.to),
            );
            renamed.push(`${r.from} -> ${r.to}`);
          }

          for (const a of adds) {
            copyFileSync(join(PUBLIC_IMG_DIR, a.name), join(IMG_DIR, a.name));
          }

          const files = [
            rewritePhotosJson(renames, adds),
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

/* ──────────────────────── Dev tool: home editor ──────────────────────── */

function homePhotoPlugin() {
  return {
    name: "home-photo-strip",
    transformIndexHtml(html) {
      return html.replace("<!-- @photo-strip -->", buildPhotoStrip());
    },
    configureServer(server) {
      // GET — the full photo list for the editor (with featured flag).
      // POST — save wholesale edits (featured flags, year, alt) back to JSON.
      server.middlewares.use("/api/home-photos", (req, res) => {
        if (req.method === "GET") {
          return send(res, 200, { photos: readPhotos() });
        }

        if (req.method !== "POST")
          return send(res, 405, { error: "POST only" });

        readBody(req, (payload) => {
          if (!payload) return send(res, 400, { error: "invalid JSON body" });

          const photos = Array.isArray(payload.photos) ? payload.photos : [];

          // Sanitize: one entry per photo, scrub quotes, coerce year.
          const current = readPhotos();
          const bySrc = new Map(current.map((p) => [p.src, p]));
          const cleaned = [];
          const errors = [];

          for (const p of photos) {
            if (!bySrc.has(p.src)) continue; // ignore unknown src
            const year = Number(p.year);
            const alt = String(p.alt ?? "")
              .replace(/["\\]/g, "")
              .trim();
            if (!Number.isFinite(year) || year < 2000 || year > 2100) {
              errors.push(`bad year for ${p.src}`);
              continue;
            }
            cleaned.push({
              src: p.src,
              alt,
              year,
              featured: !!p.featured,
              // Preserve the aspect-ratio we store on the photography page so
              // the editor save never silently drops it.
              ...(bySrc.get(p.src).ratio
                ? { ratio: bySrc.get(p.src).ratio }
                : {}),
            });
          }

          if (cleaned.length !== current.length)
            errors.push("photo list changed length");
          const featuredCount = cleaned.filter((p) => p.featured).length;
          if (featuredCount > MAX_FEATURED)
            errors.push(`max ${MAX_FEATURED} featured photos`);

          if (errors.length)
            return send(res, 400, { error: "validation failed", errors });

          writePhotos(cleaned);
          send(res, 200, { ok: true, featured: featuredCount });
        });
      });
    },
  };
}

export const photosPlugins = [photoRenamerPlugin(), homePhotoPlugin()];
