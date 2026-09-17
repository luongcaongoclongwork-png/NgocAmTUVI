import Link from "next/link";
import { getConsultants } from "@/lib/consultants";
import DeleteConsultantButton from "@/components/admin/DeleteConsultantButton";

export default async function AdminConsultantsPage() {
  const consultants = await getConsultants();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Tư vấn viên</h1>
        <Link
          href="/admin/tu-van-vien/moi"
          className="tracking-label h-10 border border-walnut/30 px-4 text-[13px] font-medium uppercase leading-10 text-walnut hover:border-gold hover:text-gold"
        >
          Thêm tư vấn viên
        </Link>
      </div>

      {consultants.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">Chưa có tư vấn viên nào.</p>
      ) : (
        <div className="mt-8 divide-y divide-walnut/10 border-y border-walnut/10">
          {consultants.map((consultant) => (
            <div key={consultant.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-heading text-[16px] text-ink">{consultant.name}</p>
                <p className="text-[12px] text-ink/50">
                  {consultant.field} · thứ tự {consultant.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-[13px]">
                <Link href={`/admin/tu-van-vien/${consultant.id}`} className="text-walnut/70 hover:text-gold">
                  Sửa
                </Link>
                <DeleteConsultantButton id={consultant.id} name={consultant.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
