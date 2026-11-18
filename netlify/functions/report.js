import { getStore } from "@netlify/blobs";

const TOKEN_SHA256 =
  "62eac1113978851c8ec1dd23a20d6ee8400f17f44b06d8621a19a48190a08b3d";

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bearerToken(req) {
  const header = req.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : "";
}

async function tokenMatches(token) {
  if (!token) return false;
  return (await sha256Hex(token)) === TOKEN_SHA256;
}

/**
 * Decide what a report request may do.
 *
 * Deleting outreach records needs a POST and a token in the Authorization
 * header. A token in the query string is readable, because that is how the
 * report is opened by hand, but it can never delete anything: a URL in browser
 * history, a log line or a pasted link would otherwise wipe the store.
 */
export async function authorise(req) {
  const url = new URL(req.url);
  const method = (req.method || "GET").toUpperCase();
  const purge = url.searchParams.get("purge") === "1";
  const fromHeader = bearerToken(req);

  if (purge) {
    if (method !== "POST") return "denied";
    return (await tokenMatches(fromHeader)) ? "purge" : "denied";
  }

  if (fromHeader && (await tokenMatches(fromHeader))) return "report";
  if (method === "GET" && (await tokenMatches(url.searchParams.get("token") || ""))) {
    return "report";
  }
  return "denied";
}

export default async (req) => {
  const action = await authorise(req);
  if (action === "denied") return new Response("Not found", { status: 404 });

  const store = getStore("outreach-opens");

  if (action === "purge") {
    const all = await store.list();
    await Promise.all(all.blobs.map((b) => store.delete(b.key)));
    return Response.json(
      { purged: all.blobs.length },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const { blobs } = await store.list();
  const opens = {};
  for (const { key } of blobs) {
    const id = key.split("/")[0];
    opens[id] = (opens[id] || 0) + 1;
  }
  return Response.json(
    { total: blobs.length, opens },
    { headers: { "cache-control": "no-store" } },
  );
};

export const config = { path: "/track/report" };
