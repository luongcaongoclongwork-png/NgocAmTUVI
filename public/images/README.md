# Ảnh thật — nơi thay ảnh mà không cần sửa code

## `consultants/` — chân dung 3 truyền nhân (hiện đang là ảnh tạm, chưa có ảnh chân dung thật)

| File | Dùng ở |
| --- | --- |
| `minh-trang.webp` | `/tu-vi` — Cô Nguyễn Minh Trang |
| `thay-tinh.webp` | `/phong-thuy` — Thầy Tịnh |
| `khuong.png` | Chưa có nơi hiển thị (trang `/tra-dao` hiện chưa có khối chân dung Khương — hỏi lại nếu muốn thêm) |

Chỉ cần **thay đúng file cùng tên** (giữ nguyên đuôi .webp/.png hoặc đổi đuôi rồi báo lại để mình cập nhật 1 dòng code) — ảnh mới sẽ tự lên site, không cần sửa gì thêm. Ảnh nên là chân dung thật, ánh sáng cửa sổ, không tạo bằng AI (xem phần "Luxury Calibration" trong tài liệu Creative Direction).

## `pillars/` — ảnh 3 thẻ "Ba trụ cột triết học" trên trang chủ + banner trang con tương ứng

| File | Dùng ở |
| --- | --- |
| `tu-vi.webp` | Thẻ Tử Vi (trang chủ) |
| `phong-thuy.webp` | Thẻ Phong Thuỷ (trang chủ) |
| `tra-dao.png` | Thẻ Trà Đạo (trang chủ) + banner đầu trang `/tra-dao` |

`tra-dao.png` là ảnh cần thay nhất — bản hiện tại (cột sơn đỏ + núi đá vôi) có rủi ro bị đọc thành thẩm mỹ Trung Hoa thay vì Huế (xem PART 03 trong tài liệu Creative Direction). Nên thay bằng ảnh hiên trà thật, không cột đỏ cận cảnh.

## Đã có sẵn chỗ thay ảnh qua giao diện quản trị — không cần đụng vào folder ảnh

- **Sản phẩm** (`/cua-hang`): vào `/admin/san-pham`, sửa danh mục → tải ảnh lên trực tiếp. Ảnh tự lưu vào `public/uploads/`, không cần biết đường dẫn file.
- **Bài viết** (`/kien-thuc`): vào `/admin/bai-viet`, tương tự.

*(Từng sản phẩm riêng lẻ trong một danh mục — ví dụ từng viên đá phong thuỷ — chưa có ô ảnh riêng, đang dùng chung 1 icon minh hoạ. Muốn mỗi sản phẩm có ảnh riêng cần thêm một cột ảnh vào cơ sở dữ liệu — việc này ngoài phạm vi lần chỉnh sửa card hover này, báo lại nếu muốn làm.)*

## Ảnh khác (hero, banner các trang, nền section...)

Vẫn nằm trực tiếp trong `public/images/` với tên đánh số cũ (`01-...`, `02-...`) — chưa gom vào folder riêng trong lần này. Nếu muốn dọn tiếp theo cùng cách trên, báo lại.
