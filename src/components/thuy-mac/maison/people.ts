import type { Consultant } from "@/lib/consultant-constants";

/**
 * How each Xuyên giả is presented. Everything said about them comes from
 * /admin (name, field, bio, photo); this only adds what the page needs to
 * frame the portrait and to find their sessions.
 */
export const PRESENTATION: Record<string, { focus: string; group?: "tu-vi" | "phong-thuy"; topic: string; address: string; world?: { href: string; label: string } }> = {
  // focus = where the face sits in the uploaded photo, so a tall crop keeps it
  "co-minh-trang": { focus: "50% 38%", group: "tu-vi", topic: "tu-vi", address: "cô" },
  "thay-tinh": { focus: "50% 58%", group: "phong-thuy", topic: "phong-thuy", address: "thầy" },
  khuong: { focus: "50% 30%", topic: "vat-pham", address: "Khương", world: { href: "/tra-dao", label: "Trà Đạo Ngọc Âm" } },
};

export type Portrait = {
  slug: string;
  name: string;
  field: string;
  photo: string;
  focus: string;
  /** First paragraph of the bio: who they are, where the knowledge comes from. */
  about: string;
  /** The remaining paragraphs: how they see the work, in the words written in admin. */
  view: string[];
  group?: "tu-vi" | "phong-thuy";
  topic: string;
  address: string;
  world?: { href: string; label: string };
};

export function toPortrait(c: Consultant): Portrait {
  const [about = "", ...view] = c.bio.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const p = PRESENTATION[c.slug] ?? { focus: "50% 30%", topic: "tu-vi", address: c.name };
  return { slug: c.slug, name: c.name, field: c.field, photo: c.photo, about, view, ...p };
}
