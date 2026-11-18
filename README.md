<div align="center">

# Tomas Gorjux — Portfolio Website

**Personal portfolio & photography showcase** — built with Vite, vanilla CSS, and vanilla JavaScript.

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-ISC-blue)](#)

[Live Site](https://tomas.gorjux.net) · [Report Bug](https://github.com/ExxonExxon/portofolio-website/issues)

</div>

---

## Features

- **Multi-page layout**: home page with hero, projects, testimonials, and a photography strip; dedicated projects, photography, contact, privacy, and web-design pages
- **Photography lightbox** — click any gallery image for a fullscreen viewer with prev/next and keyboard support
- **Deep-linked gallery** — home-page photo cards link into the gallery with `#photo-*` anchors that scroll and highlight
- **Contact form** — sends via Netlify Forms, no backend required
- **Animated scroll** — AOS (Animate On Scroll) throughout
- **Responsive** — fully mobile-optimized with a clip-path hamburger menu

## Tech Stack

| Tool                                                             | Purpose                         |
| ---------------------------------------------------------------- | ------------------------------- |
| [Vite](https://vite.dev)                                         | Build tool & dev server         |
| [AOS](https://michalsnik.github.io/aos/)                         | Scroll animations               |
| [Font Awesome](https://fontawesome.com)                          | Icons                           |
| [Netlify Forms](https://www.netlify.com/products/forms/)         | Contact form backend            |

## Project Knowledge & Task Tracking

This repo is **private** — the real project context lives outside it:

- **Decisions and context:** start at vault
  `/Users/tomas/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/idelorean_vault/Home.md`,
  then `10 Business/Personal Website/project.md`. The vault is the only memory store.
- **Current offer:** `10 Business/Client Website Building/Offer & Pricing/Offer Structure.md`
  and `WebCare+ Pricing.md`; the [onboarding pack](</Users/tomas/Business/docs/onboarding/README.md>)
  owns operations. Existing accepted legacy terms remain protected.
- **Current repair worktrees:** `/tmp/ws-personal` and `/tmp/ws-tradsiee`. Preserve the
  separate older/dirty development checkouts. Code owns actual behaviour; dated live
  observations do not prove intake delivery, service capability or legal compliance.
- **Publication hold:** the local legality repairs are not deployed. Before revised terms
  or paid proposals are issued, an Australian lawyer must confirm capacity at 16, signed
  copyright, exact prescribed warranty wording and remaining legal/privacy terms. Two
  conflicts with original owner approvals remain in the Mission 6 decision record.
- **Checks:** `npm run build`, then `node --test tests/*.test.js`, and `git diff --check`.
  Check local pages with Playwright at 390px and 1440px. Do not submit live forms for QA.
  No deployment, message, commit or push follows from this documentation.

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
├── privacy/index.html      # Privacy policy entry
├── web-design/index.html   # Paid website routes + monthly hosting/care entry
├── src/
│   ├── partials/           # Nav, footer & pricing, injected at build time
│   ├── data/photos.json    # Single source of truth for the gallery
│   ├── scripts/
│   │   ├── initSite.js     # Shared bootstrap (nav, AOS, mobile menu)
│   │   ├── nav.js          # Active nav link + mobile menu logic
│   │   ├── photo-card.js   # Shared "mounted print" photo card
│   │   ├── plan-picker.js  # Pricing plan picker (/web-design/)
│   │   ├── faq.js          # FAQ accordion (/web-design/)
│   │   ├── photography.js  # Gallery render, lightbox, deep links
│   │   └── main/contact/projects/privacy/web-design.js  # Page entries
│   └── styles/
│       ├── variables.css   # Fonts + CSS custom properties
│       ├── components.css  # Shared components (nav, cards, buttons, forms, footer)
│       ├── photo-card.css  # Shared photo card styles
│       ├── plan-picker.css # Plan-picker component (/web-design/)
│       └── main/photography/contact/projects/privacy/web-design.css  # Page-specific styles
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
