import { getStore } from "@netlify/blobs";

// 1x1 transparent GIF.
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64",
);

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id") || "unknown";
  try {
    const store = getStore("outreach-opens");
    const key = `${id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    await store.setJSON(key, {
      at: new Date().toISOString(),
      ua: req.headers.get("user-agent") || "",
    });
  } catch {
    // A logging failure must never break the pixel response.
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
