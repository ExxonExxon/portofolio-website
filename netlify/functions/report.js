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

export default async (req) => {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!token || (await sha256Hex(token)) !== TOKEN_SHA256) {
    return new Response("Not found", { status: 404 });
  }
  const store = getStore("outreach-opens");
  if (new URL(req.url).searchParams.get("purge") === "1") {
    const all = await store.list();
    await Promise.all(all.blobs.map((b) => store.delete(b.key)));
    return Response.json({ purged: all.blobs.length });
  }
  const { blobs } = await store.list();
  const opens = {};
  for (const { key } of blobs) {
    const id = key.split("/")[0];
    opens[id] = (opens[id] || 0) + 1;
  }
  return Response.json({ total: blobs.length, opens });
};

export const config = { path: "/track/report" };
