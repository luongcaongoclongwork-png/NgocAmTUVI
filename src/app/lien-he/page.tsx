import type { Metadata } from "next";
import LienHeClient from "@/components/contact/LienHeClient";
import { resolveTopicFromQuery, topicLabel } from "@/lib/contact-leads-constants";
import { getServiceById } from "@/lib/services";

export const metadata: Metadata = {
  title: "Gửi lời nhắn đến Ngọc Âm",
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
  const service = params.service ? await getServiceById(Number(params.service)) : null;

  return (
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
      zaloUrl={process.env.NEXT_PUBLIC_ZALO_CONTACT_URL || null}
      messengerUrl={process.env.NEXT_PUBLIC_MESSENGER_CONTACT_URL || null}
    />
  );
}
