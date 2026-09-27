import { TRASH_DAYS, listTrash, purgeExpired } from "@/lib/admin-entities";
import { formatVietnamTime } from "@/lib/vn-time";
import TrashRowActions from "@/components/admin/TrashRowActions";

export default async function AdminTrashPage() {
  // Anything older than TRASH_DAYS is removed for good whenever this page is opened.
  const purged = await purgeExpired();
  const items = listTrash();

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Thùng rác</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/60">
        Những gì bạn bấm “Xoá” sẽ nằm ở đây {TRASH_DAYS} ngày trước khi bị xoá hẳn. Trong thời gian đó có thể khôi phục nguyên vẹn, kể cả ảnh.
      </p>
      {purged > 0 && (
        <p role="status" className="mt-3 text-[13px] text-ink/55">
          Đã tự dọn {purged} mục quá {TRASH_DAYS} ngày.
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">Thùng rác đang trống.</p>
      ) : (
        <ul className="mt-8 divide-y divide-walnut/10 border-y border-walnut/10">
          {items.map((t) => (
            <li key={`${t.key}-${t.id}`} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[12px] uppercase tracking-[0.08em] text-walnut/55">{t.label}</p>
                <p className="truncate font-heading text-[16px] text-ink">{t.name}</p>
                <p className="text-[12px] text-ink/50">
                  Xoá lúc {formatVietnamTime(t.deletedAt)} ·{" "}
                  <span className={t.daysLeft <= 3 ? "text-lacquer" : undefined}>còn {t.daysLeft} ngày trước khi xoá hẳn</span>
                </p>
              </div>
              <TrashRowActions entity={t.key} id={t.id} name={t.name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
