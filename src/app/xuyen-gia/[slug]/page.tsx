import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConsultantBySlug } from "@/lib/consultants";
import { getServicesByGroup } from "@/lib/services";
import { InkClose, InkPage, InkSection, InkServices, InkSteps } from "@/components/thuy-mac/kit";
import JsonLd from "@/components/thuy-mac/JsonLd";
import { ScrollPortrait } from "@/components/thuy-mac/maison/Maison";
import type { Portrait } from "@/components/thuy-mac/maison/people";
import { toPortrait } from "@/components/thuy-mac/maison/people";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 600;

/** The booking action keeps one name across the site: "Đặt lịch …". */
function bookingLabel(p: Portrait): string {
  if (p.group === "tu-vi") return `Đặt lịch Xuyên vấn cùng ${p.address}`;
  if (p.group === "phong-thuy") return `Đặt lịch tư vấn cùng ${p.address}`;
  return "Hỏi về trà";
}

async function load(slug: string) {
  const c = await getConsultantBySlug(slug);
  return c ? toPortrait(c) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await load((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name}, ${p.field} — Ngọc Âm`,
    description: p.about,
    openGraph: p.photo ? { images: [{ url: p.photo, alt: `Chân dung ${p.name}` }] } : undefined,
  };
}

/** One Xuyên giả: who they are and how they see the work (as written in admin), then the sessions they hold, with prices. */
export default async function XuyenGiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await load((await params).slug);
  if (!p) notFound();
  const groups = p.sessions ?? [];
  const lists = await Promise.all(groups.map((g) => getServicesByGroup(g.id)));
  const hasSessions = lists.some((l) => l.length > 0);

  return (
    <InkPage>
      <JsonLd
        data={{
          "@type": "Person",
          name: p.name,
          jobTitle: p.field,
          description: p.about,
          ...(p.photo ? { image: absoluteUrl(p.photo) } : {}),
          worksFor: { "@type": "LocalBusiness", name: "Ngọc Âm", url: absoluteUrl("/") },
          url: absoluteUrl(`/xuyen-gia/${p.slug}`),
        }}
      />
      <article className="mPro">
        <div className="mPro-portrait">
          <ScrollPortrait p={p} sizes="(min-width: 900px) 40vw, 90vw" priority />
        </div>
        <div>
          <Link href={p.home} className="ipLink mPro-back">Về trang chủ</Link>
          <p className="mMaster-field">{p.field}</p>
          <h1>{p.name}</h1>
          <p className="mPro-about">{p.about}</p>
          {p.view.length > 0 && (
            <div className="mPro-view">
              {p.view.map((v) => (
                <p key={v}>{v}</p>
              ))}
            </div>
          )}
          <div className="mMaster-links">
            <Link href={`/lien-he?topic=${p.topic}`} className="mBtn">{bookingLabel(p)}</Link>
            {p.world && <Link href={p.world.href} className="ipLink">{p.world.label}</Link>}
          </div>
        </div>
      </article>

      {hasSessions && (
        <div id="cac-phien">
          {groups.map((g, i) =>
            lists[i].length > 0 ? (
              <InkSection
                key={g.id}
                title={groups.length > 1 ? g.name : `Các phiên cùng ${p.address}`}
                intro={i === 0 ? <p>Giá công khai. Mỗi phiên được chuẩn bị riêng theo câu hỏi và hoàn cảnh của bạn.</p> : undefined}
                tone={i % 2 ? "paper" : "raised"}
              >
                <InkServices items={lists[i]} />
              </InkSection>
            ) : null,
          )}
        </div>
      )}
      {hasSessions && (
        <InkSection id="mot-phien" title="Một phiên diễn ra thế nào">
          <InkSteps />
        </InkSection>
      )}
      <InkClose title="Mỗi cuộc trao đổi bắt đầu từ sự lắng nghe." text="Để lại đôi dòng về điều bạn đang cân nhắc. Ngọc Âm hồi đáp riêng trong một ngày làm việc." href={`/lien-he?topic=${p.topic}`} label={bookingLabel(p)} />
    </InkPage>
  );
}
