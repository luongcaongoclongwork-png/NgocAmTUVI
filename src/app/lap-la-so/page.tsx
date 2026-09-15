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
    // form below it — sized/positioned the same way as the form's own
    // former wrapper: full width, no crop (bg-size 100% auto), height
    // clamped between the image's own proportions (980-1400px). If combined
    // content (banner + form) is taller than the image's natural height,
    // the excess is plain ivory — deliberate, see the "vẫn giữ trọn ảnh"
    // decision over cropping via `cover`.
    <div
      className="relative w-full min-h-[clamp(980px,72.9167vw,1400px)] bg-[#f4ebdd] bg-[length:100%_auto] bg-top bg-no-repeat"
      style={{ backgroundImage: "url(/images/lap-la-so/outer-bg.jpg)" }}
    >
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
