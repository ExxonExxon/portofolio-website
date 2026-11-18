import { getStore } from "@netlify/blobs";

// 1x1 transparent GIF.
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64",
);

// Bounds so this endpoint cannot be used as free storage. An identifier is a
// contact reference we generated: letters, digits, dash and underscore, short. A
// user agent is truncated rather than stored whole.
const MAX_ID_LENGTH = 64;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const MAX_UA_LENGTH = 200;

export function cleanId(raw) {
  const id = (raw || "").trim();
  if (!id || id.length > MAX_ID_LENGTH || !ID_PATTERN.test(id)) return null;
  return id;
}

export default async (req) => {
  const id = cleanId(new URL(req.url).searchParams.get("id"));
  if (id) {
    try {
      const store = getStore("outreach-opens");
      const key = `${id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      await store.setJSON(key, {
        at: new Date().toISOString(),
        ua: (req.headers.get("user-agent") || "").slice(0, MAX_UA_LENGTH),
      });
    } catch {
      // A logging failure must never break the pixel response.
    }
  }
  return new Response(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private, max-age=0",
      Pragma: "no-cache",
    },
  });
};

export const config = { path: "/track/open" };
