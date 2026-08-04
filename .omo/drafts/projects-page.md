---
slug: projects-page
status: drafting
intent: clear
review_required: false
pending-action: write .omo/plans/projects-page.md
approach: Extract projects to dedicated page (photography pattern), move reusable styles to components.css, add nav/footer links, minimal SEO fixes. No new dependencies. No individual project subpages.
---

# Draft: projects-page

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->

| ID | Outcome | Status | Evidence |
| --- | --- | --- | --- |
| C1 | New `projects/index.html` exists with full SEO head, partials, and data-container | active | photography/index.html pattern confirmed at photography/index.html:1-183 |
| C2 | New `src/scripts/projects.js` renders project cards from a data array (year-grouped) | active | photography.js:14-30 array pattern, photography.js:32-75 DOM generation |
| C3 | New `src/styles/projects.css` for page-specific project styles | active | photography.css exists at src/styles/photography.css |
| C4 | `vite.config.js` updated with new rollupOptions.input entry | active | vite.config.js:22-27 existing entries |
| C5 | `src/partials/nav.html` updated with "Projects" link (desktop + mobile) | active | nav.html:7-8 desktop links, nav.html:107-108 mobile links |
| C6 | `index.html` projects section replaced with compact preview + "View All Projects" link | active | Current inline projects at index.html:148-171, photography preview pattern at index.html:214-237 |
| C7 | Netlify redirects updated for /projects/ clean URL and .html → clean redirect | active | Existing Netlify at public/ or root _redirects |
| C8 | SEO improvements: sitemap.xml, robots.txt, per-page structured data update | active | Photography SEO pattern at photography/index.html:39-90 |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->

| # | Assumption | Default | Rationale | Reversible? |
| --- | --- | --- | --- | --- |
| A1 | Project data fields | { name, description, url, year } matching Tradsiee card structure | Minimal; user can add fields later. Year grouping mirrors photography pattern. | Yes — adding fields to the array is trivial |
| A2 | No tags/pills on projects page | Projects render as clean cards without tag pills | User removed pills from front page (this session). Apply consistently. | Yes — re-add CSS + HTML later |
| A3 | No individual project detail pages | Cards link to external URLs (href on card), no `/projects/tradsiee/` subpage | Keeps architecture simple. User's original card links to tradsiee.com. | Yes — can add later |
| A4 | Year grouping | Projects grouped by year, newest first | Photography uses this pattern; consistent UX | Yes — can switch to flat list |
| A5 | Front page keeps full Tradsiee card + "See More Projects" link | USER DECISION (2026-08-04): Tradsiee card stays on homepage; below it a link-arrow "See More Projects" → /projects/ | Explicit user request this session | No |
| A6 | No new external dependencies | Zero new npm packages, fonts, or libraries | The site already has AOS, Font Awesome. Projects page only needs vanilla JS DOM generation | N/A |

## Findings (cited - path:lines)

### Photography page pattern (to replicate)
- **photography/index.html**: Uses `card hero-card` for header, `<div id="gallery">` for dynamic content, photo modal for lightbox, `<!-- @partial nav -->` and `<!-- @partial footer -->` injected by Vite plugin. Script entry: `src/scripts/photography.js`. (photography/index.html:1-183)
- **photography.js**: Imports shared modules (nav.js, theme.js), has data-driven `photos[]` array, groups by year via `initGallery()` (DOM generation into `#gallery`), has `initLightbox()` for modal. AOS init is inline. (photography.js:14-30, 32-75, 79-134)
- **photography.css**: Page-specific styles — `gallery-section`, `gallery-year`, `gallery-masonry`, `gallery-item`, photo modal styles. (src/styles/photography.css)

### Vite multi-page setup
- **vite.config.js**: `rollupOptions.input` has named entries: `main`, `photography`, `contact`. Custom `html-partials` plugin injects nav and footer via regex replacement. (vite.config.js:22-27, 38-46)

### Nav partial
- **nav.html**: Desktop links at lines 6-8 (`/`, `/photography/`, `/contact/`). Mobile links at lines 106-108 (`/`, `/photography/`, `/contact/`). Active state handled by `initActiveNav()` in nav.js. Brand link is `index.html`. (nav.html:1-110)

### Current front page projects section
- **index.html:142-171**: Full project-feature card inline. Uses `.section`, `.section-head`, `.section-index`, `.section-label`, `.project-feature`, `.project-feature__top`, `.project-feature__title`, `.project-feature__desc`, `.project-feature__arrow`, `.project-feature__meta`, `.project-feature__link`.

