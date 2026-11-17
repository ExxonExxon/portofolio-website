import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const normalise = (text) => text.replace(/\s+/g, " ");

test("offer copy protects unpaid balances and removes unqualified defect warranties", () => {
  for (const path of [
    "src/partials/pricing.html",
    "src/partials/fine-print.html",
    "web-design/index.html",
  ]) {
    const text = normalise(read(path));
    assert.ok(text.includes("including any unpaid balance"), path);
    assert.ok(text.includes("separately accepted quote"), path);
    assert.ok(text.includes("no exit fee and no new charge"), path);
    assert.ok(text.includes("does not depend on buying migration help"), path);
    assert.equal(/accepted and paid|no time limit|no monthly fee ever/i.test(text), false, path);
  }
  const pricing = normalise(read("src/partials/pricing.html"));
  assert.ok(pricing.includes("Plus $15/month Standard hosting."));
  assert.ok(pricing.includes("No monthly fee to Tradsiee for this route"));
  // Was asserting the internal review note that leaked to production. The
  // pricing copy must state the offer, not our review status.
  assert.equal(/lawyer confirmation|capacity to contract|remains open/i.test(pricing), false);
});

test("privacy matches GA4 code rather than claiming no analytics", () => {
  const text = normalise(read("privacy/index.html"));
  const analytics = read("src/partials/analytics.html");
  assert.ok(analytics.includes('timezone.startsWith("Australia/")'));
  assert.ok(text.includes("Australian time zone"));
  assert.ok(text.includes("usage information and cookie identifiers"));
  assert.ok(text.includes("not a residency or consent check"));
  assert.ok(text.includes("three months after last contact"));
  assert.ok(text.includes("review, not automatic deletion"));
  assert.ok(text.includes("tax and business law requires"));
  assert.ok(text.includes("not an Australia-only setup"));
  assert.equal(/no analytics trackers|runs no analytics|around 30 days/i.test(text), false);
});

test("customer-hosted offer and age remain correct", () => {
  const pricing = normalise(read("src/partials/pricing.html"));
  for (const price of ["$199", "$499", "$15", "$79", "$100", "$449"]) {
    assert.ok(pricing.includes(price));
  }
  assert.ok(pricing.includes("45 minutes per billing month, no request cap"));
  assert.ok(pricing.includes("90 minutes"));
  assert.ok(pricing.includes("1 to 2 working days"));
  assert.ok(pricing.includes("3 to 5 working days"));
  assert.ok(read("index.html").includes("16-year-old"));
});
