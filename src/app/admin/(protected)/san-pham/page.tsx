import Link from "next/link";
import { getProductCategoriesWithItemsForAdmin } from "@/lib/products";
import { getHiddenIds } from "@/lib/admin-entities";
import DeleteProductCategoryButton from "@/components/admin/DeleteProductCategoryButton";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import SortableList from "@/components/admin/SortableList";

const sectionTitle = "tracking-label text-[12px] font-semibold uppercase text-walnut/60";

export default async function AdminProductsPage() {
  const categories = await getProductCategoriesWithItemsForAdmin();
  const hiddenCategories = getHiddenIds("category");
  const hiddenProducts = getHiddenIds("product");

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
      <p className="mt-2 text-[13px] text-ink/55">Dùng ▲▼ (hoặc kéo ⋮⋮) để đổi thứ tự. Ẩn một danh mục là ẩn luôn các sản phẩm bên trong.</p>

      <section className="mt-8">
        <h2 className={sectionTitle}>Thứ tự danh mục</h2>
        <SortableList
          entity="category"
          emptyText="Chưa có danh mục nào."
          items={categories.map((category) => ({
            id: category.id,
            hidden: hiddenCategories.has(category.id),
            content: (
              <div className="min-w-0">
                <p className="truncate font-heading text-[16px] text-ink">{category.name}</p>
                <p className="text-[12px] text-ink/50">
                  {category.items.length} sản phẩm
                  {!category.image && <span className="text-lacquer"> · chưa có ảnh</span>}
                </p>
              </div>
            ),
            actions: (
              <>
                <Link href={`/admin/san-pham/danh-muc/${category.id}`} className="text-walnut/70 hover:text-gold">
                  Sửa
                </Link>
                <DeleteProductCategoryButton id={category.id} name={category.name} />
              </>
            ),
          }))}
        />
      </section>

      {categories.map((category) => (
        <section key={category.id} className="mt-12">
          <h2 className={sectionTitle}>
            {category.name}
            {hiddenCategories.has(category.id) && <span className="ml-2 normal-case tracking-normal text-ink/45">(danh mục đang ẩn)</span>}
          </h2>
          <SortableList
            entity="product"
            emptyText="Chưa có sản phẩm nào trong danh mục này."
            items={category.items.map((item) => ({
              id: item.id,
              hidden: hiddenProducts.has(item.id),
              content: (
                <div className="min-w-0">
                  <p className="truncate text-[15px] text-ink">{item.name}</p>
                  <p className="truncate text-[12px] text-ink/50">{item.desc}</p>
                </div>
              ),
              actions: (
                <>
                  <Link href={`/admin/san-pham/mon/${item.id}`} className="text-walnut/70 hover:text-gold">
                    Sửa
                  </Link>
                  <DeleteProductButton id={item.id} name={item.name} />
                </>
              ),
            }))}
          />
        </section>
      ))}
    </div>
  );
}
