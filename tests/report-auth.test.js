import assert from "node:assert/strict";
import test from "node:test";
import { authorise } from "../netlify/functions/report.js";

const BASE = "https://tomas.gorjux.net/track/report";
const FAKE = "not-the-real-token";

function req(path, { method = "GET", headers = {} } = {}) {
  return new Request(BASE + path, { method, headers });
}

test("a bad token is refused", async () => {
  assert.equal(await authorise(req("?token=" + FAKE)), "denied");
  assert.equal(
    await authorise(req("", { headers: { authorization: "Bearer " + FAKE } })),
    "denied",
  );
});

test("a missing token is refused", async () => {
  assert.equal(await authorise(req("")), "denied");
  assert.equal(await authorise(req("?purge=1", { method: "POST" })), "denied");
});

test("purge is never reachable through a GET, even with a token", async () => {
  assert.equal(await authorise(req("?token=" + FAKE + "&purge=1")), "denied");
  assert.equal(await authorise(req("?purge=1")), "denied");
});

test("purge refuses a token that only exists in the query string", async () => {
  assert.equal(
    await authorise(req("?token=" + FAKE + "&purge=1", { method: "POST" })),
    "denied",
  );
});

test("purge refuses a bearer header sent on a non-POST method", async () => {
  for (const method of ["GET", "PUT", "DELETE", "HEAD"]) {
    assert.equal(
      await authorise(
        req("?purge=1", {
          method,
          headers: { authorization: "Bearer " + FAKE },
        }),
      ),
      "denied",
    );
  }
});
