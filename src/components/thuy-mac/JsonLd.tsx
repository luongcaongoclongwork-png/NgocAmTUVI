/** schema.org data for search engines and AI assistants; facts only, from the site's own data. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  // "<" is escaped so text from admin can never close the script tag.
  const json = JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** "2.000.000" / "Từ 1.500.000" → 2000000; "Liên hệ" → null. */
export function priceNumber(price: string): number | null {
  const n = Number(price.replace(/[^\d]/g, ""));
  return n > 0 ? n : null;
}
