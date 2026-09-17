import Link from "next/link";
import { SERVICE_GROUPS, getAllServicesForAdmin } from "@/lib/services";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";

export default async function AdminServicesPage() {
  const services = await getAllServicesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Dịch vụ</h1>
        <Link
          href="/admin/dich-vu/moi"
          className="tracking-label h-10 border border-walnut/30 px-4 text-[13px] font-medium uppercase leading-10 text-walnut hover:border-gold hover:text-gold"
        >
          Thêm dịch vụ
        </Link>
      </div>

      {SERVICE_GROUPS.map((group) => {
        const items = services.filter((s) => s.group === group.value);
        return (
          <div key={group.value} className="mt-10">
            <h2 className="tracking-label text-[12px] font-semibold uppercase text-walnut/60">
              {group.label}
            </h2>
            {items.length === 0 ? (
              <p className="mt-4 text-sm text-ink/60">Chưa có dịch vụ nào.</p>
            ) : (
              <div className="mt-4 divide-y divide-walnut/10 border-y border-walnut/10">
                {items.map((service) => (
                  <div key={service.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-[16px] text-ink">{service.title}</p>
                      <p className="text-[12px] text-ink/50">
                        {service.price}
                        {service.price !== "Liên hệ" && "đ"} · thứ tự {service.sortOrder}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 text-[13px]">
                      <Link href={`/admin/dich-vu/${service.id}`} className="text-walnut/70 hover:text-gold">
                        Sửa
                      </Link>
                      <DeleteServiceButton id={service.id} title={service.title} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
