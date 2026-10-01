import type { Consultant } from "@/lib/consultant-constants";

/**
 * How each Xuyên giả is presented. Everything said about them comes from
 * /admin (name, field, bio, photo); this only adds what the page needs to
 * frame the portrait and to find their sessions.
 */
type SessionGroup = { id: "tu-vi" | "phong-thuy" | "dai-chu-su"; name: string };

export const PRESENTATION: Record<
  string,
  { focus: string; group?: "tu-vi" | "phong-thuy"; sessions?: SessionGroup[]; topic: string; address: string; home: string; world?: { href: string; label: string } }
> = {
  // focus = where the face sits in the uploaded photo, so a tall crop keeps it
  // sessions = every group this person leads (the Đại Chủ Sự page names Cô Minh Trang as its Xuyên giả);
  // home = this person's own chapter on the home page, where "back" should land
  "co-minh-trang": {
    focus: "50% 38%",
    group: "tu-vi",
    sessions: [
      { id: "tu-vi", name: "Tử Vi Xuyên Tam Diệm" },
      { id: "dai-chu-su", name: "Xuyên Vấn Đại Chủ Sự" },
    ],
    topic: "tu-vi",
    address: "cô",
    home: "/#xuyen-gia",
  },
  "thay-tinh": { focus: "50% 58%", group: "phong-thuy", sessions: [{ id: "phong-thuy", name: "Phong Thuỷ Là Tịnh" }], topic: "phong-thuy", address: "thầy", home: "/#xuyen-gia-thay-tinh" },
  khuong: { focus: "50% 30%", topic: "tra", address: "Khương", home: "/#tra-dao", world: { href: "/tra-dao", label: "Trà Đạo Ngọc Âm" } },
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
  /** Every group of sessions this person leads, in the order shown on their page. */
  sessions?: SessionGroup[];
  topic: string;
  address: string;
  /** This person's own chapter on the home page. */
  home: string;
  world?: { href: string; label: string };
};

export function toPortrait(c: Consultant): Portrait {
  const [about = "", ...view] = c.bio.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const p = PRESENTATION[c.slug] ?? { focus: "50% 30%", topic: "tu-vi", address: c.name, home: "/" };
  return { slug: c.slug, name: c.name, field: c.field, photo: c.photo, about, view, ...p };
}
