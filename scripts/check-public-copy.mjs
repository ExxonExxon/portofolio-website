// Fails the build if an internal note would reach a public page.
//
// Both surfaces matter here. src/partials/*.html is injected into the page
// templates, and the page templates (web-design/index.html and friends) carry
// their own hardcoded copies of the same text. On 17 November 2026 a price and a
// lawyer note were changed in the partials only, and the page templates kept
// publishing the old wording because nobody edited both. Checking both closes it.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MARKERS = [
  "do not publish",
  "lawyer confirmation",
  "lawyer review",
  "legal review remains",
  "awaiting australian lawyer",
  "awaits australian lawyer",
  "capacity to contract",
  "capacity to enter these agreements",
  "operational verification",
  "await verification",
  "remains outstanding",
  "has not been verified",
  "have not been verified",
  "not been verified",
  "require verification",
  "requires verification",
  "release gate",
  "remain held until",
  "remain open",
  "internal note",
];

const AGE = [/\bis 16\b/i, /\bat 16\b/i, /\baged 16\b/i];

const targets = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) continue;
    if (entry.endsWith(".html")) targets.push(full);
  }
}

walk("src/partials");
for (const page of ["index.html", "contact", "photography", "privacy", "projects", "web-design"]) {
  try {
    const full = page.endsWith(".html") ? page : join(page, "index.html");
    readFileSync(full);
    targets.push(full);
  } catch {
    // Page not present in this checkout; nothing to check.
  }
}

const findings = [];
for (const file of targets) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    const lower = line.toLowerCase();
    for (const marker of MARKERS) {
      if (lower.includes(marker)) findings.push(`${file}:${index + 1}: ${marker}`);
    }
    for (const pattern of AGE) {
      if (pattern.test(line)) findings.push(`${file}:${index + 1}: owner's age`);
    }
  });
}

if (targets.length === 0) {
  console.error("public copy check: no files matched, refusing to pass");
  process.exit(1);
}

if (findings.length > 0) {
  console.error("Build blocked: internal notes would go live.");
  findings.forEach((finding) => console.error(`  ${finding}`));
  console.error("Move the note into docs or a commit message, then rebuild.");
  process.exit(1);
}

console.log(`public copy check: clean (${targets.length} files)`);
