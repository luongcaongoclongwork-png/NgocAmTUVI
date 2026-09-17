import AdminProductForm from "@/components/admin/AdminProductForm";
import { getProductCategories } from "@/lib/products";
import { createProductAction } from "@/app/admin/san-pham/actions";

export default async function NewProductPage() {
  const categories = await getProductCategories();

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Thêm sản phẩm</h1>
      <div className="mt-8 max-w-xl">
        <AdminProductForm action={createProductAction} categories={categories} />
      </div>
    </div>
  );
}
