# AGENTS.md — portofolio-website

Personal portfolio site for Tomas Gorjux at `tomas.gorjux.net`.

## Stack

Vite 8 + Tailwind 3.4 + vanilla JS (ESM). No TypeScript, no testing, no linter.

## Commands

```sh
npm run dev      # dev server on port 3000
npm run build    # outputs to dist/
npm run preview  # preview the built site
```

No lint/typecheck step — `build` is the only verification.

## Multi-page structure

Two HTML entry points defined in `vite.config.js`:
- `index.html` → entry `src/scripts/main.js`
- `contact.html` → entry `src/scripts/contact.js`

Both share `nav.js` for mobile menu. Each page has its own CSS in `src/styles/`.

## Sub-projects (UI clones)

HTML files in `dist/spotify-clone/`, `dist/facebook-clone/`, `dist/wikipedia-refined/` — **not tracked in source**. Their JS/CSS entry points are under `src/scripts/{spotify,facebook,wikipedia}.js` and `src/styles/{spotify,facebook,wikipedia}.css`. Vite picks them up via rollup code splitting from the `dist/` HTML files.

To rebuild everything including clones: `npm run build`.

## Dark mode

Uses Tailwind `darkMode: 'class'` strategy. Theme persisted in `localStorage.theme` (`'dark'` | `'light'`). Falls back to `prefers-color-scheme: dark`. The inline `<script>` in `<head>` applies the class before paint to avoid flash.

## Contact form

Submits to Formspree (`https://formspree.io/f/mnjbaeag`). No backend code in repo.

## Assets

- `public/` — served as static root by Vite
- `assets/photography-images/` — photography gallery images (not under `public/`; referenced from `index.html` via `/assets/...`)
- Photography images are WebP for performance

## Notable conventions

- Font Awesome (free) via `@fortawesome/fontawesome-free` npm dependency for main/facebook pages
- Lucide icons via `lucide` npm dep for Spotify page
- AOS (Animate On Scroll) library used throughout
- Cards use custom `.card` hover lift effect in CSS
- Mobile menu uses clip-path animation pattern (repeated in both CSS files)
- No Tailwind `@apply` used — all utility classes inline
- No `<style>` imports in JS entry — just CSS file imports
