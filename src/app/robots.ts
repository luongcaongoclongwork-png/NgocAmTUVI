import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

/** Everyone may read the public site, AI assistants included; admin and the print sheet stay out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/la-so/print"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
