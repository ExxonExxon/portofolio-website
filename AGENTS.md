# AGENTS.md — portofolio-website

Personal portfolio site for Tomas Gorjux at `tomas.gorjux.net`.

> **Public copy rule.** The page templates (`web-design/index.html`, `privacy/index.html`,
> `index.html` and the rest) carry their own hardcoded copy of the offer, prices, payment steps,
> FAQs and JSON-LD. `src/partials/*.html` is injected into them, so the same sentence can exist in
> **two places**. On 17 November 2026 prices and a lawyer note were changed in the partials only and
> the templates kept publishing the old wording live. Edit both, or the live page keeps the old
> text. Never publish internal review state (lawyer holds, "not verified", readiness checks,
> TODOs, the owner's age); it belongs in docs, the vault or a commit message. The guard is
> `npm run check:copy`, which now runs automatically before `vite build`, so a leak fails the
> Netlify build instead of going live.
>
> **Vault path.** The routes below name `idelorean_vault/copilot`, which no longer exists. Current
> owners are `10 Business/Client Website Building/Offer & Pricing/` for the offer and prices, and
> `10 Business/Personal Website/project.md` for this site.

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
`src/styles/{main,photography,contact,projects,privacy,web-design}.css`.
`plan-picker.css` is shared by `/web-design/` (loaded before `web-design.css`).

Clean URLs are achieved via directory-based pages (e.g. `photography/index.html`).
Netlify redirects handle `.html` → clean URL redirects.

Shared CSS architecture (loaded in this order, pages only refine, never duplicate):

- `src/styles/variables.css` — CSS custom properties (colors, shadows, transitions)
- `src/styles/components.css` — all component classes (nav, cards, buttons, forms, footer, etc.)
- `src/styles/photo-card.css` — the shared "mounted print" photo card
- `src/styles/plan-picker.css` — plan-picker component used on `/web-design/`
- page CSS (`main`/`photography`/`contact`/`projects`/`privacy`/`web-design`) — loaded last, page-specific overrides

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

`10 Business/Client Website Building/Offer & Pricing/Offer Structure.md` in the Obsidian vault is
the pricing owner. `src/partials/pricing.html` is the single published implementation and is injected
into `/web-design/`. If the two disagree, fix the site; never rewrite the vault note from memory.

Current offer, after the 17 November 2026 pricing change (do not reintroduce older figures from
history or from other repositories):

- Two-page hosted build A$199, A$50 deposit, A$149 balance. Hosting A$15/month Standard or
  A$79/month total WebCare+; the monthly plan is required on this route.
- Four-page customer-hosted build A$499, A$50 deposit, A$449 balance. No monthly fee to Tradsiee;
  the customer arranges hosting and domain. No care plan on this route.
- Extra pages A$100 each. Prices are fixed and final in AUD, no GST.
- Delivery targets: 1 to 3 working days for the two-page build, 3 to 5 for the four-page build,
  each added page extending that.

Anything that quotes a free website, A$49 care, A$40 changes, a ten-day joining window or a
three-month care vesting period is pre-17-November material. It is superseded, not an alternative.

Published pricing lives in ONE place — `src/partials/pricing.html`, injected into
`/web-design/` — so the site cannot drift.

## Notable conventions

- Font Awesome (free) via `@fortawesome/fontawesome-free` npm dependency
- AOS (Animate On Scroll) library used throughout
- Cards use a shared surface treatment (`.card`, `.project-feature`, `.contact-plaque`, `.photo-card`) with hover lift in CSS
- Mobile menu uses clip-path animation pattern
- CSS custom properties handle all theming
- Component classes named following BEM-inspired convention (`.photo-card__frame`, `.btn--cta`, `.project-feature__title`, etc.)
