# AGENTS.md — portofolio-website

Personal portfolio site for Tomas Gorjux at `tomas.gorjux.net`.

## Obsidian is the source of truth

The Obsidian vault is the authoritative source for project context, decisions,
content plans and pricing. Always check it before planning or writing copy —
never guess.

Vault root:

`/Users/tomas/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/idelorean_vault/copilot`

Key directories:

- `projects/Personal Website/` — this repo's project hub (`project.md` + notes)
- `projects/Client Website Building/` — the offer, pricing and outreach project (`Offer Structure.md` is the master for pricing)
- `projects/Tradsiee/` — sibling venture

Rules:

- Read `projects/Personal Website/project.md` and the relevant notes before
  starting work on this repo.
- When repo docs, code or published copy disagree with the vault, **the vault
  wins** — update the repo, never the other way round.
- Pricing invariants are listed under [Pricing source of truth](#pricing-source-of-truth)
  below; never publish legacy client names, terms or pricing.
- If a file seems missing (iCloud), force a download before concluding it does
  not exist.

## Trello — task command center (use it constantly)

Trello is the human-facing kanban and the canonical answer to "what do I need
to do". Check it at the start of every session, before planning any work.

- Workspace: `My own shit`
  (`ari:cloud:trello::workspace/6a72b59d19e7bf93a8160f42`)
- `Porotofolio Website` — this repo
  (`ari:cloud:trello::board/workspace/6a72b59d19e7bf93a8160f42/6a72b5d4751c1418e84cdf7d`,
  https://trello.com/b/PVPBtLjr/porotofolio-website)
- `Outreach` — the Client Website Building outreach project
  (`ari:cloud:trello::board/workspace/6a72b59d19e7bf93a8160f42/6ab9c6a0422fe9079d51e9b7`,
  https://trello.com/b/325kyxFp/outreach)

Standard list flow on both boards:

`📥 Backlog → 🎯 To Do → 🚧 Doing → 👀 Needs Tomas → ✅ Done`

- `👀 Needs Tomas` is the only human-only lane (calls, decisions, sending
  emails). Everything else is agent-executable — never push agent-doable work
  into it.
- Log non-trivial work as a card or comment so Tomas sees the outcome without
  reading logs. One card = one deliverable.
- Keep Trello in sync with the actual state of the work; when a card is done,
  mark it done.
- Use the Trello MCP tools aggressively; if an operation is missing from the
  MCP, fall back to the Trello REST API rather than asking Tomas to do it by
  hand.
- Precedence: task state comes from Trello, project facts come from Obsidian.

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

Ten HTML entry points defined in `vite.config.js`:

- `index.html` → entry `src/scripts/main.js`
- `photography/index.html` → entry `src/scripts/photography.js` — served at `/photography/`
- `contact/index.html` → entry `src/scripts/contact.js` — served at `/contact/`
- `projects/index.html` → entry `src/scripts/projects.js` — served at `/projects/`
- `privacy/index.html` → entry `src/scripts/privacy.js` — served at `/privacy/` (text-only legal page, linked from the footer)
- `web-design/index.html` → entry `src/scripts/web-design.js` — served at `/web-design/` (the free-website offer and published pricing; `/web-design/pricing/` 301s here)
- `blog/index.html` → entry `src/scripts/blog.js` — served at `/blog/`
- `blog/why-i-built-tradsiee-at-15/index.html` → entry `src/scripts/blog.js`
- `blog/why-tradies-lose-money-on-blind-quotes/index.html` → entry `src/scripts/blog.js`
- `blog/first-client-website-lessons/index.html` → entry `src/scripts/blog.js`

All four blog pages share `src/scripts/blog.js`.

All entries call the shared `initSite.js` bootstrap (active nav link, AOS
setup, mobile menu); `nav.js` holds that menu logic. `initSite` skips AOS on
mobile by default — only `main.js` passes `disableAosOnMobile: false`.

Shared JS modules (imported, never duplicated across pages):

- `src/scripts/initSite.js` — page bootstrap (nav + AOS + mobile menu)
- `src/scripts/nav.js` — active-nav link + mobile menu logic
- `src/scripts/photo-card.js` — the shared "mounted print" photo card (gallery + homepage strip)
- `src/scripts/plan-picker.js` — plan picker on `/web-design/` (drives `src/partials/pricing.html`)
- `src/scripts/faq.js` — FAQ accordion on `/web-design/`

Each page has its own CSS in
`src/styles/{main,photography,contact,projects,privacy,web-design,blog}.css`.
`plan-picker.css` is shared by `/web-design/` (loaded before `web-design.css`).

Clean URLs are achieved via directory-based pages (e.g. `photography/index.html`).
Netlify redirects handle `.html` → clean URL redirects.

Shared CSS architecture (loaded in this order, pages only refine, never duplicate):

- `src/styles/variables.css` — CSS custom properties (colors, shadows, transitions)
- `src/styles/components.css` — all component classes (nav, cards, buttons, forms, footer, etc.)
- `src/styles/photo-card.css` — the shared "mounted print" photo card
- `src/styles/plan-picker.css` — plan-picker component used on `/web-design/`
- page CSS (`main`/`photography`/`contact`/`projects`/`privacy`/`web-design`/`blog`) — loaded last, page-specific overrides

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

## Blog (`blog/index.html`)

The blog index plus three launch posts (`why-i-built-tradsiee-at-15`,
`why-tradies-lose-money-on-blind-quotes`, `first-client-website-lessons`).
Posts are hard-coded HTML (SEO) and registered in `vite.config.js`
`rollupOptions.input`. All four pages share `src/scripts/blog.js` and
`src/styles/blog.css`.

## Contact form

Submits via Netlify Forms. The static markup in `contact/index.html` carries
`data-netlify="true"`, `name="contact"` and a hidden `form-name` field; Netlify
registers it at deploy time. `contact.js` posts it with `fetch` for an inline
success/error state, with a no-JS fallback to Netlify's default page. No backend
for the form. The only Netlify functions in the repo
(`netlify/functions/report.js`, `track.js`) are the token-gated outreach
open-tracking pixel/report.

## Assets

- `public/` — served as static root by Vite
- `assets/photography-images/` — photography gallery images (not under `public/`; referenced from `index.html` via `/assets/...`)
- Photography images are WebP for performance

## Pricing source of truth

The real offer and pricing live outside this repo, in the Obsidian vault:

`/Users/tomas/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/idelorean_vault/copilot/projects/Client Website Building`

That vault is the **source of truth for all pricing**. If published copy
disagrees with it, the vault wins — update the site, never the other way round.
`Offer Structure.md` is the master and overrides the other files on conflicts.

Invariants that must always match the vault:

- Website build, hosting and basic maintenance are **free with no lock-in**. Avoid
  absolute time promises ("forever", "no expiry") in client-facing copy — the site
  stays free while it's hosted with us.
- WebCare+ is **$49 AUD/mo**; Standard is **$0**.
- Standard small change is **$40 AUD flat** — never a range, never "from".
- WebCare+ includes **5 small changes a month**; extras are **$10 each**,
  no rollover. Joining after the 10-day window runs the first **3 months at 3
  small changes a month**, then 5.
- The bigger-work rate (WebCare+ **$99 base + $39/page**, restyle **50% off**) unlocks
  after **3 continuous months** — or from day one if the client joins within
  **10 days of go-live**. Until then, bigger work bills at Standard rates. Cancelling
  and rejoining restarts the 3-month clock. This is a WebCare+ vesting period only —
  the website itself has **no lock-in, ever**.
- Bigger work on Standard: **$200 base + $100/page**.
- Complete restyle is quoted separately; **50% off on WebCare+** (same 3-month/10-day rule).
- Prices are fixed. Never quote "from".
- Never publish legacy client names, terms or pricing (Adam Beaumont, Paul).

Published pricing lives in ONE place — `src/partials/pricing.html`, injected into
`/web-design/` — so the site cannot drift.

## Notable conventions

- Font Awesome (free) via `@fortawesome/fontawesome-free` npm dependency
- AOS (Animate On Scroll) library used throughout
- Cards use a shared surface treatment (`.card`, `.project-feature`, `.contact-plaque`, `.photo-card`) with hover lift in CSS
- Mobile menu uses clip-path animation pattern
- CSS custom properties handle all theming
- Component classes named following BEM-inspired convention (`.photo-card__frame`, `.btn--cta`, `.project-feature__title`, etc.)
