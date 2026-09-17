import AdminConsultantForm from "@/components/admin/AdminConsultantForm";
import { createConsultantAction } from "@/app/admin/tu-van-vien/actions";

export default function NewConsultantPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Thêm tư vấn viên</h1>
      <div className="mt-8 max-w-xl">
        <AdminConsultantForm action={createConsultantAction} />
      </div>
    </div>
  );
}
