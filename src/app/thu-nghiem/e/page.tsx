import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { formatPrice, type Service } from "@/lib/service-constants";
import { getHomeData, LINEAGE, PATHS } from "../data";
import DraftBar from "../DraftBar";
import InkHome, { type Branch } from "./InkHome";
import "./e.css";

const display = Cormorant_Garamond({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--de-display" });

export const metadata: Metadata = { title: "Hướng E · Thuỷ Mặc Sống — Ngọc Âm v2", robots: { index: false } };

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

export default async function DraftE() {
  const { groups } = await getHomeData();
  const branches: Branch[] = PATHS.map((p) => ({
    id: p.id,
    name: p.name,
    line: p.line,
    href: p.href,
    from: fromPrice(groups.find((g) => g.id === p.id)?.items ?? []),
  }));

  return (
    <div className={display.variable}>
      <InkHome branches={branches} lineage={{ title: LINEAGE.title, quote: LINEAGE.quote }} />
      <DraftBar current="e" />
    </div>
  );
}
