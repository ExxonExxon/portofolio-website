<div align="center">

# Tomas Gorjux — Portfolio Website

**Personal portfolio & photography showcase** — built with Vite, Tailwind CSS, and vanilla JavaScript.

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-ISC-blue)](#)

[Live Site](https://tomas.gorjux.net) · [Report Bug](https://github.com/ExxonExxon/portofolio-website/issues)

</div>

---

## Features

- **Multi-page layout** — home page with hero, skills, projects, and photography gallery; dedicated contact page
- **Dark mode** — system-aware with manual toggle, persisted in `localStorage`
- **Photography lightbox** — click any gallery image to open a fullscreen modal with details
- **Interactive UI clones** — Spotify, Facebook, and Wikipedia refined interfaces
- **Contact form** — sends to Formspree, no backend required
- **Animated scroll** — AOS (Animate On Scroll) throughout
- **Responsive** — fully mobile-optimized with hamburger menu

## Tech Stack

| Tool                                                                                     | Purpose                       |
| ---------------------------------------------------------------------------------------- | ----------------------------- |
| [Vite](https://vite.dev)                                                                 | Build tool & dev server       |
| [Tailwind CSS](https://tailwindcss.com)                                                  | Utility-first styling         |
| [PostCSS](https://postcss.org) + [Autoprefixer](https://github.com/postcss/autoprefixer) | CSS processing                |
| [AOS](https://michalsnik.github.io/aos/)                                                 | Scroll animations             |
| [Font Awesome](https://fontawesome.com)                                                  | Icons (main & Facebook pages) |
| [Lucide](https://lucide.dev)                                                             | Icons (Spotify page)          |
| [Formspree](https://formspree.io)                                                        | Contact form backend          |

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
├── contact.html            # Contact page entry
├── src/
│   ├── scripts/
│   │   ├── main.js         # Home page JS (AOS, nav, typewriter, modal)
│   │   ├── contact.js      # Contact page JS
│   │   ├── nav.js          # Shared mobile menu logic
│   │   ├── modal.js        # Photography lightbox
│   │   ├── typewriter.js   # Hero typewriter effect
│   │   ├── spotify.js      # Spotify clone entry
│   │   ├── facebook.js     # Facebook clone entry
│   │   └── wikipedia.js    # Wikipedia clone entry
│   └── styles/
│       ├── main.css        # Home page styles
│       ├── contact.css     # Contact page styles
│       ├── spotify.css     # Spotify clone styles
│       ├── facebook.css    # Facebook clone styles
│       └── wikipedia.css   # Wikipedia clone styles
├── public/                 # Static assets (served at /)
├── assets/                 # Photography images (WebP)
├── dist/                   # Build output (gitignored)
└── vite.config.js          # Vite configuration
```

## Sub-projects

The site includes three UI clone demonstrations served at:

- **Spotify Clone** — `https://tomas.gorjux.net/spotify-clone/`
- **Facebook Clone** — `https://tomas.gorjux.net/facebook-clone/`
- **Wikipedia Refined** — `https://tomas.gorjux.net/wikipedia-refined/`

Their source files live under `src/scripts/` and `src/styles/`. The HTML entry points are in `dist/` (not version-controlled) and are picked up by Vite's rollup code splitting.

## Author

**Tomas Gorjux** — Web Developer & Photographer

- Website: [tomas.gorjux.net](https://tomas.gorjux.net)
- Email: [tomas.gorjux@gmail.com](mailto:tomas.gorjux@gmail.com)
- GitHub: [@ExxonExxon](https://github.com/ExxonExxon)
- Instagram: [@tomas.gorjux](https://www.instagram.com/tomas.gorjux/)

## License

ISC
