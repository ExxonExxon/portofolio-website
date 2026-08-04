# projects-page - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A dedicated Projects page at yoursite.com/projects that lists every project you've built — automatically, newest first. Your homepage keeps the Tradsiee card exactly as it is now, plus a "See More Projects" link underneath it. "Projects" gets added to the menu and footer.

**Why this approach:** It copies the Photography page pattern you already have — a list of items in one file, and the page builds itself. Adding a project becomes a one-line edit, never touching the homepage again.

**What it will NOT do:** No individual pages per project (each card links to the project's own website). No tags, no images on the cards, no new software, no removing the Tradsiee card from the homepage.

**Effort:** Short
**Risk:** Low - pure addition + one CSS relocation; front page styling is preserved 1:1

**Decisions to sanity-check:** Tradsiee card stays featured on the homepage (your choice); projects grouped by year, newest first; project cards reuse the exact current design.

Your next move: start work. Full execution detail follows below.

---

> TL;DR (machine): Short - new /projects/ page (html+js+css), CSS relocation to shared file, nav/footer links, sitemap + og:image fixes, AGENTS.md docs. Low risk. Zero new deps.

## Scope
### Must have
- `projects/index.html` — new page, full SEO head, hero card, `#projects` container, partials, own JS entry
- `src/scripts/projects.js` — `projects[]` data array (`{ name, description, url, year }`) + year-grouped DOM rendering, newest first
- `src/styles/projects.css` — page-specific styles (year headings + card stack)
- CSS relocation: `.section*`, `.project-feature*`, `.link-arrow*` move from `src/styles/main.css` to `src/styles/components.css` (needed by both home and projects pages)
- `vite.config.js` — register `projects` rollup input entry
- `netlify.toml` — add `/projects` and `/projects.html` clean-URL redirects (matches existing pattern)
- `src/partials/nav.html` + `src/partials/footer.html` — add "Projects" link (desktop nav, mobile nav, footer Explore column)
- `index.html` — keep Tradsiee card untouched; add "See More Projects" link-arrow below it
- `public/sitemap.xml` — add `/projects/` entry matching existing format
- `contact/index.html` — fix og:image + twitter:image from `.jpeg` to `.webp`
- `AGENTS.md` — document 4th entry point + "how to add a project"

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Individual project detail pages (`/projects/tradsiee/`) — cards link externally
- Tag/pill filtering — no tags anywhere on project cards
- Images/thumbnails on project cards — text + link only
- Photo lightbox/modal on projects page (photography-only feature)
- Removing the Tradsiee card from the front page (explicit user decision: it stays)
- New npm dependencies, CMS, JSON fetch, server-side rendering, admin panel
- Photography image resizing / FontAwesome removal (separate performance follow-up)
- Any CSS value changes during relocation — identical rules, moved only

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none (project has no test framework per AGENTS.md) + agent-executed Playwright manual QA
- Evidence: .omo/evidence/task-N-projects-page.<ext>
- Primary commands: `npm run build` (exit 0, emits dist/projects/index.html), `npm run dev` + Playwright browser assertions

## Execution strategy
### Parallel execution waves
- Wave 1 (foundation): todo 1 — CSS relocation
- Wave 2 (page creation, parallel, blocked by 1): todos 2, 3, 4 — projects.css, projects.js, projects/index.html
- Wave 3 (wiring, parallel): todos 5, 6, 7, 8, 9 — vite entry, nav/footer, front page link, redirects, SEO
- Wave 4 (verification + docs): todos 10, 11

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. CSS relocation | — | 2, 3 | — |
| 2. projects.css | 1 | — | 3, 4 |
| 3. projects.js | 1 | 4 | 2, 4 |
| 4. projects/index.html | 1, 3 | 5 | 2, 3 |
| 5. vite entry | 4 | — | 6, 7, 8, 9 |
| 6. nav/footer links | — | — | 5, 7, 8, 9 |
| 7. front page link | — | — | 5, 6, 8, 9 |
| 8. netlify redirects | — | — | 5, 6, 7, 9 |
| 9. SEO fixes | — | — | 5, 6, 7, 8 |
| 10. Build + QA | 1-9 | — | 11 |
| 11. AGENTS.md | 4, 5, 6, 7, 8 | — | 10 |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [x] 1. Move shared styles from main.css to components.css (pure relocation)
  What to do / Must NOT do: Move these rules EXACTLY as-is (zero value changes) from `src/styles/main.css` to `src/styles/components.css`: `.section`, `.section-head`, `.section-index`, `.section-head .section-label`, `.project-feature`, `.project-feature:hover`, `.project-feature__top`, `.project-feature__title`, `.project-feature__desc`, `.project-feature__arrow`, `.project-feature:hover .project-feature__arrow`, `.project-feature__meta`, `.project-feature__tag`, `.project-feature__link`, `.project-feature:hover .project-feature__link`, `.dark .project-feature:hover .project-feature__link`, `.link-arrow`, `.link-arrow__icon`, `.link-arrow:hover`, `.dark .link-arrow:hover`, `.link-arrow:hover .link-arrow__icon`. Insert them in components.css as new "Project feature" and "Arrow link" sections (logical location: after the existing "Card surface" section ~line 276). DELETE the moved rules from main.css (no duplicates left). Must NOT change any selector, property, or value — byte-identical relocation. Must NOT move `.hero*` or `.editorial-*` rules (front-page only). Must NOT move `.section-label`, `.section-heading`, or `.section-divider` — these ALREADY exist in components.css (lines ~284, ~294, ~468); only `.section`, `.section-head`, `.section-index`, `.section-head .section-label` move from main.css.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 2, 3
  References (executor has NO interview context - be exhaustive): src/styles/main.css:48-181 (section + project-feature), src/styles/main.css:221-251 (link-arrow), src/styles/components.css (target location, read around line 276 "Card surface")
  Acceptance criteria (agent-executable): `grep -c "project-feature" src/styles/main.css` returns 0; `grep -c "project-feature" src/styles/components.css` returns >= 10; `grep -c "link-arrow" src/styles/components.css` returns >= 5; `npm run build` exits 0
  QA scenarios (name the exact tool + invocation): happy: `npm run dev` + Playwright navigate http://localhost:3000 — Tradsiee card on home renders with border-radius 1.5rem, 1px border, hover lift shadow; About + Photography section link-arrows still styled. failure: after relocation, `npm run build` exits non-zero → revert move, re-verify. Evidence .omo/evidence/task-1-projects-page.txt
  Commit: Y | refactor(styles): move shared project/section/link styles to components.css

- [x] 2. Create src/styles/projects.css (year headings + card stack)
  What to do / Must NOT do: Create `src/styles/projects.css` with: `.projects-section` (margin-bottom for spacing between year groups), `.projects-year` (small uppercase year heading with bottom border — mirror `.gallery-year` in src/styles/photography.css:13-21), `.projects-stack` (display:flex; flex-direction:column; gap:1.5rem). Do NOT redefine `.project-feature` (now shared via components.css). Must NOT import Font Awesome or add modal styles.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: —
  References: src/styles/photography.css:1-53 (gallery-section/gallery-year pattern), src/styles/components.css (shared classes available after todo 1)
  Acceptance criteria (agent-executable): file exists; `grep -c "projects-year\|projects-stack\|projects-section" src/styles/projects.css` returns >= 3; `npm run build` exits 0
  QA scenarios: happy: file imports cleanly when projects.js imports it (build passes). failure: `npm run build` fails if selector typo → fix selector, rebuild. Evidence .omo/evidence/task-2-projects-page.txt
  Commit: Y | feat(projects): add projects page styles

- [x] 3. Create src/scripts/projects.js (data array + year-grouped render)
  What to do / Must NOT do: Create `src/scripts/projects.js` mirroring src/scripts/photography.js:1-7,147 imports: `../styles/variables.css`, `../styles/components.css`, `../styles/projects.css`, `aos` + `aos/dist/aos.css`, `./nav.js` (initMobileMenu, initActiveNav), `./theme.js` (initThemeToggle), PLUS `@fortawesome/fontawesome-free/css/all.css` (required so the footer's social icons render — the footer partial uses `.fab` classes; main.js imports this, photography.js omits it which is a pre-existing footer bug on /photography/ that we do NOT replicate). Define `const projects = [ { name: "Tradsiee", description: "Video lead generation for Tradies\nEngineered for speed and efficiency over fancy features", url: "https://tradsiee.com", year: 2026 } ];` — exactly this schema (name, description, url, year), with the comment `/* To add a project: add one line to the array below */`. Write `initProjects()`: find `#projects` container (return if missing); group by year; sort years descending (`Number(b) - Number(a)`); for each year create `<section class="projects-section">` → `<h2 class="projects-year">{year}</h2>` → `<div class="projects-stack">` → for each project a `<a class="project-feature" href={url} target="_blank" rel="noopener noreferrer">` containing: `<div class="project-feature__top">` → `<div>` → `<h2 class="project-feature__title">{name}</h2>` → `<p class="project-feature__desc">` with description split on `\n` into text nodes + `<br>` → close div → `<span class="project-feature__arrow" aria-hidden="true">→</span>` → close top → `<div class="project-feature__meta">` → `<span class="project-feature__link">Visit {name}</span>` → close all. Init order at module level: `initProjects(); initActiveNav(); AOS.init({ once: true, offset: 80, duration: 600, easing: "ease-out-cubic", disable: "mobile" }); initMobileMenu(); initThemeToggle();`. Must NOT add lightbox, tags, images, or the orphaned `.project-card` variant (components.css has an unused `.projects-stack`/`.project-card` block at ~line 493 — the projects page uses `.project-feature`, NOT `.project-card`; do NOT touch the orphaned block). Must NOT import main.css.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 4
  References: src/scripts/photography.js:1-7 (imports), src/scripts/photography.js:14-75 (array + grouping + DOM pattern), src/scripts/photography.js:136-147 (init sequence), src/styles/main.css (current project-feature card HTML structure at index.html:148-171 as reference)
  Acceptance criteria (agent-executable): file exists; `grep -c "name\|description\|url\|year" src/scripts/projects.js` >= 4; `npm run build` exits 0
  QA scenarios: happy: Playwright goto /projects/ — exactly 1 `.project-feature` card, heading "2026", title "Tradsiee", desc contains both lines, "Visit Tradsiee" link href="https://tradsiee.com" with target=_blank. failure: array entry missing `year` → page renders card under "undefined" heading → fix array. Evidence .omo/evidence/task-3-projects-page.txt
  Commit: Y | feat(projects): add projects data and renderer

- [x] 4. Create projects/index.html (new page)
  What to do / Must NOT do: Create `projects/index.html` by copying `photography/index.html` structure. Head: `<title>Tomas Gorjux | Projects</title>`; description "Projects by Tomas Gorjux — Tradsiee and more, built from scratch."; canonical `https://tomasgorjux.net/projects/`; og:locale en_AU, og:site_name "Tomas Gorjux", author; og:title "Tomas Gorjux | Projects"; og:description same as meta description; og:type website; og:url `https://tomasgorjux.net/projects/`; og:image `https://tomasgorjux.net/assets/scr-20260218-tzib.webp`; twitter:card summary_large_image + same title/description/image; JSON-LD: ONE CollectionPage block (name "Projects by Tomas Gorjux", url, description, inLanguage en-AU, isPartOf @id home) — do NOT hardcode an item list (goes stale as projects grow); ONE BreadcrumbList (Home → Projects). Keep the inline theme script, Google Fonts preconnect/preload/print-swap, favicons (copy photography/index.html:92-119 verbatim). Body: `<!-- @partial nav -->`, `<main class="container page-content">` → hero card `<section class="card hero-card" data-aos="fade-up" data-aos-duration="1000">` with `<h1 class="hero-heading hero-heading--compact"><span class="text-accent">Projects.</span></h1>` + `<p class="hero-subtitle" style="max-width: 36rem">` intro copy (e.g. "Everything I've built, from scratch — design, product, and code.") → `<div id="projects" class="projects"></div>` → `<!-- @partial footer -->` → `<script type="module" src="/src/scripts/projects.js"></script>`. Must NOT add photo modal markup, gallery classes, or a CTA card.
  Parallelization: Wave 2 | Blocked by: 1, 3 | Blocks: 5
  References: photography/index.html:1-183 (full template to copy), index.html:1-116 (head conventions), photography/index.html:39-90 (JSON-LD patterns)
  Acceptance criteria (agent-executable): file exists; `grep -c "tomasgorjux.net/projects/" projects/index.html` >= 3 (canonical, og:url, JSON-LD); `grep -c "BreadcrumbList" projects/index.html` >= 1; `npm run build` exits 0
  QA scenarios: happy: build emits dist/projects/index.html; Playwright goto /projects/ — title "Tomas Gorjux | Projects", nav + footer injected, hero card visible. failure: missing partial comment → nav absent on page → re-add `<!-- @partial nav -->`. Evidence .omo/evidence/task-4-projects-page.txt
  Commit: Y | feat(projects): add projects page

- [x] 5. Register projects entry in vite.config.js
  What to do / Must NOT do: In `vite.config.js` rollupOptions.input (lines 22-27), add `projects: resolve(import.meta.dirname, "projects/index.html"),` after the `contact` line. Must NOT change any other entry or config value.
  Parallelization: Wave 3 | Blocked by: 4 | Blocks: —
  References: vite.config.js:22-27 (input map), vite.config.js:5-14 (partials pattern unchanged)
  Acceptance criteria (agent-executable): `grep -c "projects/index.html" vite.config.js` >= 1; `npm run build` exits 0 AND `ls dist/projects/index.html` exists
  QA scenarios: happy: build emits dist/projects/index.html and dist/photography/index.html still emits. failure: build errors "Could not resolve entry" → path typo → fix path, rebuild. Evidence .omo/evidence/task-5-projects-page.txt
  Commit: Y | chore(build): register projects page entry

- [x] 6. Add Projects link to nav.html and footer.html
  What to do / Must NOT do: In `src/partials/nav.html`: desktop `.nav-links-desktop` (line 5-35) insert `<a href="/projects/" class="nav-link">Projects</a>` between Home and Photography (order becomes Home, Projects, Photography, Contact). Mobile `.mobile-menu` (line 105-109) insert `<a href="/projects/" class="mobile-link">Projects</a>` in the same position (order Home, Projects, Photography, Contact; `mobile-link--accent` stays on Contact — Projects gets the plain `mobile-link` class, NO accent). In `src/partials/footer.html`: read the "Explore" column (`.footer-links`, ~line 13-41) and insert `<li><a href="/projects/" class="footer-link nav-link">Projects<span class="footer-link__arrow">→</span></a></li>` immediately after the Photography list item (~line 25), keeping Home, Projects, Photography, Contact, Tradsiee order. Must NOT touch theme toggle buttons, brand link, or other links. Must NOT change nav.js. NOTE: nav active-state is an EXACT string match in nav.js:6 (`link.getAttribute("href") === current`) — href MUST be `/projects/` with trailing slash so it matches `window.location.pathname` on the deployed site.
  Parallelization: Wave 3 | Blocked by: — | Blocks: —
  References: src/partials/nav.html:6-8 (desktop links), src/partials/nav.html:106-108 (mobile links), src/partials/footer.html (Explore column — read to match exact `<li>` pattern)
  Acceptance criteria (agent-executable): `grep -c 'href="/projects/"' src/partials/nav.html` >= 2; `grep -c 'href="/projects/"' src/partials/footer.html` >= 1; `npm run build` exits 0
  QA scenarios: happy: Playwright goto /projects/ — desktop nav shows Projects with `.nav-link--active`; mobile menu (390px) shows Projects. failure: nav active class applied to wrong link → verify initActiveNav pathname match (nav.js:9-15) — href must be exactly `/projects/`. Evidence .omo/evidence/task-6-projects-page.txt
  Commit: Y | feat(nav): add Projects link to nav and footer

- [x] 7. Keep Tradsiee card on front page, add See More Projects link
  What to do / Must NOT do: In `index.html` projects section (around lines 142-171): LEAVE the existing `<a class="project-feature">` Tradsiee card EXACTLY as-is (same href, text, classes, description). Immediately AFTER the card's closing `</a>`, add: `<a href="/projects/" class="link-arrow mt-8">See More Projects <span class="link-arrow__icon" aria-hidden="true">→</span></a>`. Must NOT remove, reorder, or restyle the Tradsiee card. Must NOT change other sections.
  Parallelization: Wave 3 | Blocked by: — | Blocks: —
  References: index.html:142-171 (current projects section), src/styles/components.css:.mt-8 (margin-top: 2rem utility ~line 1113), src/styles/components.css:.link-arrow (shared after todo 1)
  Acceptance criteria (agent-executable): `grep -c "See More Projects" index.html` >= 1; `grep -c "tradsiee.com" index.html` >= 2 (card + meta link); `npm run build` exits 0
  QA scenarios: happy: Playwright home page — Tradsiee card fully rendered (title, 2-line desc, arrow, Visit Tradsiee) AND "See More Projects" link below it; clicking it navigates to /projects/. failure: link-arrow unstyled (missing after todo 1) → verify components.css has .link-arrow. Evidence .omo/evidence/task-7-projects-page.txt
  Commit: Y | feat(home): feature Tradsiee with link to all projects

- [x] 8. Add /projects/ clean-URL redirects to netlify.toml
  What to do / Must NOT do: Open `netlify.toml` (NOT a `_redirects` file — there is no `_redirects` file; redirects live in netlify.toml ~lines 40-63). Find the existing redirect blocks for `/photography` and `/contact` and add two parallel `[[redirects]]` blocks matching the exact same format: `[[redirects]]\n  from = "/projects"\n  to = "/projects/"\n  status = 301` and `[[redirects]]\n  from = "/projects.html"\n  to = "/projects/"\n  status = 301`. Must NOT modify existing redirect rules. Must NOT create a `_redirects` file.
  Parallelization: Wave 3 | Blocked by: — | Blocks: —
  References: netlify.toml:40-63 (existing redirect pattern for photography/contact — copy format exactly)
  Acceptance criteria (agent-executable): `grep -c 'from = "/projects"' netlify.toml` >= 2; `grep -c 'from = "/projects.html"' netlify.toml` >= 1; `npm run build` exits 0
  QA scenarios: happy: redirect rules present and match existing format. failure: grep returns 0 → rules missing → re-add in exact TOML format. Evidence .omo/evidence/task-8-projects-page.txt
  Commit: Y | chore(config): add /projects/ clean-URL redirects

- [x] 9. Update sitemap.xml and fix contact og:image
  What to do / Must NOT do: In `public/sitemap.xml` (which EXISTS with 3 entries — do NOT recreate it, append only): read the existing `<url>` entry format (loc/lastmod/changefreq/priority) and append a matching `<url>` block: `<url><loc>https://tomasgorjux.net/projects/</loc><lastmod>2026-08-04</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>` (match file's exact indentation/structure). In `contact/index.html`: change og:image (line ~25) AND twitter:image (line ~36) URLs from `scr-20260218-tzib.jpeg` to `scr-20260218-tzib.webp` (verify the .webp exists at assets/ — the .jpeg does NOT). Must NOT regenerate the whole sitemap, must NOT touch other entries. Must NOT touch robots.txt (already correct).
  Parallelization: Wave 3 | Blocked by: — | Blocks: —
  References: public/sitemap.xml (format source — domain is tomasgorjux.net WITHOUT dot), contact/index.html:25,36 (og:image/twitter:image), index.html:28,42 (correct .webp URL reference)
  Acceptance criteria (agent-executable): `grep -c "tomasgorjux.net/projects/" public/sitemap.xml` >= 1; `grep -c "\.jpeg" contact/index.html` returns 0; `ls public/assets/scr-20260218-tzib.webp` exists
  QA scenarios: happy: grep assertions pass. failure: .webp file missing → use an existing og image from index.html instead and note it. Evidence .omo/evidence/task-9-projects-page.txt
  Commit: Y | chore(seo): add projects to sitemap, fix contact og image

- [x] 10. Full build + Playwright verification pass
  What to do / Must NOT do: Run `npm run build` (must exit 0). Then `npm run dev` and verify with Playwright at 1440x900 AND 390x844, light AND dark mode: (a) /projects/ — hero card, exactly the projects from the array, year heading, cards styled with border + radius, "Visit Tradsiee" external link target=_blank, nav "Projects" active; (b) / — Tradsiee card present, "See More Projects" link navigates to /projects/, nav shows 4 links; (c) /photography/ and /contact/ — unchanged, nav shows 4 links, no console errors anywhere; (d) 390px — no horizontal overflow, mobile menu contains Projects; (e) zero console errors across all pages. Must NOT fix code here — only report failures as findings (fixes happen in the failing todo).
  Parallelization: Wave 4 | Blocked by: 1-9 | Blocks: —
  References: all files from todos 1-9; AGENTS.md commands section (npm run build / dev)
  Acceptance criteria (agent-executable): `npm run build` exit 0; Playwright assertions (a)-(e) all pass; console error count 0
  QA scenarios: happy: every assertion green, screenshots saved to .omo/evidence/. failure: any red assertion → reopen the responsible todo (3, 4, 6, or 7), fix, rebuild, re-verify. Evidence .omo/evidence/task-10-projects-page/
  Commit: N

- [x] 11. Update AGENTS.md for the new page and the add-a-project workflow
  What to do / Must NOT do: Edit `AGENTS.md` with EXACT changes: (1) in "Multi-page structure" section change "Three HTML entry points" to "Four HTML entry points" (~line 22) and add `- projects/index.html → entry src/scripts/projects.js — served at /projects/` to the entry list (~after line 26); (2) in the CSS architecture list (~line 29) change `{main,photography,contact}.css` to `{main,photography,contact,projects}.css`; (3) after the "Photography page" section (~line 38-50) add a sibling "Projects page" section: projects are defined as a JS array in `src/scripts/projects.js` — each entry needs `name`, `description`, `url`, `year`; page renders year-grouped cards newest-first; to add a project, add one line to the `projects` array. Note: Tradsiee is featured on the home page; new projects appear only on /projects/. Must NOT rewrite unrelated AGENTS.md content.
  Parallelization: Wave 4 | Blocked by: 4, 5, 6, 7, 8 | Blocks: —
  References: AGENTS.md:22 (entry point count), AGENTS.md:26-29 (entry list + CSS list), AGENTS.md:38-50 (Photography page section to mirror)
  Acceptance criteria (agent-executable): `grep -c "projects/index.html" AGENTS.md` >= 1; `grep -c "Four HTML entry points" AGENTS.md` >= 1; `grep -ci "add a project\|to add a project" AGENTS.md` >= 1
  QA scenarios: happy: grep assertions pass and AGENTS.md renders sensibly. failure: grep returns 0 → section missing → redo edit. Evidence .omo/evidence/task-11-projects-page.txt
  Commit: Y | docs: document projects page in AGENTS.md

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit
- [x] F2. Code quality review
- [x] F3. Real manual QA
- [x] F4. Scope fidelity

## Commit strategy
- Todo 1: `refactor(styles): move shared project/section/link styles to components.css`
- Todos 2-4: `feat(projects): add projects page` (html, js, css — commit together or per-file as one logical unit)
- Todo 5: `chore(build): register projects page entry`
- Todo 6: `feat(nav): add Projects link to nav and footer`
- Todo 7: `feat(home): feature Tradsiee with link to all projects`
- Todo 8: `chore(config): add /projects/ clean-URL redirects`
- Todo 9: `chore(seo): add projects to sitemap, fix contact og image`
- Todo 10: no commit (verification)
- Todo 11: `docs: document projects page in AGENTS.md`
- Each commit is atomic per component; no mixed concerns. User's repo style: lowercase conventional commits (see git log).

## Success criteria
- `npm run build` exits 0; `dist/projects/index.html` is emitted
- `/projects/` renders every project from the array, grouped by year, newest first, cards identical in style to the current Tradsiee card
- Home page: Tradsiee card unchanged + working "See More Projects" link
- Nav (desktop + mobile) and footer show "Projects" with correct active state
- `/projects` and `/projects.html` redirect to `/projects/` (netlify.toml)
- Adding a project = adding one line to the `projects` array in `src/scripts/projects.js` — no other file touched
- Zero new dependencies; sitemap includes /projects/; contact og:image + twitter:image fixed to .webp
- AGENTS.md documents the new page and workflow
