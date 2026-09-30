# Ngọc Âm — Web v1 (bản chốt 30/9/2026)

Tài liệu tổng hợp toàn bộ web Ngọc Âm tại thời điểm chốt bản, trước khi làm giao diện mới (v2).
Bản code đầy đủ được lưu trên GitHub với nhãn **`web-v1`** — lấy lại được bất cứ lúc nào:

```bash
git checkout web-v1
```

Web v2 chỉ làm lại **giao diện** các trang khách xem. Mọi thứ trong mục 3–6 dưới đây (dữ liệu, admin, form đặt lịch, công cụ lập lá số) được giữ nguyên và dùng lại.

---

## 1. Các trang khách xem

| Đường dẫn | Tên trang | Các phần trên trang (theo thứ tự) |
|---|---|---|
| `/` | Trang chủ | Hero "Hiểu mình - Thuận thế - Vững bước." · 3 trụ cột (Tử Vi Xuyên Tam Diệm, Phong Thuỷ Là Tịnh, Trà Đạo) · Tư vấn viên · Dịch vụ (xem trước) · Quy trình tư vấn · Về Ngọc Âm (Hậu nhân Khâm Thiên Giám) · Kiến thức · Vật phẩm · Triết lý (Khương – Lạc – Tịnh) · Dải kêu gọi đặt lịch |
| `/tu-vi` | Tử Vi Xuyên Tam Diệm | Banner · 4 giai đoạn Xuyên vấn · Hồ sơ Cô Minh Trang · Bảng dịch vụ Tử Vi · Chú giải thuật ngữ · Quy trình · Dải đặt lịch |
| `/phong-thuy` | Phong Thuỷ Là Tịnh | Banner · Triết lý · Hồ sơ Thầy Tịnh · Bảng dịch vụ Phong Thuỷ · Dải đặt lịch |
| `/dai-chu-su` | Xuyên Vấn Đại Chủ Sự | Banner · Ba chữ Đại – Chủ – Sự · Bảng dịch vụ doanh nghiệp · Chú giải thuật ngữ · Quy trình · Dải đặt lịch |
| `/dich-vu` | Dịch vụ tư vấn | Banner · Toàn bộ bảng giá Tử Vi + Phong Thuỷ · Quy trình · Dải đặt lịch |
| `/tra-dao` | Trà Đạo | Banner · Trà Sư Khương · Triết lý "Thuận" · Sản phẩm trà · Bài viết · Dải đặt lịch |
| `/phat-hoc` | Phật học | Banner · Bốn tinh thần · Bài viết Phật học · Dải đặt lịch |
| `/kien-thuc` | Kiến thức | Banner · Danh sách bài viết |
| `/kien-thuc/[bài]` | Bài viết | Tiêu đề · Ảnh bìa · Nội dung (có định dạng) · Dải đặt lịch |
| `/cua-hang` | Cửa hàng (Vật phẩm) | Banner · 4 danh mục, 11 vật phẩm (chưa có ảnh riêng, chưa có giá) · Dải đặt lịch |
| `/ve-ngoc-am` | Về Ngọc Âm | Banner · Mạch truyền thừa · Tư vấn viên · Triết lý · Dải đặt lịch |
| `/lien-he` | Đặt lịch / Liên hệ | Form (tên, điện thoại, chủ đề, lời nhắn, đồng ý liên hệ) · Hiện gói khách vừa chọn · Zalo · Quy trình 3 bước · Thông tin liên hệ |
| `/lap-la-so` | Lập lá số (miễn phí) | Form ngày giờ sinh (dương/âm lịch, giờ theo 12 canh) |
| `/la-so`, `/la-so/xuyen-tam-diem` | Kết quả lá số | Lá số Tử Vi 12 cung (bản thường và bản Xuyên Tam Diệm), xem chi tiết từng cung, in / tải PDF |

Menu chính: Trang chủ · Lập lá số · Tử vi · Phong thuỷ · Trà đạo · Dịch vụ · Khám phá (Phật học, Kiến thức, Đại Chủ Sự, Cửa hàng, Về Ngọc Âm, Liên hệ) · nút **Đặt lịch** luôn hiện trên đầu trang (cả điện thoại).

## 2. Bảng giá hiện tại (sửa trong /admin/dich-vu)

**Tử Vi Xuyên Tam Diệm**

| Gói | Giá | Thời lượng |
|---|---|---|
| Phiên Xuyên vấn Tổng hợp toàn Diệm Bản | 2.000.000 đ | 90 phút |
| Phiên Xuyên vấn chuyên sâu một vấn đề | 1.000.000 đ | 45 phút |
| Phiên Xuyên vấn 2 Diệm Bản cùng thời điểm | 3.500.000 đ | 120 phút |
| Xuyên vấn ngày/giờ đẹp | 500.000 đ | — |
| Phiên Xuyên vấn tiếp nối *(dành cho Chủ Sự đã Xuyên vấn)* | 700.000 đ | 45 phút |

**Phong Thuỷ Là Tịnh**

| Gói | Giá |
|---|---|
| Tư vấn Phong Thuỷ văn phòng / thương mại | Từ 2.000.000 đ |
| Tư vấn Phong Thuỷ cục bộ cả nhà | Từ 2.000.000 đ |
| Tư vấn Phong Thuỷ một không gian | Từ 500.000 đ |
| Phong Thuỷ tối giản kết hợp với lối sống | Từ 2.000.000 đ |
| Tư vấn Phong Thuỷ Âm Trạch | Liên hệ |

