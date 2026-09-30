# Ngọc Âm v2 — dự án riêng

Đây là **bản làm lại giao diện** của web Ngọc Âm, tách hẳn khỏi web đang chạy.

| | Web cũ (v1) | Web mới (v2) |
|---|---|---|
| Thư mục | `C:\Users\PCM\ngocam-tuvi` | `C:\Users\PCM\ngocam-v2` |
| Nhánh GitHub | `main` (nhãn `web-v1`) | `v2` |
| Địa chỉ khi chạy trên máy | http://localhost:3000 | http://localhost:3001 |
| Dữ liệu | `ngocam-tuvi/data/articles.db` | **bản sao riêng** `ngocam-v2/data/articles.db` |

Sửa gì trong admin của v2 **không ảnh hưởng** web cũ, và ngược lại. Hai bộ dữ liệu là bản sao ngày 30/9/2026. Khi v2 chính thức thay web cũ, cần chọn giữ bộ dữ liệu nào (thường là bộ của web cũ, vì khách đặt lịch vào đó).

## Nhánh `v3`: "Thuỷ Mặc Dễ Dùng" (kết hợp v1 và v2)
Cùng thư mục này, nhánh `v3` (bản v2 nguyên vẹn vẫn nằm ở nhánh `v2`).
- **Ảnh nền bản 1 trở lại đúng chỗ.**
  - Trang chủ: nhà lầu Huế ở phần mở đầu. Ba con đường và Trà Đạo có ảnh trụ cột, trên nền tranh sông Hương. Các phần tiếp theo dùng lại ảnh nền bản 1: truyền nhân, dịch vụ, trải nghiệm, hậu nhân Khâm Thiên Giám kèm ảnh thư phòng, tinh thần Ngọc Âm, Sổ tay, vật phẩm.
  - Khối đặt lịch cuối mọi trang: tranh mặc trầm.
  - Thanh đầu trang và chân trang: `header-bg` và `footer-bg`.
  - Vật phẩm, Bảng giá, Lập lá số: ảnh mở trang của bản 1. Lập lá số dùng `outer-bg` trải từ tiêu đề xuống form.
  - Ảnh chỉ còn phủ nhẹ tông giấy, giữ màu gốc.
- **Khung mới.**
  - Thanh đầu trang có chữ (Tử Vi, Phong Thuỷ, Đại Chủ Sự, Bảng giá, Lập lá số, Sổ tay) cùng la bàn "Khám phá" chứa đủ các trang.
  - Nút đặt lịch đổi chữ theo trang.
  - Điện thoại: nút "Menu", và thanh đáy "Đặt lịch + Nhắn Zalo" (không có Zalo thì hiện "Gọi").
  - Có đường tắt "Chuyển đến nội dung" cho người dùng bàn phím và trình đọc màn hình.
- **Trang chủ mới** (`src/components/thuy-mac/home/`), không ghim trang.
  - Màn đầu có đủ nút đặt lịch và giá khởi điểm của ba con đường.
  - Mực loang khoảng 1 giây. Mặt nước gợn theo chuột. Máy yếu hoặc máy bật tiết kiệm dữ liệu dùng ảnh tĩnh, và hiệu ứng chỉ vẽ khi có chuyển động.
  - Tiếp theo là dải mây và nét Cửu Đỉnh tự khắc, rồi tờ lịch (tờ hôm qua lật đi) kèm câu hỏi.
  - Sau đó: ba con đường cùng Trà Đạo, Xuyên giả, phiên tiêu biểu, quy trình, Về Ngọc Âm, Khương – Lạc – Tịnh, Sổ tay, Vật phẩm, khối đặt lịch.
- **Trang chủ 6 cảnh của v2** chuyển sang `/tranh-cuon` (có trong menu).
- Hiệu ứng mở trang ở các trang con rút từ 3,2 giây còn 1,2 giây.

## Chạy
```bash
npm run dev -- -p 3001
```
Mật khẩu admin giống web cũ (file `.env.local` được chép sang, không đưa lên GitHub).

## Đã làm
- Trang chủ **Thuỷ Mặc Sống**: 6 cảnh (giọt mực loang, xuyên mây và nét Cửu Đỉnh, ngã ba sông, tờ lịch Khâm Thiên Giám và câu hỏi, thư phòng Xuyên giả, giọt mực thành nút đặt lịch), la bàn, nút đặt lịch nổi, chân trang có toàn bộ bảng giá. Mã ở `src/components/thuy-mac/`.
- Hiệu ứng mực bằng WebGL thuần, sẵn sàng nhận **4 lớp tranh** (`layers.ts`). Có bản tĩnh dự phòng.
- **Mọi trang khách xem** đã làm lại theo phong cách thuỷ mặc, dùng chung bộ thành phần `src/components/thuy-mac/kit.tsx`:
  - Mở trang: tranh loang mực và câu đối treo làm tiêu đề.
  - Nội dung: triết lý và thuật ngữ dạng cuộn thư, bảng giá dạng dòng sông mực, chân dung hiện ra như mực loang, nét Cửu Đỉnh tự khắc khi cuộn, quy trình, khối đặt lịch.
  - Các trang: Tử Vi, Phong Thuỷ, Đại Chủ Sự, Bảng giá, Trà Đạo, Phật học, Sổ tay (Kiến thức), bài viết, Vật phẩm, Về Ngọc Âm, Liên hệ, Lập lá số.
- **Khung chung** cho mọi trang (`SiteChrome.tsx`, `InkFooter.tsx`): dấu Ngọc Âm, la bàn (menu đủ các trang), nút đặt lịch nổi đổi chữ theo trang, chân trang mực.
- **Công cụ lập lá số:** thẻ form thành cuộn thư có trục gỗ, tiêu đề và nút theo phong cách mực; trang kết quả trên nền giấy dó. Phần tính lá số và lưới 12 cung giữ nguyên.
- **Giữ giao diện cũ:** trang admin, lưới lá số và bản in lá số.
- **Sẵn sàng cho Google và AI:** `robots.txt`, `sitemap.xml`, `llms.txt` (tự lấy giá và liên hệ từ admin), ảnh xem trước khi chia sẻ link (`public/og/ngoc-am.jpg`; bài viết dùng ảnh bìa riêng), dữ liệu schema.org cho doanh nghiệp, từng gói dịch vụ kèm giá, và từng bài viết.

## Trước khi đưa lên mạng
1. **Điền `SITE_URL`** (ví dụ `SITE_URL=https://tenmien.vn`) vào `.env.local` hoặc cấu hình máy chủ. Chưa có dòng này thì mọi đường dẫn trong sitemap, robots, llms.txt, ảnh chia sẻ đều ghi `localhost`.
2. Chọn bộ dữ liệu giữ lại (thường là của web cũ), gộp nhánh `v2` vào `main`.
3. Sau khi chạy: khai báo sitemap với Google Search Console, tạo hoặc cập nhật Google Business Profile đúng địa chỉ, điện thoại trong Cài đặt.

## Việc tiếp theo
1. Tạo 4 lớp tranh và đặt vẽ nét Cửu Đỉnh: xem `docs/V2-TU-LIEU-HINH-ANH.md`.
2. Chủ web duyệt câu chữ mới: 30 câu chiêm nghiệm (`calendar.ts`), 7 lựa chọn và câu trả lời (`asks.ts`), tên "Sổ tay" thay cho "Kiến thức".
3. Sửa trong admin: nội dung 4 bài viết còn chữ "khai vấn", tiêu đề bài "XUYÊN TAM DIỆM - 川三焰" đang viết hoa toàn bộ.