### Shared CSS
- **components.css**: `.container` (max-width 90rem, auto margins), `.page-content` (padding-top 7rem, responsive side padding), `.card` (rounded, bordered, shadow, hover lift), `.section*` (section labels, headings), `.btn--cta`, `.link-arrow`, `.hero-heading`, `.hero-subtitle`, `.scroll-smooth`, `.skill-pill`, `.text-accent`. Nav classes (`.nav-bar`, `.nav-brand`, `.nav-links-desktop`, `.nav-link*`, `.theme-toggle`). Footer classes. (components.css:1-1165)
- **variables.css**: Full CSS custom properties for colors, shadows, transitions in light and dark mode. (variables.css:1-110)
- **main.css**: Front-page-specific overrides. `.hero`, `.hero-heading`, `.hero-subtitle`, `.hero-heading__accent`, `.project-feature*`, `.editorial-grid`, `.link-arrow`, `.section`, `.section-head`, `.section-index`. (main.css:1-251)

### Existing SEO state
- **index.html**: `description`, `og:title/description/image/type/url/locale`, `twitter:*`, `canonical`, 3x `application/ld+json` (Person, WebSite, BreadcrumbList). Missing: `hreflang`. (index.html:1-86)
- **photography/index.html**: Same pattern + CollectionPage + ImageGallery structured data + BreadcrumbList with 2 levels. (photography/index.html:39-90)
- **Existing SEO state**: sitemap.xml EXISTS at public/sitemap.xml (3 entries, domain tomasgorjux.net, lastmod 2026-07-06) and robots.txt EXISTS at public/robots.txt (correct, references sitemap) — plan appends to sitemap only. **CORRECTION (Metis): original draft wrongly claimed these files did not exist.**
- **netlify.toml**: redirects live in netlify.toml:40-63 (NOT a `_redirects` file) — photography/contact clean-URL pattern to copy for /projects/.

## Decisions (with rationale)

1. **Projects page follows photography architecture exactly**: directory-based (projects/index.html), own JS entry (projects.js), own CSS (projects.css). Same partials, same SEO head pattern, same AOS setup. Rationale: proven pattern, zero new concepts, maintainer can copy-paste the photography page to add another section later.

2. **Project data is a JS array in projects.js**: One-line additions per project. Year grouping, newest first. No CMS, no JSON fetch — just import and group. Rationale: photography.js already works this way; a 15-year-old adding a project edits one JS file.

3. **Front page preview is editorial, not card-based**: Text + link, like the photography preview. Rationale: keeps front page lean, directs traffic to the dedicated page, matches existing photography pattern for visual consistency.

4. **No new dependencies**: All rendering is vanilla DOM generation (like photography.js). Rationale: zero npm install, zero config churn, zero learning curve for the maintainer.

## Scope IN

- Create `projects/index.html` with full `<head>` (meta, OG, Twitter, LD+JSON, canonical)
- Create `src/scripts/projects.js` with project data array + year-grouped DOM rendering + AOS init
- Create `src/styles/projects.css` with page-specific styles
- Extract `.project-feature*`, `.section*`, `.link-arrow*` styles from `main.css` to `components.css` (shared)
- Add `projects` entry to vite.config.js rollupOptions.input
- Update nav partial + footer partial: add "Projects" link (desktop + mobile + footer Explore)
- Keep Tradsiee card on front page (index.html), add "See More Projects" link-arrow below it
- Update `public/sitemap.xml` with /projects/ entry
- Fix contact page OG image (.jpeg → .webp) — broken og:image
- Update `AGENTS.md` structure docs (4 entry points, how to add a project)

## Scope OUT (Must NOT have)

- Individual project detail pages (e.g., `/projects/tradsiee/`) — cards link externally
- Tag/pill filtering system — project cards are clean, no category tags
- Image thumbnails on project cards — text + link only (like current Tradsiee card without the pills)
- CMS or build-time data loading — all data is inline JS array
- New npm dependencies or libraries
- Server-side rendering or API routes
- Project editing interface or admin panel
- Photo gallery/lightbox on projects page (photography-only feature)
- Removing the Tradsiee card from the front page (user decision: it stays)
- Photography image resizing / FontAwesome removal (separate performance follow-up, out of scope)

## Open questions

_None._ All forks have defensible defaults matching the existing photography pattern and the user's demonstrated preferences (no tags, minimal cards). No owner-decisions remain — the approach is a direct analog of the photography page.

## Approval gate
status: awaiting-approval
