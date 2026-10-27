import type { Metadata } from "next";
import { InkPage, InkSection } from "@/components/thuy-mac/kit";
import BanDoTinhHoa from "@/components/thuy-mac/tinh-hoa/BanDoTinhHoa";

/* The Bản Đồ Tịnh Hoá itself: one household's map, read from this device only, so it is never indexed. */
export const metadata: Metadata = { title: "Bản Đồ Tịnh Hoá — Ngọc Âm", robots: { index: false, follow: false } };

export default function BanDoPage() {
  return (
    <InkPage>
      <div className="ip ipResult">
        <InkSection id="ban-do">
          <BanDoTinhHoa formPath="/phong-thuy/lap-ban-do-tinh-hoa" />
        </InkSection>
      </div>
    </InkPage>
  );
}
