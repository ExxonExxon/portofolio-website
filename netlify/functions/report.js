import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const expected = process.env.TRACK_TOKEN || "";
  if (url.searchParams.get("debug") === "1") {
    return Response.json({
      hasTrackToken: Boolean(expected),
      tokenLen: expected.length,
      envKeys: Object.keys(process.env)
        .filter((k) => /TRACK|NETLIFY|BLOBS|SITE/i.test(k))
        .sort(),
    });
  }
  if (!expected || token !== expected) {
    return new Response("Not found", { status: 404 });
  }
  const store = getStore("outreach-opens");
  const { blobs } = await store.list();
  const opens = {};
  for (const { key } of blobs) {
    const id = key.split("/")[0];
    opens[id] = (opens[id] || 0) + 1;
  }
  return Response.json({ total: blobs.length, opens });
};

export const config = { path: "/track/report" };
