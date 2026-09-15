import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import LapLaSoClient from "@/components/tuvi/LapLaSoClient";

export const metadata: Metadata = {
  title: "Lập Lá Số Tử Vi — Ngọc Âm",
  description:
    "Lập lá số Tử Vi theo hệ Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang) — an sao, Miếu Vượng Đắc Bình Hãm, Khôi Việt, Tứ Hóa, Tuần Triệt chuẩn Việt Nam.",
};

export default function LapLaSoPage() {
  return (
    // Single shared background (outer-bg.jpg) spanning the banner AND the
    // form below it — see .lap-la-so-outer in globals.css: desktop keeps
    // the full image uncropped (bg-size 100% auto, height clamped to its
    // own 1920x1400 aspect ratio — if combined content is taller than
    // that, the excess is plain ivory, deliberate, see the "vẫn giữ trọn
    // ảnh" decision over cropping via `cover`); under 768px it swaps to a
    // dedicated portrait image via `cover` instead.
    <div className="lap-la-so-outer relative w-full">
      <PageBanner
        eyebrow="Lập Lá Số"
        heading="Tử Vi Xuyên Tam Diệm"
        description="Khai vấn, định hướng, phát triển nội lực, chuyển hoá điều bất như ý"
        scrim
      />
      <LapLaSoClient />
    </div>
  );
}
