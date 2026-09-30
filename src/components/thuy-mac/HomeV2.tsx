import type { Service } from "@/lib/service-constants";
import { formatPrice } from "@/lib/service-constants";
import { isSafeHttpUrl } from "@/lib/site-settings";
import { getHomeData, LINEAGE, PATHS } from "./data";
import { calendarLeaf, dailyLine, vietnamToday } from "./calendar";
import { ASKS, servicesFor } from "./asks";
import type { AskItem } from "./Ask";
import InkHome, { type Branch, type Person } from "./InkHome";
import "./thuy-mac.css";
import "./leaf.css";


/** The lowest numeric price in a group, as shown ("500.000 đ"); "" when none is numeric. */
function fromPrice(items: readonly Service[]): string {
  let best: Service | null = null;
  let bestN = Infinity;
  for (const s of items) {
    const n = Number(s.price.replace(/[^\d]/g, ""));
    if (n > 0 && n < bestN) {
      bestN = n;
      best = s;
    }
  }
  return best ? formatPrice(best.price.replace(/^Từ\s*/i, "")) : "";
}

/** First sentence of a bio, for the portrait caption. */
function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

/** Server side of the Thuỷ Mặc home: gathers everything from the database, today's leaf, and hands it to the client scene. */
export default async function HomeV2() {
  const { groups, trang, tinh, khuong, settings } = await getHomeData();
  const { y, m, d } = vietnamToday();

  const branches: Branch[] = PATHS.map((p) => ({
    id: p.id,
    name: p.name,
    line: p.line,
    href: p.href,
    from: fromPrice(groups.find((g) => g.id === p.id)?.items ?? []),
  }));

  const allServices = groups.flatMap((g) => [...g.items]);
  const who = {
    "co-minh-trang": trang && { name: trang.name, role: "Xuyên giả Tử Vi Xuyên Tam Diệm", photo: trang.photo },
    "thay-tinh": tinh && { name: tinh.name, role: tinh.field, photo: tinh.photo },
  };
  const askItems: AskItem[] = ASKS.map((a) => ({
    id: a.id,
    label: a.label,
    hint: a.hint,
    reply: a.reply,
    services: servicesFor(a.match, allServices),
    who: who[a.who] || null,
  })).filter((a) => a.services.length > 0);

  const people: Person[] = [];
  if (trang) people.push({ slug: trang.slug, name: trang.name, role: "Xuyên giả Tử Vi Xuyên Tam Diệm", photo: trang.photo, line: firstSentence(trang.bio), href: "/lien-he?topic=tu-vi", cta: "Đặt lịch Xuyên vấn cùng cô" });
  if (tinh) people.push({ slug: tinh.slug, name: tinh.name, role: tinh.field, photo: tinh.photo, line: firstSentence(tinh.bio), href: "/lien-he?topic=phong-thuy", cta: "Đặt lịch tư vấn cùng thầy" });

  return (
      <InkHome
        branches={branches}
        lineage={{ title: LINEAGE.title, quote: LINEAGE.quote, body: LINEAGE.body }}
        leaf={calendarLeaf(y, m, d)}
        dailyLine={dailyLine(y, m, d)}
        askItems={askItems}
        people={people}
        tea={khuong ? { name: khuong.name, photo: khuong.photo } : null}
        contact={{ phone: settings.phone, zaloUrl: isSafeHttpUrl(settings.zaloUrl) ? settings.zaloUrl : "" }}
      />
  );
}
