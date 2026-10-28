import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

test("production build contains public request links and no local intake origin", () => {
  const root = new URL("../dist/", import.meta.url);
  const paths = readdirSync(root, { recursive: true }).filter((filename) =>
    /\.(html|js|css|json)$/.test(filename),
  );
  assert.ok(paths.length > 0, "run npm run build before the build-output test");
  for (const filename of paths) {
    const content = readFileSync(new URL(filename, root), "utf8");
    assert.equal(
      /(?:localhost|127\.0\.0\.1):8000/.test(content),
      false,
      filename,
    );
  }
  const html = readFileSync(new URL("web-design/index.html", root), "utf8");
  assert.ok(
    html.includes("https://tradsiee.com/websites/request?source=portfolio"),
  );
});
