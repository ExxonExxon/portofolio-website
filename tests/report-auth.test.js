import assert from "node:assert/strict";
import test from "node:test";
import { authorise, decide } from "../netlify/functions/report.js";

const BASE = "https://tomas.gorjux.net/track/report";
const FAKE = "not-the-real-token";

function req(path, { method = "GET", headers = {} } = {}) {
  return new Request(BASE + path, { method, headers });
}

test("no token in any form is refused", async () => {
  assert.equal(await authorise(req("")), "denied");
  assert.equal(await authorise(req("?token=" + FAKE)), "denied");
  assert.equal(await authorise(req("?purge=1", { method: "POST" })), "denied");
});

test("a wrong bearer token is refused", async () => {
  assert.equal(
    await authorise(req("", { headers: { authorization: "Bearer " + FAKE } })),
    "denied",
  );
  assert.equal(
    await authorise(
      req("?purge=1", {
        method: "POST",
        headers: { authorization: "Bearer " + FAKE },
      }),
    ),
    "denied",
  );
});

test("a valid token reads, and only a POST can purge with it", () => {
  assert.equal(decide("GET", false, true), "report");
  assert.equal(decide("HEAD", false, true), "report");
  assert.equal(decide("POST", false, true), "report");
  assert.equal(decide("GET", true, true), "denied");
  assert.equal(decide("HEAD", true, true), "denied");
  assert.equal(decide("PUT", true, true), "denied");
  assert.equal(decide("DELETE", true, true), "denied");
  assert.equal(decide("POST", true, true), "purge");
});

test("purge needs both a POST and a valid token", () => {
  assert.equal(decide("POST", true, false), "denied");
  assert.equal(decide("GET", true, false), "denied");
  assert.equal(decide("GET", false, false), "denied");
});
