# AGENTS.md — portofolio-website

Personal portfolio site for Tomas Gorjux at `tomas.gorjux.net`.

## Stack

Vite 8 + vanilla CSS + vanilla JS (ESM). No TypeScript, no testing, no linter.
Tailwind removed May 2026 — now uses pure CSS with custom properties.

## Commands

```sh
npm run dev      # dev server on port 3000
npm run build    # outputs to dist/
npm run preview  # preview the built site
npm run format   # prettier across all files
```

## Multi-page structure

Five HTML entry points defined in `vite.config.js`:

- `index.html` → entry `src/scripts/main.js`
- `photography/index.html` → entry `src/scripts/photography.js` — served at `/photography/`
- `contact/index.html` → entry `src/scripts/contact.js` — served at `/contact/`
- `projects/index.html` → entry `src/scripts/projects.js` — served at `/projects/`
- `privacy/index.html` → entry `src/scripts/privacy.js` — served at `/privacy/` (text-only legal page, linked from the footer)

All entries call the shared `initSite.js` bootstrap (active nav link, AOS
setup, mobile menu); `nav.js` holds that menu logic. `initSite` skips AOS on
mobile by default — only `main.js` passes `disableAosOnMobile: false`.

Shared JS modules (imported, never duplicated across pages):

- `src/scripts/initSite.js` — page bootstrap (nav + AOS + mobile menu)
- `src/scripts/nav.js` — active-nav link + mobile menu logic
- `src/scripts/photo-card.js` — the shared "mounted print" photo card (gallery + homepage strip)

Each page has its own CSS in
`src/styles/{main,photography,contact,projects,privacy}.css`.

Clean URLs are achieved via directory-based pages (e.g. `photography/index.html`).
Netlify redirects handle `.html` → clean URL redirects.

Shared CSS architecture (loaded in this order, pages only refine, never duplicate):

- `src/styles/variables.css` — CSS custom properties (colors, shadows, transitions)
- `src/styles/components.css` — all component classes (nav, cards, buttons, forms, footer, etc.)
- `src/styles/photo-card.css` — the shared "mounted print" photo card
- page CSS (`main`/`photography`/`contact`/`projects`/`privacy`) — loaded last, page-specific overrides

## HTML Partials

Nav and footer are extracted into `src/partials/` and injected at build time via
a custom Vite plugin in `vite.config.js`. Use `<!-- @partial nav -->` and
`<!-- @partial footer -->` placeholders.

## Photography page (`photography/index.html`)

Masonry-style gallery with year grouping. Photos live in ONE file —
`src/data/photos.json`. Each entry is `{ src, alt, year, featured, ratio }`:

- `src` — image path (files in `assets/photography-images/`, served copy in `public/`)
- `alt` — both the accessibility text and the on-page caption
- `year` — the year-group heading on the gallery page
- `featured` — `true` means "show on the homepage strip" (max 4)
- `ratio` — image width/height, used to reserve card space before decode

Two pages read the same file:

- `photography.js` imports it and renders year sections (newest-first).
- `index.html` gets the featured photos injected into its photo strip at
  build/dev time.

To add a photo:

1. Drop the `.webp` in `assets/photography-images/` (and `public/assets/photography-images/`)
2. Add one entry to `src/data/photos.json`

### Dev tools (`dev/photos/`)

All photo logic lives in `dev/photos/photos-plugin.js` (a Vite plugin module
imported by `vite.config.js`). It reads/writes `photos.json`, injects the
homepage strip, and exposes the dev-only APIs. Dev-only, never deployed —
the API middleware only runs under `configureServer` and the HTML pages sit
outside `public/`, so nothing here ships.

With `npm run dev` running:

- `http://localhost:3000/dev/photos/photo-renamer.html` — rename photo files
  (or add unlisted ones). Renames files in BOTH `assets/photography-images/`
  and `public/assets/photography-images/` and updates every reference
  (`src/data/photos.json`, `index.html`, `photography/index.html`).
- `http://localhost:3000/dev/photos/photos-editor.html` — edit alt/year and
  tick which photos appear on the homepage (max 4).

Uses flex-column masonry built in JS (greedy height-balancing); no CSS
`column-count` — Safari's compositor glitches on fragmented multi-column
containers when the tilt/transform layers are present. Images use native
`loading="lazy"` + `decoding="async"`.

## Projects page (`projects/index.html`)

The project cards are hard-coded in `projects/index.html` (the same boxes as
the home page) so the copy is real HTML for SEO — not injected by JS. To add a
project, add another `project-feature` block to both `projects/index.html` and
`index.html`.

## Contact form

Submits to Formspree (`https://formspree.io/f/mnjbaeag`). No backend code in repo.

## Assets

- `public/` — served as static root by Vite
- `assets/photography-images/` — photography gallery images (not under `public/`; referenced from `index.html` via `/assets/...`)
- Photography images are WebP for performance

## Notable conventions

- Font Awesome (free) via `@fortawesome/fontawesome-free` npm dependency
- AOS (Animate On Scroll) library used throughout
- Cards use a shared surface treatment (`.card`, `.project-feature`, `.contact-plaque`, `.photo-card`) with hover lift in CSS
- Mobile menu uses clip-path animation pattern
- CSS custom properties handle all theming
- Component classes named following BEM-inspired convention (`.photo-card__frame`, `.btn--cta`, `.project-feature__title`, etc.)
