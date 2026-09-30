# Ngọc Âm v2 — Tư liệu hình ảnh cần chuẩn bị

Trang chủ "Thuỷ Mặc Sống" đã chạy được với **một bức tranh phẳng** (`public/images/06-thuy-mac-song-huong.webp`), chiều sâu đang được giả lập. Để "máy quay" thật sự bay xuyên qua từng lớp núi, sương, mái đình, cần **4 lớp tranh** vẽ cùng một cảnh. Tài liệu này có sẵn prompt để tạo bằng ChatGPT (tạo ảnh), cách đặt tên và nơi đặt file.

---

## 1. Bốn lớp tranh cảnh sông Hương

### Quy cách chung (cả 4 lớp phải giống hệt)
- **Kích thước:** 3840 × 2160 px (16:9), ngang.
- **Bố cục cố định** để 4 lớp khớp nhau:
  - Đường chân trời (mặt nước gặp chân núi) ở **62% chiều cao** tính từ trên xuống.
  - Mặt trời ở khoảng **20% chiều ngang, 55% chiều cao**.
  - Lầu cổ bên bờ phải ở khoảng **80% chiều ngang**.
  - Con thuyền ở khoảng **30% chiều ngang, 78% chiều cao**.
  - Nửa trên bên trái để **trống** (chỗ đặt câu đối "Hiểu mình · Thuận thế · Vững bước").
- **Lớp 1 nền đặc**; **lớp 2, 3, 4 nền trong suốt** (PNG có kênh alpha).

### Khối phong cách (dán vào đầu MỌI prompt)
> Vietnamese ink-wash painting (thuỷ mặc) on warm dó paper, colour palette of sepia ink, warm beige and soft brown only, one faint amber sun; soft wet-on-wet ink gradients, delicate dry-brush details; quiet Zen atmosphere of Huế, Nguyễn dynasty; no text, no signature, no seal, no frame; no people except where stated; no red, no green-blue, no purple; 16:9, 3840×2160, same framing as the reference.

### Lớp 1 — `lop-1-troi-nui-xa.webp` (nền đặc, xa nhất)
> [Khối phong cách] Layer 1 of 4, the farthest layer, OPAQUE background. Only: plain dó paper sky with very subtle paper fibres, a faint amber sun at 20% from the left and 55% from the top, and the most distant mountain range as pale grey-brown ink wash silhouettes along the horizon at 62% height. Nothing in the foreground, no water details, no trees, no buildings. Leave the upper-left half empty.

### Lớp 2 — `lop-2-suong-nui-giua.webp` (trong suốt)
> [Khối phong cách] Layer 2 of 4, TRANSPARENT background (PNG with alpha). Only the middle mountain ranges in medium ink wash, with soft horizontal mist bands drifting between them, and a thin line of small trees along the far riverbank at 62% height. Everything else fully transparent: no sky, no water, no sun, no foreground.

### Lớp 3 — `lop-3-bo-lau-mat-nuoc.webp` (trong suốt phía trên)
> [Khối phong cách] Layer 3 of 4, TRANSPARENT above the horizon. The calm Perfume River surface filling the lower 38% of the image with soft reflections and faint ripple lines; a small wooden boat with one rower in a conical hat at 30% from the left and 78% from the top; on the right bank at 80% from the left, a small two-tier Nguyễn-style pavilion among dark ink trees and palms. Sky and mountains fully transparent.

### Lớp 4 — `lop-4-canh-thong.webp` (trong suốt, gần nhất)
> [Khối phong cách] Layer 4 of 4, the nearest layer, TRANSPARENT background. Only foreground elements in dark, confident ink: a gnarled pine branch entering from the top-right corner with clusters of needles, reaching to about 60% of the width; and a few reeds and grasses in the bottom-left corner. Everything else fully transparent.

### Mẹo tạo cho khớp
1. Tạo **lớp 1 trước**. Khi tạo lớp 2, 3, 4, **đính kèm lớp 1 làm ảnh tham chiếu** và viết thêm: *"match the style, scale and framing of the attached reference exactly"*.
2. Nếu ChatGPT trả về ảnh nền trắng thay vì trong suốt, ghi rõ *"transparent background, PNG"* và tạo lại; hoặc xoá nền bằng công cụ xoá phông.
3. Nén mỗi lớp sang WebP có trong suốt (ví dụ bằng squoosh.app), **mỗi file dưới ~400 KB**.

### Đặt file và bật
1. Chép 4 file vào `public/images/thuy-mac/`.
2. Mở `src/components/thuy-mac/layers.ts`, điền mảng `PAINTING_LAYERS` (xa → gần, độ sâu 0 → 1):
   ```ts
   export const PAINTING_LAYERS: InkLayer[] = [
     { src: "/images/thuy-mac/lop-1-troi-nui-xa.webp", depth: 0 },
     { src: "/images/thuy-mac/lop-2-suong-nui-giua.webp", depth: 0.3 },
     { src: "/images/thuy-mac/lop-3-bo-lau-mat-nuoc.webp", depth: 0.6 },
     { src: "/images/thuy-mac/lop-4-canh-thong.webp", depth: 1 },
   ];
   ```
3. Mực loang, gợn nước, sương và máy quay sẽ tự dùng 4 lớp này. Ảnh tĩnh dự phòng (`PAINTING`) nên được thay bằng bản ghép phẳng của 4 lớp.

---

## 2. Nét khắc Cửu Đỉnh (đặt họa sĩ)

Hiện nét núi sông ở cảnh 2 và các biểu tượng dịch vụ do máy vẽ. Bản chính thức nên do họa sĩ vẽ lại **theo đúng hình chạm trên Cửu Đỉnh ở Thế Miếu (Huế)**.

**Yêu cầu gửi họa sĩ:**
- **Số lượng:** 8–12 hình, chọn trong các nhóm đề tài có trên Cửu Đỉnh: núi, sông, cửa biển, mây, mặt trời và tinh tú, cây cỏ, chim muông, thuyền. Họa sĩ tra theo ảnh chụp hoặc bản rập các đỉnh thật, không vẽ theo trí tưởng tượng.
- **Nét:** một độ dày duy nhất (tương đương 1,5 px ở 1440 px), **chỉ nét, không tô màu**, đầu nét tròn.
- **Định dạng:** SVG, mỗi hình một file, không nhúng ảnh; nét dùng `stroke="currentColor"` để web tự tô màu nâu–đồng theo nền sáng hoặc tối.
- **Một bức ngang lớn:** dãy núi, sông, mây liền mạch, tỉ lệ 3:1, dùng cho cảnh "Xuyên mây".
- **Ba biểu tượng nhỏ (64 × 64):** cho Tử Vi, Phong Thuỷ, Đại Chủ Sự.

Khi có file: thay nội dung `CuuDinhLandscape` và `IconTuVi`, `IconPhongThuy`, `IconDaiChuSu` trong `src/components/thuy-mac/ornaments.tsx`. Nét vẽ sẽ tự khắc theo thao tác cuộn như hiện nay.

---

## 3. Không bắt buộc
- **Chân dung Xuyên giả:** web đang tự chuyển ảnh sang tông mực nâu. Nếu muốn đẹp hơn, chụp chân dung nền trơn, ánh sáng dịu, khổ dọc 4:5, rồi tải lên trong admin (Tư vấn viên).
- **Tranh thư phòng (cảnh 5):** đang dùng `23-homepage-heritage-study.webp` làm nền mờ. Có thể thay bằng tranh thuỷ mặc thư phòng cùng phong cách với khối prompt ở trên.
