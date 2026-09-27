import Link from "next/link";
import { SERVICE_GROUPS, getAllServicesForAdmin } from "@/lib/services";
import { getHiddenIds } from "@/lib/admin-entities";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import SortableList from "@/components/admin/SortableList";

export default async function AdminServicesPage() {
  const services = await getAllServicesForAdmin();
  const hidden = getHiddenIds("service");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl text-ink">Dịch vụ</h1>
        <Link
          href="/admin/dich-vu/moi"
          className="tracking-label h-10 border border-walnut/30 px-4 text-[13px] font-medium uppercase leading-10 text-walnut hover:border-gold hover:text-gold"
        >
          Thêm dịch vụ
        </Link>
      </div>
      <p className="mt-2 text-[13px] text-ink/55">
        Dùng ▲▼ (hoặc kéo ⋮⋮) để đổi thứ tự trong từng nhóm. “Ẩn” để tạm ngừng một gói mà không mất nội dung.
      </p>

      {SERVICE_GROUPS.map((group) => (
        <div key={group.value} className="mt-10">
          <h2 className="tracking-label text-[12px] font-semibold uppercase text-walnut/60">{group.label}</h2>
          <SortableList
            entity="service"
            emptyText="Chưa có dịch vụ nào."
            items={services
              .filter((s) => s.group === group.value)
              .map((service) => {
                // `duration` is an optional, newer service field.
                const duration = "duration" in service ? String(service.duration ?? "") : "";
                return {
                  id: service.id,
                  hidden: hidden.has(service.id),
                  content: (
                    <div className="min-w-0">
                      <p className="truncate font-heading text-[16px] text-ink">{service.title}</p>
                      <p className="text-[12px] text-ink/50">
                        {service.price}
                        {service.price !== "Liên hệ" && " đ"}
                        {duration && ` · ${duration}`}
                      </p>
                    </div>
                  ),
                  actions: (
                    <>
                      <Link href={`/admin/dich-vu/${service.id}`} className="text-walnut/70 hover:text-gold">
                        Sửa
                      </Link>
                      <DeleteServiceButton id={service.id} title={service.title} />
                    </>
                  ),
                };
              })}
          />
        </div>
      ))}
    </div>
  );
}
