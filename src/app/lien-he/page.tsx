import type { Metadata } from "next";
import LienHeClient from "@/components/contact/LienHeClient";
import { resolveTopicFromQuery, topicLabel } from "@/lib/contact-leads-constants";
import { getServiceById } from "@/lib/services";
import { getSiteSettings, isSafeHttpUrl, socialLinks, telHref } from "@/lib/site-settings";
import { InkHero, InkPage } from "@/components/thuy-mac/kit";

export const metadata: Metadata = {
  title: "Gửi đôi dòng đến Ngọc Âm",
  description:
    "Hãy để lại đôi dòng về điều bạn đang cân nhắc. Ngọc Âm sẽ đọc kỹ những chia sẻ ấy và chuẩn bị một góc nhìn phù hợp với hoàn cảnh của bạn.",
};

export default async function LienHePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; service?: string }>;
}) {
  const params = await searchParams;
  const topicId = resolveTopicFromQuery(params.topic);
  const [service, settings] = await Promise.all([
    params.service ? getServiceById(Number(params.service)) : null,
    getSiteSettings(),
  ]);

  return (
    <InkPage>
      <InkHero
        compact
        image="/images/29-homepage-thuy-mac-song-huong.webp"
        alt="Tranh thuỷ mặc sông Hương buổi sớm, con thuyền nhỏ giữa dòng"
        scrolls={["Gửi", "đôi dòng"]}
        lede={
          <>
            <p>Mỗi cuộc trao đổi đều bắt đầu từ sự lắng nghe.</p>
            <small>Hãy để lại đôi dòng về điều bạn đang cân nhắc. Ngọc Âm sẽ đọc kỹ những chia sẻ ấy và chuẩn bị một góc nhìn phù hợp với hoàn cảnh của bạn.</small>
          </>
        }
      />
      <LienHeClient
        initialTopicId={topicId}
        initialInterestText={topicId ? topicLabel(topicId) : ""}
        selectedService={
          service
            ? {
                title: service.title,
                price: service.price,
                // `duration` is a newer, optional service field; older rows
                // (and older schemas) simply have none.
                duration: "duration" in service ? String(service.duration ?? "") : "",
              }
            : null
        }
        zaloUrl={isSafeHttpUrl(settings.zaloUrl) ? settings.zaloUrl : null}
        messengerUrl={isSafeHttpUrl(settings.messengerUrl) ? settings.messengerUrl : null}
        contact={{
          phone: settings.phone,
          phoneHref: telHref(settings.phone),
          email: settings.email,
          // Zalo/Messenger already appear as chat links next to the form.
          socials: socialLinks(settings).filter((s) => s.label !== "Zalo"),
        }}
      />
    </InkPage>
  );
}
