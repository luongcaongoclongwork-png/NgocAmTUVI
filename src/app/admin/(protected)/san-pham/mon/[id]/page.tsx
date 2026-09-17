import { notFound } from "next/navigation";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { getProductByIdForAdmin, getProductCategories } from "@/lib/products";
import { updateProductAction } from "@/app/admin/san-pham/actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByIdForAdmin(Number(id)),
    getProductCategories(),
  ]);
  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h1 className="font-heading text-2xl text-ink">Sửa sản phẩm</h1>
      <div className="mt-8 max-w-xl">
        <AdminProductForm action={boundAction} categories={categories} product={product} />
      </div>
    </div>
  );
}
