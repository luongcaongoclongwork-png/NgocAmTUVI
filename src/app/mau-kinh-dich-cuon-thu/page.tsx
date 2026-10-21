import type { Metadata } from "next";
import { InkClose, InkHero, InkPage } from "@/components/thuy-mac/kit";
import { nen } from "@/components/thuy-mac/Painting";
import CuonThu from "@/components/thuy-mac/kinh-dich/CuonThu";

/* TEMPORARY demo (2026-10-21): option 2 "Cuộn Thư" for /kinh-dich. Delete after the owner decides. */
export const metadata: Metadata = { title: "Demo Cuộn Thư — Kinh Dịch", robots: { index: false, follow: false } };

export default async function DemoCuonThu({ searchParams }: { searchParams: Promise<{ q?: string; k?: string; v?: string }> }) {
  const { q, k, v } = await searchParams;
  return (
    <InkPage>
      <InkHero
        {...nen("H11")}
        alt="Khúc sông vắng trong sương sớm"
        scrolls={["Kinh Dịch"]}
        lede={
          <>
            <p>Kinh Dịch Xuyên Tam Diệm</p>
            <small>Ngồi yên một lúc. Nghĩ về một việc bạn đang hỏi, chỉ một việc. Khi lòng đã lặng, hãy mở cuộn thư.</small>
            <p className="ctStart">
              <a href="#ct-bat-dau" className="ipBtn">Mở Cuộn Thư</a>
            </p>
          </>
        }
      />
      <div id="ct-bat-dau">
        <CuonThu initialCode={q} initialKham={Number(k)} three={v === "3d"} />
      </div>
      <InkClose />
    </InkPage>
  );
}
