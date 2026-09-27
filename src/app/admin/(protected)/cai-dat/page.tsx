import { getSiteSettings } from "@/lib/site-settings";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import BackupSection from "@/components/admin/BackupSection";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Cài đặt chung</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/60">
        Thông tin liên hệ hiện ở chân trang, trang Liên hệ và dải “Đặt lịch” trên toàn website. Sửa ở đây là website đổi ngay, không cần lập trình viên.
      </p>
      <div className="mt-10">
        <SiteSettingsForm settings={settings} />
      </div>
      <div className="mt-16 border-t border-walnut/15 pt-10">
        <BackupSection />
      </div>
    </div>
  );
}
