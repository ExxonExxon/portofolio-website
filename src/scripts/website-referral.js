const PLANS = ["standard", "webcare", "undecided"];
const STYLES = ["clean", "warm", "bold", "unsure"];

/** Vite fixes the browser destination at compile time; plain Node defaults public. */
export function websiteRequestBase(mode = "production") {
  if (typeof __TRADSIEE_REQUEST_URL__ !== "undefined") {
    return __TRADSIEE_REQUEST_URL__;
  }
  return mode === "preview"
    ? "http://127.0.0.1:8000/websites/request"
    : "https://tradsiee.com/websites/request";
}

/** Only non-sensitive, allowlisted preferences cross the referral boundary. */
export function buildWebsiteRequestUrl(
  { plan = "undecided", style = "unsure" } = {},
  mode = "production",
) {
  const url = new URL(websiteRequestBase(mode));
  url.searchParams.set("source", "portfolio");
  url.searchParams.set("plan", PLANS.includes(plan) ? plan : "undecided");
  url.searchParams.set("style", STYLES.includes(style) ? style : "unsure");
  return url.href;
}

/** Initial HTML and enhanced links must agree before the visitor clicks. */
export function rewriteWebsiteRequestLinks(html, mode = "production") {
  const allowed = [
    websiteRequestBase("production"),
    websiteRequestBase("preview"),
  ];
  return html.replace(/<a\b[^>]*>/gi, (anchor) =>
    anchor.replace(
      /(\shref\s*=\s*)(["'])([^"']*)\2/i,
      (attribute, prefix, quote, raw) => {
        let url;
        try {
          url = new URL(raw.replaceAll("&amp;", "&"));
        } catch {
          return attribute;
        }
        if (!allowed.includes(url.origin + url.pathname)) return attribute;
        const href = buildWebsiteRequestUrl(
          {
            plan: url.searchParams.get("plan") ?? undefined,
            style: url.searchParams.get("style") ?? undefined,
          },
          mode,
        );
        return `${prefix}${quote}${href.replaceAll("&", "&amp;")}${quote}`;
      },
    ),
  );
}