**Xuyên Vấn Đại Chủ Sự**

| Gói | Giá | Thời lượng |
|---|---|---|
| Xuyên vấn Đại Chủ Sự | 5.000.000 đ | 2 buổi · 2 ngày |
| Xuyên vấn phong thuỷ tuyển dụng | Từ 1.500.000 đ | 90 phút |
| Xuyên vấn ngày/giờ đẹp cho doanh nghiệp | 800.000 đ | Theo sự kiện |
| Phiên Xuyên vấn tiếp nối Doanh nghiệp *(dành cho Đại Chủ Sự đã Xuyên vấn)* | 2.500.000 đ | 90 phút |

## 3. Nội dung đang có

- **Tư vấn viên (3):** Cô Nguyễn Minh Trang — Xuyên vấn Tử Vi · Thầy Tịnh — Tư vấn Phong Thuỷ · Khương — Trà Sư.
- **Bài viết (7):** Mệnh Chủ và Thân Chủ nói gì về bạn? · Tịnh không gian trước khi tịnh tâm · Vô thường trong cách nhìn về vận hạn · Biết mình, biết thời · Khi tối giản trở thành một nguyên lý Phong Thuỷ · Vì sao người Việt vẫn xem ngày trước việc lớn? · Xuyên Tam Diệm – 川三焰.
- **Vật phẩm (11, 4 danh mục):** Ngọc Phỉ Thuý (3) · Ngọc Hoà Điền (2) · Đá Phong Thuỷ (3) · Đồ Phong Thuỷ (3).
- **Thuật ngữ thương hiệu:** Tử Vi Xuyên Tam Diệm · Xuyên vấn · Diệm Bản · Xuyên giả · Chủ Sự · Đại Chủ Sự (`src/data/xuyenVanGlossary.ts`).
- **Thông tin doanh nghiệp** (sửa trong /admin/cai-dat): điện thoại, email, giờ làm việc, địa chỉ Thái Nguyên, Zalo, Facebook, Instagram, YouTube, TikTok, tên pháp nhân, mã số thuế.
- **Ảnh:** ~40 ảnh phong cảnh / tĩnh vật trong `public/images` (Huế, sông Hương, sơn thuỷ 3D, thư phòng, ngọc), ảnh tư vấn viên, nền giấy, dải mây đầu trang, logo cầu bạc (`logo-mark.png`, bất biến).

## 4. Trang quản trị (/admin)

| Mục | Làm được gì |
|---|---|
| Tổng quan | Số khách mới, lịch hẹn sắp tới, bài nháp |
| Khách liên hệ | Lọc theo trạng thái, tìm kiếm, xem chi tiết, đổi trạng thái, đặt lịch hẹn, ghi chú, gọi / nhắn Zalo, xuất CSV |
| Bài viết | Soạn bài có thanh định dạng + xem trước, ảnh bìa + mô tả ảnh, nháp / đăng |
| Dịch vụ | 3 nhóm (Tử Vi, Phong Thuỷ, Đại Chủ Sự), giá, thời lượng, ghi chú điều kiện, ẩn/hiện, sắp xếp |
| Tư vấn viên | Hồ sơ, ảnh chân dung, ẩn/hiện, sắp xếp |
| Sản phẩm | Danh mục + vật phẩm, ẩn/hiện, sắp xếp |
| Thùng rác | Khôi phục trong 30 ngày |
| Cài đặt | Thông tin liên hệ, mạng xã hội, pháp lý · sao lưu / tải bản sao lưu dữ liệu |
| Tài khoản | Đổi mật khẩu, kênh báo khách mới (Zalo Bot / Telegram — chưa cấu hình) |

## 5. Tính năng nền

- Form đặt lịch lưu vào cơ sở dữ liệu, báo lỗi tiếng Việt cạnh từng ô, hiện gói khách đã chọn, chống gửi trùng.
- Báo khách mới qua Zalo Bot / Telegram (cần tạo bot và điền mã).
- Công cụ lập lá số Tử Vi (thư viện iztro) — bản thường và bản Xuyên Tam Diệm, in và tải PDF.
- Chuyển động: hiện dần khi cuộn, hero, thanh tiến trình khi chuyển trang, tôn trọng chế độ giảm chuyển động.

## 6. Công nghệ

Next.js 16 · React 19 · Tailwind CSS 4 · SQLite (`data/articles.db`, không đưa lên GitHub) · font Playfair Display (tiêu đề) + Be Vietnam Pro (chữ thường) · 121 bài kiểm thử tự động (vitest).

## 7. Những gì v1 còn thiếu (chi tiết trong bảng soát 30/9/2026)

- Chưa có nền tối, chưa có họa tiết Cửu Đỉnh / mây Đôn Hoàng đúng luật thương hiệu, font tiêu đề chưa theo luật (Cormorant Garamond).
- Còn chữ "khai vấn" / "lá số" ở chân trang, quy trình, trang chủ, dịch vụ, Phật học.
- Chưa có robots.txt, sitemap, llms.txt, ảnh chia sẻ mạng xã hội, dữ liệu có cấu trúc.
- Vật phẩm chưa có ảnh thật và giá.
