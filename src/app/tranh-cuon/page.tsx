import type { Metadata } from "next";
import HomeV2 from "@/components/thuy-mac/HomeV2";

export const metadata: Metadata = {
  title: "Tranh cuộn Ngọc Âm — đi qua một bức thuỷ mặc",
  description:
    "Sáu cảnh thuỷ mặc của Ngọc Âm: giọt mực loang, xuyên mây và nét Cửu Đỉnh, ngã ba sông, tờ lịch Khâm Thiên Giám, thư phòng Xuyên giả và giọt mực thành lời mời.",
};

// The calendar leaf in scene 4 changes daily (Vietnam time).
export const revalidate = 600;

export default function TranhCuon() {
  return <HomeV2 />;
}
