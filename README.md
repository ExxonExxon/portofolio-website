<div align="center">

# Tomas Gorjux — Portfolio Website

**Personal portfolio & photography showcase** — built with Vite, vanilla CSS, and vanilla JavaScript.

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-ISC-blue)](#)

[Live Site](https://tomas.gorjux.net) · [Report Bug](https://github.com/ExxonExxon/portofolio-website/issues)

</div>

---

## Features

- **Multi-page layout** — home page with hero, projects, testimonials, and a photography strip; dedicated projects, photography, and contact pages
- **Photography lightbox** — click any gallery image for a fullscreen viewer with prev/next and keyboard support
- **Deep-linked gallery** — home-page photo cards link into the gallery with `#photo-*` anchors that scroll and highlight
- **Contact form** — sends to Formspree, no backend required
- **Animated scroll** — AOS (Animate On Scroll) throughout
- **Responsive** — fully mobile-optimized with a clip-path hamburger menu

## Tech Stack

| Tool                                     | Purpose                 |
| ---------------------------------------- | ----------------------- |
| [Vite](https://vite.dev)                 | Build tool & dev server |
| [AOS](https://michalsnik.github.io/aos/) | Scroll animations       |
| [Font Awesome](https://fontawesome.com)  | Icons                   |
| [Formspree](https://formspree.io)        | Contact form backend    |

## Getting Started

```sh
npm install
npm run dev        # http://localhost:3000
```

### Build

```sh
npm run build      # outputs to dist/
npm run preview    # preview production build
```

## Project Structure

```
├── index.html              # Home page entry
├── photography/index.html  # Photography gallery entry
├── contact/index.html      # Contact page entry
├── projects/index.html     # Projects page entry
├── src/
│   ├── partials/           # Nav & footer, injected at build time
│   ├── data/photos.json    # Single source of truth for the gallery
│   ├── scripts/
│   │   ├── initSite.js     # Shared bootstrap (nav, AOS, mobile menu)
│   │   ├── nav.js          # Active nav link + mobile menu logic
│   │   ├── photo-card.js   # Shared "mounted print" photo card
│   │   ├── photography.js  # Gallery render, lightbox, deep links
│   │   └── main/contact/projects.js  # Page entries
│   └── styles/
│       ├── variables.css   # Fonts + CSS custom properties
│       ├── components.css  # Shared components (nav, cards, buttons, forms, footer)
│       ├── photo-card.css  # Shared photo card styles
│       └── main/photography/contact/projects.css  # Page-specific styles
├── dev/photos/             # Dev-only photo tools (renamer, editor) + Vite plugin
├── public/                 # Static assets (served at /)
├── assets/                 # Photography source images (WebP)
├── dist/                   # Build output (gitignored)
└── vite.config.js          # Vite configuration
```

## Author

**Tomas Gorjux** — Web Developer & Photographer

- Website: [tomas.gorjux.net](https://tomas.gorjux.net)
- Email: [tomas.gorjux@gmail.com](mailto:tomas.gorjux@gmail.com)
- GitHub: [@ExxonExxon](https://github.com/ExxonExxon)
- Instagram: [@tomas.gorjux](https://www.instagram.com/tomas.gorjux/)

## License

ISC
