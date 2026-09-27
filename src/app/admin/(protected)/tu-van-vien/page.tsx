import Link from "next/link";
import { getConsultantsForAdmin } from "@/lib/consultants";
import { getHiddenIds } from "@/lib/admin-entities";
import DeleteConsultantButton from "@/components/admin/DeleteConsultantButton";
import SortableList from "@/components/admin/SortableList";

export default async function AdminConsultantsPage() {
  const consultants = await getConsultantsForAdmin();
  const hidden = getHiddenIds("consultant");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl text-ink">Tư vấn viên</h1>
        <Link
          href="/admin/tu-van-vien/moi"
          className="tracking-label h-10 border border-walnut/30 px-4 text-[13px] font-medium uppercase leading-10 text-walnut hover:border-gold hover:text-gold"
        >
          Thêm tư vấn viên
        </Link>
      </div>
      <p className="mt-2 text-[13px] text-ink/55">Dùng ▲▼ (hoặc kéo ⋮⋮) để đổi thứ tự hiển thị trên website. “Ẩn” để tạm không hiển thị mà không xoá.</p>

      <div className="mt-6">
        <SortableList
          entity="consultant"
          emptyText="Chưa có tư vấn viên nào."
          items={consultants.map((consultant) => ({
            id: consultant.id,
            hidden: hidden.has(consultant.id),
            content: (
              <div className="flex min-w-0 items-center gap-4">
                {consultant.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- 48px admin thumbnail
                  <img src={consultant.photo} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover object-top" />
                ) : (
                  <span
                    title="Chưa có ảnh chân dung"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-walnut font-heading text-[14px] text-ivory"
                  >
                    {consultant.initials}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-heading text-[16px] text-ink">{consultant.name}</p>
                  <p className="text-[12px] text-ink/50">
                    {consultant.field}
                    {!consultant.photo && <span className="text-lacquer"> · chưa có ảnh chân dung</span>}
                  </p>
                </div>
              </div>
            ),
            actions: (
              <>
                <Link href={`/admin/tu-van-vien/${consultant.id}`} className="text-walnut/70 hover:text-gold">
                  Sửa
                </Link>
                <DeleteConsultantButton id={consultant.id} name={consultant.name} />
              </>
            ),
          }))}
        />
      </div>
    </div>
  );
}
