import { notFound } from "next/navigation";
import AdminProductCategoryForm from "@/components/admin/AdminProductCategoryForm";
import { getProductCategoryByIdForAdmin } from "@/lib/products";
import { updateProductCategoryAction } from "@/app/admin/san-pham/actions";

export default async function EditProductCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getProductCategoryByIdForAdmin(Number(id));
  if (!category) notFound();

  const boundAction = updateProductCategoryAction.bind(null, category.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Sửa danh mục sản phẩm</h1>
      <div className="mt-8 max-w-xl">
        <AdminProductCategoryForm action={boundAction} category={category} />
      </div>
    </div>
  );
}
