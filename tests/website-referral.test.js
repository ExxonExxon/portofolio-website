import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import configureVite from "../vite.config.js";
import {
  buildWebsiteRequestUrl,
  rewriteWebsiteRequestLinks,
  websiteRequestBase,
} from "../src/scripts/website-referral.js";

for (const [mode, origin] of [
  ["production", "https://tradsiee.com"],
  ["preview", "http://127.0.0.1:8000"],
]) {
  test(`${mode} referrals preserve only allowed plan and style preferences`, () => {
    for (const plan of ["standard", "webcare", "undecided"]) {
      for (const style of ["clean", "warm", "bold", "unsure"]) {
        const url = new URL(buildWebsiteRequestUrl({ plan, style }, mode));
        assert.equal(url.origin, origin);
        assert.equal(url.pathname, "/websites/request");
        assert.deepEqual(
          [...url.searchParams],
          [
            ["source", "portfolio"],
            ["plan", plan],
            ["style", style],
          ],
        );
      }
    }
  });
}

test("Node defaults to production and unknown modes cannot inject a host", () => {
  assert.equal(
    new URL(buildWebsiteRequestUrl()).origin,
    "https://tradsiee.com",
  );
  assert.equal(
    websiteRequestBase("https://untrusted.example?email=private@example.test"),
    "https://tradsiee.com/websites/request",
  );
});

test("unknown preferences, contact data and arbitrary base URLs are excluded", () => {
  const url = new URL(
    buildWebsiteRequestUrl(
      {
        plan: "webcare&email=private@example.test",
        style: "<script>",
        baseUrl: "https://untrusted.example",
        email: "private@example.test",
        name: "Private",
      },
      "preview",
    ),
  );
  assert.equal(url.origin, "http://127.0.0.1:8000");
  assert.equal(url.searchParams.get("plan"), "undecided");
  assert.equal(url.searchParams.get("style"), "unsure");
  assert.equal([...url.searchParams].length, 3);
  assert.equal(url.href.includes("private"), false);
});

test("HTML referral rewriting strips unapproved data and ignores unrelated links", () => {
  const html =
    '<a href="https://tradsiee.com/websites/request?plan=standard&amp;email=private@example.test">Start</a><a href="https://untrusted.example/websites/request">Other</a><a href="/contact/">Contact</a>';
  const result = rewriteWebsiteRequestLinks(html, "preview");
  assert.ok(
    result.includes(
      'href="http://127.0.0.1:8000/websites/request?source=portfolio&amp;plan=standard&amp;style=unsure"',
    ),
  );
  assert.equal(result.includes("private@example.test"), false);
  assert.ok(
    result.includes('href="https://untrusted.example/websites/request"'),
  );
  assert.ok(result.includes('href="/contact/"'));
});

test("Vite rewrites every initial dev HTML referral after injecting partials", () => {
  const config = configureVite({
    command: "serve",
    mode: "development",
    isPreview: false,
  });
  const plugin = config.plugins.find((entry) => entry.name === "html-partials");
  let count = 0;
  const referralPages = [];
  for (const [page, filename] of Object.entries(
    config.build.rollupOptions.input,
  )) {
    const html = plugin.transformIndexHtml(readFileSync(filename, "utf8"), {
      server: {},
    });
    let pageCount = 0;
    for (const match of html.matchAll(
      /<a\b[^>]*\shref="([^"]*\/websites\/request[^\"]*)"/gi,
    )) {
      const url = new URL(match[1].replaceAll("&amp;", "&"));
      assert.equal(url.origin, "http://127.0.0.1:8000");
      assert.equal([...url.searchParams].length, 3);
      count += 1;
      pageCount += 1;
    }
    if (pageCount > 0) referralPages.push(page);
  }
  assert.deepEqual(referralPages.sort(), ["contact", "projects", "webDesign"]);
  assert.ok(
    count >= 8,
    "remaining pages and injected pricing links must be covered",
  );
});

test("Vite selects the public destination for production and build preview", () => {
  for (const input of [
    { command: "build", mode: "production" },
    { command: "serve", mode: "production", isPreview: true },
  ]) {
    const config = configureVite(input);
    assert.equal(
      JSON.parse(config.define.__TRADSIEE_REQUEST_URL__),
      "https://tradsiee.com/websites/request",
    );
    const plugin = config.plugins.find(
      (entry) => entry.name === "html-partials",
    );
    const html = plugin.transformIndexHtml(
      readFileSync(config.build.rollupOptions.input.webDesign, "utf8"),
      {},
    );
    assert.equal(html.includes("127.0.0.1:8000"), false);
    assert.ok(html.includes("https://tradsiee.com/websites/request"));
  }
});
