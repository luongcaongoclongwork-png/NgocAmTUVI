# Ngọc Âm v2 — dự án riêng

Đây là **bản làm lại giao diện** của web Ngọc Âm, tách hẳn khỏi web đang chạy.

| | Web cũ (v1) | Web mới (v2) |
|---|---|---|
| Thư mục | `C:\Users\PCM\ngocam-tuvi` | `C:\Users\PCM\ngocam-v2` |
| Nhánh GitHub | `main` (nhãn `web-v1`) | `v2` |
| Địa chỉ khi chạy trên máy | http://localhost:3000 | http://localhost:3001 |
| Dữ liệu | `ngocam-tuvi/data/articles.db` | **bản sao riêng** `ngocam-v2/data/articles.db` |

Sửa gì trong admin của v2 **không ảnh hưởng** web cũ, và ngược lại. Hai bộ dữ liệu là bản sao ngày 30/9/2026. Khi v2 chính thức thay web cũ, cần chọn giữ bộ dữ liệu nào (thường là bộ của web cũ, vì khách đặt lịch vào đó).

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
- **Giữ giao diện cũ:** trang admin, phần bên trong công cụ lập lá số và trang kết quả lá số, bản in lá số.

## Việc tiếp theo
1. Tạo 4 lớp tranh và đặt vẽ nét Cửu Đỉnh: xem `docs/V2-TU-LIEU-HINH-ANH.md`.
2. Chủ web duyệt câu chữ mới: 30 câu chiêm nghiệm (`calendar.ts`), 7 lựa chọn và câu trả lời (`asks.ts`), tên "Sổ tay" thay cho "Kiến thức".
3. Nếu muốn: làm lại giao diện bên trong công cụ lập lá số và trang kết quả theo cùng phong cách.
4. Khi sẵn sàng thay web cũ: chọn bộ dữ liệu giữ lại, gộp nhánh `v2` vào `main`.
