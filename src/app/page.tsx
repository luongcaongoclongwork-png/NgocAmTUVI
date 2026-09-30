import type { Metadata } from "next";
import HomeV2 from "@/components/thuy-mac/HomeV2";

export const metadata: Metadata = {
  title: "Ngọc Âm — Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám",
  description:
    "Ngọc Âm: Tử Vi Xuyên Tam Diệm và Phong Thuỷ Là Tịnh của hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn. Xuyên vấn, định hướng, phát triển nội lực.",
};

// Today's calendar leaf changes daily (Vietnam time): re-render at most every 10 minutes.
export const revalidate = 600;

export default function Home() {
  return <HomeV2 />;
}
