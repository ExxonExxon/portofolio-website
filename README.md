<div align="center">

# Tomas Gorjux — Portfolio Website

**Personal portfolio & photography showcase** — built with Vite, vanilla CSS, and vanilla JavaScript.

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-ISC-blue)](#)

[Live Site](https://tomas.gorjux.net) · [Report Bug](https://github.com/ExxonExxon/portofolio-website/issues)

</div>

---

## Features

- **Multi-page layout** — home page with hero, projects, testimonials, and a photography strip; dedicated projects, photography, contact, privacy, and web-design pages, plus a blog with three posts
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
| [Netlify Functions](https://www.netlify.com/products/functions/) | Outreach open-tracking endpoint |

## Project Knowledge & Task Tracking

This repo is **private** — the real project context lives outside it:

- **Obsidian is the source of truth.** The vault at
  `/Users/tomas/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/idelorean_vault/copilot`
  holds project context, decisions, content plans and pricing. Read
  `projects/Personal Website/project.md` (this repo's hub) and the relevant notes
  before planning or writing copy. When repo docs or published copy disagree with
  the vault, **the vault wins** — update the repo, never the other way round.
- **Pricing lives in the vault** under `projects/Client Website Building/`
  (`Offer Structure.md` is the master). Never publish legacy client names, terms
  or pricing.
- **Trello is the task command center.** Boards `Porotofolio Website` (this repo)
  and `Outreach` live in the workspace `My own shit`. Check them before planning
  work, move cards along `📥 Backlog → 🎯 To Do → 🚧 Doing → 👀 Needs Tomas → ✅ Done`,
  and log non-trivial work as a card so Tomas sees the outcome without reading logs.

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
├── web-design/index.html   # Website scope, pricing and Tradsiee referrals
├── blog/index.html         # Blog index
├── blog/why-i-built-tradsiee-at-15/index.html      # Blog post
├── blog/why-tradies-lose-money-on-blind-quotes/index.html  # Blog post
├── blog/first-client-website-lessons/index.html    # Blog post
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
│   │   └── main/contact/projects/privacy/web-design/blog.js  # Page entries
│   └── styles/
│       ├── variables.css   # Fonts + CSS custom properties
│       ├── components.css  # Shared components (nav, cards, buttons, forms, footer)
│       ├── photo-card.css  # Shared photo card styles
│       ├── plan-picker.css # Plan-picker component (/web-design/)
│       └── main/photography/contact/projects/privacy/web-design/blog.css  # Page-specific styles
├── dev/photos/             # Dev-only photo tools (renamer, editor) + Vite plugin
├── netlify/functions/      # Outreach open-tracking pixel/report (token-gated)
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

## Website requests (Mission 3B-2 local review)

Website-service enquiries belong to Tradsiee at `https://tradsiee.com/websites/request`. The portfolio is a referral surface; its unrelated Netlify contact form stays available. `src/scripts/website-referral.js` allows only plan/style identifiers and the fixed portfolio source. Pricing links work without JavaScript and carry the care-plan preference; design preferences are collected in the Tradsiee enquiry step. Unknown values fall back to undecided/unsure. No personal data enters referral URLs.

Every client website remains individually designed and developed with ChatGPT/Codex and Astro, in its own GitHub repository, hosted on Netlify. Intake never generates a website, creates a client repository, deploys, invoices or takes payment. This portfolio keeps Vite.

Check the central enquiry delivery configuration before any publication. New care sales also require operational readiness and legal/GST review. Local preview: `npm run dev -- --host 127.0.0.1`, then open `http://127.0.0.1:3000/web-design/`. Vite development rewrites every website-request CTA, including initial HTML fallbacks, to `http://127.0.0.1:8000/websites/request`; run the Tradsiee local review server alongside it. Production builds and `npm run preview` keep `https://tradsiee.com/websites/request`. The shared resolver fixes the destination during development/build, allows only plan/style preferences, and never reads the visitor’s hostname. The written-quote explanation is a separate `#website-quote` section.

Verification: `node --test tests/website-referral.test.js`; after `npm run build`, run `node --test tests/website-referral-build.test.js` to verify public links and reject any localhost intake origin in output; `node --check src/scripts/website-referral.js`; `node --check src/scripts/plan-picker.js`; `node --check src/scripts/contact.js`; `npm run build`. Prettier can check the explicit changed paths. There is no configured application type checker or general lint runner; syntax, formatting and contract tests do not establish full static typing.
