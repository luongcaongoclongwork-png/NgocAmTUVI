import { toLocalVietnamesePhone, zaloChatUrl } from "@/lib/phone";

/**
 * "Gọi" and "Zalo" straight to the CUSTOMER (built from the phone they left,
 * never Ngọc Âm's own Zalo). Used on the lead list and the lead detail page.
 */
export default function LeadContactButtons({ phone, size = "md" }: { phone: string; size?: "sm" | "md" }) {
  const tel = toLocalVietnamesePhone(phone) ?? phone;
  const zalo = zaloChatUrl(phone);
  const cls =
    size === "sm"
      ? "inline-flex min-h-9 items-center border border-walnut/25 px-3 text-[12px] text-walnut hover:border-gold hover:text-gold"
      : "tracking-label inline-flex min-h-10 items-center border border-walnut/30 px-4 text-[12px] font-medium uppercase text-walnut hover:border-gold hover:text-gold";
  return (
    <span className="inline-flex flex-wrap gap-2">
      <a href={`tel:${tel}`} className={cls}>
        Gọi
      </a>
      {zalo && (
        <a href={zalo} target="_blank" rel="noopener noreferrer" className={cls}>
          Zalo
        </a>
      )}
    </span>
  );
}
