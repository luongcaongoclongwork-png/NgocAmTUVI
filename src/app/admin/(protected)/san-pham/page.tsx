import Link from "next/link";
import { getProductCategoriesWithItems } from "@/lib/products";
import DeleteProductCategoryButton from "@/components/admin/DeleteProductCategoryButton";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const categories = await getProductCategoriesWithItems();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl text-ink">Sản phẩm</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/san-pham/mon/moi"
            className="tracking-label h-10 border border-walnut/30 px-4 text-[13px] font-medium uppercase leading-10 text-walnut hover:border-gold hover:text-gold"
          >
            Thêm sản phẩm
          </Link>
          <Link
            href="/admin/san-pham/danh-muc/moi"
            className="tracking-label h-10 border border-gold bg-gold/10 px-4 text-[13px] font-medium uppercase leading-10 text-gold hover:bg-gold/20"
          >
            Thêm danh mục
          </Link>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">Chưa có danh mục nào.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between gap-4 border-b border-walnut/15 pb-3">
                <div className="min-w-0">
                  <p className="font-heading text-lg text-ink">{category.name}</p>
                  <p className="text-[12px] text-ink/50">
                    /cua-hang#{category.slug} · thứ tự {category.sortOrder}
                    {!category.image && " · chưa có ảnh"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-[13px]">
                  <Link href={`/admin/san-pham/danh-muc/${category.id}`} className="text-walnut/70 hover:text-gold">
                    Sửa danh mục
                  </Link>
                  <DeleteProductCategoryButton id={category.id} name={category.name} />
                </div>
              </div>

              {category.items.length === 0 ? (
                <p className="mt-3 text-sm text-ink/60">Chưa có sản phẩm nào trong danh mục này.</p>
              ) : (
                <div className="mt-2 divide-y divide-walnut/10">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] text-ink">{item.name}</p>
                        <p className="truncate text-[12px] text-ink/50">{item.desc}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 text-[13px]">
                        <Link href={`/admin/san-pham/mon/${item.id}`} className="text-walnut/70 hover:text-gold">
                          Sửa
                        </Link>
                        <DeleteProductButton id={item.id} name={item.name} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
