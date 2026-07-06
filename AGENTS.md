# AGENTS.md — portofolio-website

Personal portfolio site for Tomas Gorjux at `tomas.gorjux.net`.

## Stack

Vite 8 + vanilla CSS + vanilla JS (ESM). No TypeScript, no testing, no linter.
**Tailwind removed May 2026 — now uses pure CSS with custom properties.**

## Commands

```sh
npm run dev      # dev server on port 3000
npm run build    # outputs to dist/
npm run preview  # preview the built site
npm run format   # prettier across all files
```

## Multi-page structure

Three HTML entry points defined in `vite.config.js`:

- `index.html` → entry `src/scripts/main.js`
- `photography/index.html` → entry `src/scripts/photography.js` — served at `/photography/`
- `contact/index.html` → entry `src/scripts/contact.js` — served at `/contact/`

All share `nav.js` + `theme.js` for mobile menu and dark mode.
Each page has its own CSS in `src/styles/{main,photography,contact}.css`.

Clean URLs are achieved via directory-based pages (e.g. `photography/index.html`).
Netlify redirects handle `.html` → clean URL redirects.

Shared CSS architecture:

- `src/styles/variables.css` — CSS custom properties (colors, shadows, transitions)
- `src/styles/components.css` — all component classes (nav, cards, buttons, forms, modal, footer, etc.)

## HTML Partials

Nav and footer are extracted into `src/partials/` and injected at build time via
a custom Vite plugin in `vite.config.js`. Use `<!-- @partial nav -->` and
`<!-- @partial footer -->` placeholders.

## Dark mode

Uses `.dark` class on `<html>` (applied by inline `<script>` in `<head>` before
paint to avoid flash). The `.dark` class switches CSS custom properties in
`variables.css`. Login persisted in `localStorage.theme`.

## Photography page (`photography/index.html`)

Masonry-style gallery with year grouping. Photos are defined as a JS array in
`src/scripts/photography.js` — each entry needs `src`, `alt`, and `year`. The
page renders year sections automatically, sorted newest-first.

To add a photo:
1. Drop the `.webp` in `assets/photography-images/`
2. Add one line to the `photos` array in `photography.js`

Uses CSS `column-count` for the waterfall layout; no JS layout calculations.
Images use native `loading="lazy"` + `decoding="async"`.

## Contact form

Submits to Formspree (`https://formspree.io/f/mnjbaeag`). No backend code in repo.

## Assets

- `public/` — served as static root by Vite
- `assets/photography-images/` — photography gallery images (not under `public/`; referenced from `index.html` via `/assets/...`)
- Photography images are WebP for performance

## Notable conventions

- Font Awesome (free) via `@fortawesome/fontawesome-free` npm dependency
- AOS (Animate On Scroll) library used throughout
- Cards use `.card` class with hover lift effect in CSS
- Mobile menu uses clip-path animation pattern
- CSS custom properties handle all theming — dark mode is automatic via variable switching
- Component classes named following BEM-inspired convention (`.card`, `.btn--cta`, `.feature-card--dev`, etc.)
