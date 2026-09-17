import AdminProductCategoryForm from "@/components/admin/AdminProductCategoryForm";
import { createProductCategoryAction } from "@/app/admin/san-pham/actions";

export default function NewProductCategoryPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Thêm danh mục sản phẩm</h1>
      <div className="mt-8 max-w-xl">
        <AdminProductCategoryForm action={createProductCategoryAction} />
      </div>
    </div>
  );
}
