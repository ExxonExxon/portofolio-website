# F2 Code Quality Review — Projects Page Feature

**Date:** 2026-08-04
**Reviewer:** Sisyphus-Junior (Oracle role)
**Scope:** New/modified files for the `/projects/` page feature
**Overall Verdict:** **APPROVE** — no blockers, no majors. High quality, consistent with codebase patterns.

---

## Evidence

### Files Reviewed

| File | Status | Lines |
|------|--------|-------|
| `src/scripts/projects.js` | NEW | 109 |
| `src/styles/projects.css` | NEW | 22 |
| `projects/index.html` | NEW | 126 |
| `src/styles/components.css` | MODIFIED | 1321 (reviewed lines 282–434) |
| `src/styles/main.css` | MODIFIED | 80 |
| `src/partials/nav.html` | MODIFIED | 112 |
| `src/partials/footer.html` | MODIFIED | 108 |
| `index.html` | MODIFIED | 239 |
| `src/scripts/photography.js` | REFERENCE | 147 |
| `photography/index.html` | REFERENCE | 183 |

### Checks Performed

1. **Build:** `npm run build` — passes cleanly in 151ms ✓
2. **Syntax:** `projects.js` parsed via Node — no syntax errors ✓
3. **JSON-LD:** Both blocks in `projects/index.html` parse as valid JSON ✓
4. **CSS dedup:** Grep for `.project-feature`, `.projects-stack`, `.hero-heading`, `.hero-subtitle` across all CSS files ✓
5. **Font Awesome:** Grep for `fa-` in projects HTML and for `fontawesome` in all JS entries ✓

---

## Findings

### MINOR-01: Unused CSS class `projects` on container div

- **File:** `projects/index.html:119`
- **Detail:** `<div id="projects" class="projects"></div>` — the `class="projects"` has no corresponding CSS rule in any stylesheet. The JS targets the element via `id="projects"`, not class.
- **Mitigation:** This is consistent with the photography page (`photography/index.html:140` has `<div id="gallery" class="gallery"></div>` — `.gallery` also has no CSS). Purely cosmetic; no functional impact.
- **Recommendation:** Remove the unused `class="projects"` for cleanliness, or leave as-is for consistency with the photography page pattern. Not blocking.

### MINOR-02: `.projects-stack` intentionally duplicated across files

- **Files:** `components.css:647` (gap: 1rem) and `projects.css:18` (gap: 1.5rem)
- **Detail:** Both files define `.projects-stack` with different `gap` values. The home page uses the 1rem version for compact project cards; the projects page uses the 1.5rem version for full-width feature cards. Since `projects.css` is imported after `components.css` in `projects.js`, the cascade resolves correctly — this is an intentional override via CSS specificity order, not an accidental duplicate.
- **Recommendation:** Add a comment in `projects.css` noting the intentional override. Not blocking.

### MINOR-03: Pre-existing FA import inconsistency (not introduced here)

- **Files:** `photography.js:1-7` (missing FA import), `contact.js:1-7` (missing FA import)
- **Detail:** The footer partial uses Font Awesome icons (`fab fa-instagram`, `fab fa-github`) which require the FA CSS. `main.js` and `projects.js` correctly import `@fortawesome/fontawesome-free/css/all.css`. `photography.js` and `contact.js` do NOT import it, meaning footer social icons render as empty `<i>` elements on those pages. **This is a pre-existing bug, not introduced by the projects feature.** The projects.js FA import is correct and matches the main.js pattern.
- **Recommendation:** Fix `photography.js` and `contact.js` separately (add FA import). Not in scope for this review.

---

## Per-Category Detail

### 1. JavaScript (`projects.js`)

| Check | Result |
|-------|--------|
| Syntax validity | ✓ Clean — Node parse passes |
| Unused imports | ✓ Font Awesome import is needed for footer icons (matches main.js pattern) |
| `console.log`/debugging | ✓ None present |
| Null container guard | ✓ Line 22: `if (!container) return;` |
| Consistency with photography.js | ✓ Same import structure, init pattern, AOS config, nav/theme calls |
| `\n` description split | ✓ Uses `split("\n")` + `createTextNode` + `<br>` — correct for current data (`"line1\nline2"`) |
| XSS vectors | ✓ No `innerHTML`. All text via `textContent` or `createTextNode`. `card.href` set from data |
| Error handling | ✓ Early return on missing container. No try/catch needed (all operations are safe DOM creation) |

### 2. CSS

| Check | Result |
|-------|--------|
| No duplicate `project-feature` in main.css | ✓ Only in `components.css` (lines 310–400) |
| No orphaned rules in main.css | ✓ Hero/editorial blocks intact. No leftover `project-feature` or `section` rules |
| Dark mode support | ✓ All colors in `projects.css` use `var(--color-*)` |
| Naming conventions | ✓ BEM-inspired: `.projects-section`, `.projects-year`, `.projects-stack` |
| `.projects-stack` override | See MINOR-02 — intentional cascade override, not a bug |

### 3. HTML (`projects/index.html`)

| Check | Result |
|-------|--------|
| Tags closed | ✓ Valid HTML structure |
| Canonical URL | ✓ `https://tomasgorjux.net/projects/` — matches photography page pattern |
| JSON-LD validity | ✓ Both blocks (CollectionPage + BreadcrumbList) parse as valid JSON |
| No hardcoded project data | ✓ All data in `projects.js` array; HTML only has container `<div>` |
| Partial placeholders | ✓ `<!-- @partial nav -->` (line 103) and `<!-- @partial footer -->` (line 122) — each exactly once |
| Structure vs photography page | ✓ Same `<head>` pattern (meta, OG, JSON-LD, dark mode script, fonts, favicon). Same `<body>` pattern (page class, nav, container > hero-card > content div, footer, module script) |

### 4. Modified Shared Files

| File | Change | Status |
|------|--------|--------|
| `nav.html:7,108` | Added `/projects/` links (desktop + mobile) | ✓ Correct |
| `footer.html:22-24` | Added `/projects/` link in Explore section | ✓ Correct |
| `index.html:164-167` | Added "See More Projects" link-arrow | ✓ Correct, uses `.link-arrow` + `.mt-8` |
| `components.css:282-434` | Contains `.section`, `.project-feature`, `.link-arrow` blocks | ✓ Present, no conflicts with main.css |
| `main.css` | Hero/editorial blocks intact | ✓ No orphaned or duplicate `project-feature` rules |

### 5. Reference Pattern Consistency

| Aspect | photography.js/page | projects.js/page | Match? |
|--------|---------------------|-------------------|--------|
| CSS imports (variables, components, page-specific) | ✓ | ✓ | ✓ |
| AOS init config (once, offset 80, 600ms, mobile disable) | ✓ | ✓ | ✓ |
| Nav/theme init calls (initActiveNav, initMobileMenu, initThemeToggle) | ✓ | ✓ | ✓ |
| Hero card with compact heading + subtitle | ✓ | ✓ | ✓ |
| JS renders content from data array into container div | ✓ | ✓ | ✓ |
| Year-grouped sections, sorted newest-first | ✓ | ✓ | ✓ |
| Module script in `<body>` | ✓ | ✓ | ✓ |
| Both `<!-- @partial -->` placeholders | ✓ | ✓ | ✓ |
| Font Awesome import | ✗ (missing) | ✓ (present) | Diff — but projects.js is CORRECT here (matches main.js) |

---

## Verdict

**APPROVE.** Zero blockers or majors. Three minor observations documented above, none of which are functional regressions. The code is clean, consistent with the photography page reference pattern, and correctly extends the existing architecture.
