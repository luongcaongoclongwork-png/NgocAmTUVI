import type { Metadata } from "next";
import { InkClose, InkHero, InkPage, InkSection } from "@/components/thuy-mac/kit";
import LapBanDo from "@/components/thuy-mac/tinh-hoa/LapBanDo";

/* Lập Bản Đồ Tịnh Hoá: Thầy Tịnh draws a card for each of the eight directions of a home (owner-approved 2026-10-27). */
export const metadata: Metadata = {
  title: "Lập Bản Đồ Tịnh Hoá Phong Thuỷ — Ngọc Âm",
  description: "Bản Đồ Tịnh Hoá của Phong Thuỷ Là Tịnh: tám hướng của một ngôi nhà, mỗi hướng một lá bài, cho thấy từng chỗ trong nhà đang cần gì để được tịnh.",
  alternates: { canonical: "/phong-thuy/lap-ban-do-tinh-hoa" },
};

export default function LapBanDoPage() {
  return (
    <InkPage>
      <InkHero
        compact
        scrolls={["Bản Đồ", "Tịnh Hoá"]}
        lede={
          <>
            <p>Phong Thuỷ Là Tịnh</p>
            <small>Tám hướng của một ngôi nhà, mỗi hướng một lá bài. Tấm bản đồ cho thấy từng chỗ trong nhà đang cần gì để được tịnh.</small>
          </>
        }
      />
      <InkSection id="lap-ban-do">
        <LapBanDo mapPath="/phong-thuy/ban-do-tinh-hoa" />
      </InkSection>
      <InkClose />
    </InkPage>
  );
}
