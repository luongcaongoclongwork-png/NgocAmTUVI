import { notFound } from "next/navigation";
import AdminConsultantForm from "@/components/admin/AdminConsultantForm";
import { getConsultantByIdForAdmin } from "@/lib/consultants";
import { updateConsultantAction } from "@/app/admin/tu-van-vien/actions";

export default async function EditConsultantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consultant = await getConsultantByIdForAdmin(Number(id));
  if (!consultant) notFound();

  const boundAction = updateConsultantAction.bind(null, consultant.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Sửa tư vấn viên</h1>
      <div className="mt-8 max-w-xl">
        <AdminConsultantForm action={boundAction} consultant={consultant} />
      </div>
    </div>
  );
}
