import assert from "node:assert/strict";
import test from "node:test";
import { cleanId } from "../netlify/functions/track.js";

test("a generated contact reference is accepted", () => {
  assert.equal(cleanId("abc123"), "abc123");
  assert.equal(cleanId("OUT-2026_11"), "OUT-2026_11");
});

test("junk identifiers are refused", () => {
  for (const bad of ["", "   ", null, undefined, "a".repeat(65), "../etc", "<script>", "a b"]) {
    assert.equal(cleanId(bad), null, String(bad));
  }
});

test("a missing identifier does not store anything", () => {
  assert.equal(cleanId(null), null);
});
