import { KEEP_BACKUPS, listBackups } from "@/lib/backup";
import { formatVietnamTime } from "@/lib/vn-time";

function size(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** "Sao lưu dữ liệu" section on the settings page (server component). */
export default async function BackupSection() {
  const backups = await listBackups();
  return (
    <section>
      <h2 className="tracking-label text-[12px] font-semibold uppercase text-walnut/60">Sao lưu dữ liệu</h2>
      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink/60">
        Toàn bộ khách liên hệ, bài viết, dịch vụ, tư vấn viên và cài đặt nằm trong một file dữ liệu. Website tự sao lưu mỗi ngày một lần (khi có người vào
        trang quản trị) và giữ {KEEP_BACKUPS} bản gần nhất. Nên thỉnh thoảng tải một bản về máy của bạn. Ảnh tải lên nằm riêng trong thư mục{" "}
        <code>public/uploads</code>, nhớ sao chép thư mục đó khi chuyển máy chủ.
      </p>
      {/* A plain link: the browser downloads the file the route returns. */}
      <a
        href="/admin/sao-luu/tai-ve"
        className="tracking-label mt-5 inline-flex h-11 items-center border border-walnut bg-walnut px-5 text-[12px] font-semibold uppercase text-ivory hover:bg-gold-deep"
      >
        Tạo và tải bản sao lưu mới
      </a>
      {backups.length === 0 ? (
        <p className="mt-5 text-[13px] text-ink/55">Chưa có bản sao lưu nào.</p>
      ) : (
        <ul className="mt-6 max-w-xl divide-y divide-walnut/10 border-y border-walnut/10 text-[14px]">
          {backups.map((b) => (
            <li key={b.name} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
              <span className="text-ink/80">
                {formatVietnamTime(b.createdAt)} <span className="text-ink/45">· {size(b.size)} · {b.manual ? "tạo tay" : "tự động"}</span>
              </span>
              <a href={`/admin/sao-luu/tai-ve?file=${encodeURIComponent(b.name)}`} className="text-walnut/80 hover:text-gold">
                Tải về
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
