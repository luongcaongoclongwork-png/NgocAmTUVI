import AdminServiceForm from "@/components/admin/AdminServiceForm";
import { createServiceAction } from "@/app/admin/dich-vu/actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Thêm dịch vụ</h1>
      <div className="mt-8 max-w-xl">
        <AdminServiceForm action={createServiceAction} />
      </div>
    </div>
  );
}
