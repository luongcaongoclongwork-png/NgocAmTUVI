import Reveal from "./Reveal";
import NgocAmCard from "./ui/NgocAmCard";
import type { Service } from "@/lib/service-constants";

export default function ServiceCard({
  id,
  title,
  desc,
  price,
  group,
  delay = 0,
}: Service & { delay?: number }) {
  return (
    <Reveal delay={delay}>
      <NgocAmCard
        // `service` carries the exact package to /lien-he so the visitor
        // sees what they are asking about and the lead records it.
        href={`/lien-he?topic=${group}&service=${id}`}
        title={title}
        description={desc}
        meta={
          <span>
            Từ
            <b>
              {price}
              {price !== "Liên hệ" && " đ"}
            </b>
          </span>
        }
        ctaLabel="Đặt lịch"
      />
    </Reveal>
  );
}
