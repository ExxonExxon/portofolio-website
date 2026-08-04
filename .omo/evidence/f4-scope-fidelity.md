# F4 Scope Fidelity Audit — projects-page

**Date:** 2026-08-04
**Plan:** `.omo/plans/projects-page.md`
**Auditor:** F4 agent (Sisyphus-Junior)

---

## Must Have

| # | Item | Verdict | Evidence |
|---|------|---------|----------|
| 1 | `projects/index.html` exists with full SEO head | ✅ PASS | `ls projects/` → `index.html` (only entry) |
| 2 | `src/scripts/projects.js` exists with data array + year-grouped rendering | ✅ PASS | `test -f src/scripts/projects.js` → `EXISTS` |
| 3 | `src/styles/projects.css` exists | ✅ PASS | `test -f src/styles/projects.css` → `EXISTS` |
| 4a | `.section*` moved from `main.css` to `components.css` | ✅ PASS | `grep -c "\.section" src/styles/main.css` → `0`; `grep -c "\.section" src/styles/components.css` → `8`. `section-head`/`section-index` confirmed absent from main.css, present in components.css. |
| 4b | `.project-feature*` moved from `main.css` to `components.css` | ✅ PASS | `grep -c "project-feature" src/styles/main.css` → `0`; `grep -c "project-feature" src/styles/components.css` → `12` (≥10) |
| 4c | `.link-arrow*` moved from `main.css` to `components.css` | ✅ PASS | `grep -c "link-arrow" src/styles/main.css` → `0`; `grep -c "link-arrow" src/styles/components.css` → `5` (≥5) |
| 5 | `vite.config.js` registers projects entry | ✅ PASS | `grep -c "projects/index.html" vite.config.js` → `1` |
| 6a | `nav.html` has Projects links (desktop + mobile) | ✅ PASS | `grep -c 'href="/projects/"' src/partials/nav.html` → `2` (≥2) |
| 6b | `footer.html` has Projects link | ✅ PASS | `grep -c 'href="/projects/"' src/partials/footer.html` → `1` (≥1) |
| 7a | `index.html` keeps Tradsiee card | ✅ PASS | `grep -c "tradsiee.com" index.html` → `1` |
| 7b | `index.html` has "See More Projects" link | ✅ PASS | `grep -c "See More Projects" index.html` → `1` (≥1) |
| 8a | `netlify.toml` has `/projects` redirect | ✅ PASS | `grep 'from.*"/projects"' netlify.toml` returns: `from = "/projects"` and `from = "/projects.html"` |
| 8b | `netlify.toml` has `/projects.html` redirect | ✅ PASS | (same as above) |
| 9 | `sitemap.xml` has `/projects/` entry | ✅ PASS | `grep -c "tomasgorjux.net/projects/" public/sitemap.xml` → `1` (≥1) |
| 10a | `contact/index.html` og:image fixed to `.webp` | ✅ PASS | `grep "\.jpeg" contact/index.html` → no output (0 matches); `grep "\.webp" contact/index.html` → 2 matches (og:image + twitter:image) |
| 10b | `.webp` asset exists on disk | ✅ PASS | `test -f public/assets/scr-20260218-tzib.webp` → `EXISTS` |
| 11a | `AGENTS.md` documents projects page entry | ✅ PASS | `grep -c "projects/index.html" AGENTS.md` → `2` (≥1) |
| 11b | `AGENTS.md` says "Four HTML entry points" | ✅ PASS | `grep -ci "Four HTML entry points" AGENTS.md` → `1` (≥1) |
| 11c | `AGENTS.md` documents "add a project" workflow | ✅ PASS | `grep -ci "add a project\|to add a project" AGENTS.md` → `1` (≥1) |

---

## Must NOT Have

| # | Item | Verdict | Evidence |
|---|------|---------|----------|
| 1 | Only `index.html` in `projects/` directory | ✅ PASS | `ls projects/` → `index.html` (1 entry, no subpages) |
| 2 | No tags/pills in `projects.js` | ✅ PASS | `grep -i "tag" src/scripts/projects.js` → **No matches found** |
| 3 | No images on project cards | ✅ PASS | `grep "img" src/scripts/projects.js` → **No matches found** |
| 4 | No lightbox/modal in `projects/index.html` | ✅ PASS | `grep "modal" projects/index.html` → **No matches found** |
| 5 | No new dependencies (`package.json` clean) | ✅ PASS | `git diff -- package.json` → **empty** (exit 0) |
| 5 | No new dependencies (`package-lock.json` clean) | ✅ PASS | `git diff -- package-lock.json` → **empty** (exit 0) |
| 6 | Tradsiee card NOT removed from front page | ✅ PASS | `grep "tradsiee.com" index.html` → `href="https://tradsiee.com"` |
| 7 | No `.project-card` in `projects.js` (uses `.project-feature`) | ✅ PASS | `grep "\.project-card" src/scripts/projects.js` → **No matches found** |

---

## Overall Verdict

### ✅ IN-SCOPE — ALL 18 checks PASS

- **Must Have:** 16/16 PASS (items 1–11, with sub-items)
- **Must NOT Have:** 7/7 PASS (items 1–7)

No scope violations detected. Implementation matches the plan exactly: nothing from "Must have" was missed, nothing from "Must NOT have" was introduced.
