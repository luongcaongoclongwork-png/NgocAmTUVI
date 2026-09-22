import Reveal from "./Reveal";
import NgocAmCard from "./ui/NgocAmCard";
import type { Service } from "@/lib/service-constants";

export default function ServiceCard({
  title,
  desc,
  price,
  delay = 0,
}: Service & { delay?: number }) {
  return (
    <Reveal delay={delay}>
      <NgocAmCard
        href={`/?goi=${encodeURIComponent(title)}#lien-he`}
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
