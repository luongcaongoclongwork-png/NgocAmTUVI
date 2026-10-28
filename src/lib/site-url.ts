/**
 * The public address of the site, from SITE_URL (e.g. "https://ngocam.vn").
 * Used for absolute links in the sitemap, robots.txt, llms.txt, share
 * previews and structured data. Until the domain is set it falls back to
 * the local dev address, which is fine on a laptop and wrong in production:
 * set SITE_URL before going live.
 */
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
