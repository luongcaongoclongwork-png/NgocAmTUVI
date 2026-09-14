# Ảnh nền trang Lập Lá Số

Bỏ 2 file ảnh vào đúng thư mục này (`public/images/lap-la-so/`) để chúng tự động hiện lên — không cần sửa code:

- `outer-bg.jpg` — nền toàn khu vực xung quanh thẻ "Thông tin lá số" (chạy hết chiều ngang trang)
- `inner-bg.jpg` — nền riêng bên trong thẻ "Thông tin lá số"

Muốn dùng đuôi `.png` hoặc `.webp` thay vì `.jpg`: mở
`src/components/tuvi/LapLaSoClient.tsx`, tìm 2 dòng `backgroundImage: "url(...)"`,
đổi đuôi file trong đó cho khớp với file bạn có.

Xem hướng dẫn đầy đủ (kích thước, tỉ lệ khung hình, độ phân giải khuyến nghị)
trong file hướng dẫn đã gửi kèm.
