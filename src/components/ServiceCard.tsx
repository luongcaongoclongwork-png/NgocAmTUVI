import Reveal from "./Reveal";
import NgocAmCard from "./ui/NgocAmCard";
import { formatPrice, type Service } from "@/lib/service-constants";

export default function ServiceCard({
  id,
  title,
  desc,
  price,
  duration,
  note,
  group,
  delay = 0,
}: Service & { delay?: number }) {
  return (
    <Reveal delay={delay}>
      <NgocAmCard
        // `service` carries the exact package to /lien-he so the visitor
        // sees what they are asking about and the lead records it.
        href={`/lien-he?topic=${group}&service=${id}`}
        eyebrow={note || undefined}
        title={title}
        description={desc}
        meta={
          <span>
            <b>{formatPrice(price)}</b>
            {duration && <span className="ml-2 text-ink/50">· {duration}</span>}
          </span>
        }
        ctaLabel="Đặt lịch"
      />
    </Reveal>
  );
}
