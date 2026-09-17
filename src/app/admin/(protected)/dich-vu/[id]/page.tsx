import { notFound } from "next/navigation";
import AdminServiceForm from "@/components/admin/AdminServiceForm";
import { getServiceByIdForAdmin } from "@/lib/services";
import { updateServiceAction } from "@/app/admin/dich-vu/actions";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceByIdForAdmin(Number(id));
  if (!service) notFound();

  const boundAction = updateServiceAction.bind(null, service.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Sửa dịch vụ</h1>
      <div className="mt-8 max-w-xl">
        <AdminServiceForm action={boundAction} service={service} />
      </div>
    </div>
  );
}
