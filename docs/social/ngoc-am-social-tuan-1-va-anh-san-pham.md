# Ngọc Âm: Bài tuần 1 và cách làm lại ảnh hàng tồn

## A. Hàng đang có trên web

Danh mục sản phẩm lấy từ `src/data/seed-products.ts`:

| Nhóm | Sản phẩm | Ảnh hiện có |
|---|---|---|
| Ngọc Phỉ Thuý | Mặt tròn, Vòng tay, Mặt khắc chữ | 1 ảnh chung (`24-homepage-jade-still-life.webp`) |
| Ngọc Hoà Điền | Mặt hình Như Ý, Vòng tay hạt | **Chưa có ảnh** |
| Đá Phong Thuỷ | Vòng Thạch Anh, Trụ đá, Đá lăn | **Chưa có ảnh** |
| Đồ Phong Thuỷ | Tỳ Hưu gỗ, Chuông gió đồng, Bình phong mini | **Chưa có ảnh** |

**Nhận xét về ảnh hiện có:** ảnh đẹp, đúng tông nâu và be, trông sang. Nhưng đây là ảnh tĩnh vật kiểu banner: vòng nhỏ, đặt xa và nằm chung với 2 sản phẩm khác.
Trên mạng xã hội, ảnh này có 3 điểm yếu:
1. Không thấy vân và độ trong của ngọc, trong khi đó là thứ khách cần xem.
2. Không có ảnh vòng trên tay người, nên khách không hình dung được size và cảm giác khi đeo.
3. Khung ngang 16:9 bị cắt khi đăng Instagram (khung đúng là 4:5) và Story (9:16).

## B. Nguyên tắc dùng ChatGPT làm ảnh từ hàng thật

> **Quy tắc vàng:** luôn đưa **ảnh chụp thật** của chiếc vòng cho ChatGPT, rồi yêu cầu nó **giữ nguyên sản phẩm, chỉ đổi bối cảnh, ánh sáng và người mẫu**. Không để AI vẽ ra chiếc vòng mới: khách nhận hàng thấy khác ảnh sẽ mất uy tín, dễ bị báo cáo, và Meta có thể gỡ quảng cáo.

Cách chụp ảnh gốc bằng điện thoại để đưa cho ChatGPT:
- Chụp cạnh cửa sổ có nắng, nền giấy trắng, chụp 3 góc (chính diện, nghiêng 45°, cận vân)
- Chụp thêm 1 ảnh soi đèn pin để thấy độ trong của ngọc
- Kèm thước dây hoặc đồng xu để làm mốc kích thước

Đoạn mở đầu dán vào **mọi** prompt:
```
Đây là ảnh thật sản phẩm của tôi. GIỮ NGUYÊN 100% hình dáng, màu sắc, vân,
độ trong, kích thước của sản phẩm — không vẽ lại, không làm đẹp hơn thật.
Chỉ thay bối cảnh, ánh sáng, đạo cụ theo mô tả. Ảnh chân thật như chụp
máy ảnh full-frame, ống 85mm, không có chữ, không có logo.
```

## C. 6 kiểu ảnh làm mới cho từng sản phẩm

| # | Kiểu ảnh | Prompt (dán sau đoạn mở đầu) | Dùng cho |
|---|---|---|---|
| 1 | Cận vân ngọc | "Macro cận cảnh sản phẩm trên khay gỗ óc chó, nắng sớm xiên từ trái xuyên qua ngọc thấy rõ vân, nền mờ, khung 4:5" | Bài mở bán, ảnh bìa carousel |
| 2 | Đeo trên tay | "Cổ tay người phụ nữ Việt khoảng 30 tuổi, áo lụa màu be, đang cầm chén trà, sản phẩm đeo tự nhiên trên tay, ánh sáng cửa sổ chiều, 4:5" | Bán vòng: kiểu ảnh **quan trọng nhất** |
| 3 | Bàn trà cung đình | "Đặt trên khăn lụa nâu, cạnh ấm trà men lam Huế và cành mai, phong cách cung đình Nguyễn, tông nâu–be ấm" | Bài kể chuyện, ngày lễ |
| 4 | Theo ngũ hành | Mệnh Kim: "đĩa đồng, ánh trắng bạc". Mệnh Mộc: "lá xanh, gỗ". Thủy: "mặt nước gợn, đá cuội đen". Hỏa: "nến, ánh đỏ cam". Thổ: "đất nung, gốm" | Chuỗi bài "Mệnh X hợp đá gì" |
| 5 | Hộp quà | "Hộp gỗ mở nắp lót lụa đỏ đô, thiệp viết tay, dây gai, góc nhìn từ trên xuống" | Quà tặng, Tết 2027 |
| 6 | Dọc 9:16 cho Story/Reels | Prompt kiểu 1 hoặc 2, đổi khung thành "9:16, để trống 1/3 phía trên để chèn chữ" | Story, ảnh mở đầu Reels |

**Gợi ý cho từng nhóm hàng tồn:**
- **Vòng Phỉ Thuý:** kiểu 1, 2 và 4. Giữ màu thật của vòng, không để AI tô xanh đậm hơn.
- **Vòng Hoà Điền:** kiểu 2 (tay nam) và 5. Ý chính: "vật truyền đời".
- **Vòng Thạch Anh:** kiểu 4. Mỗi màu đá ứng với một mệnh, đủ cho 5 bài.
- **Mặt khắc chữ:** kiểu 1 thật cận vào nét khắc, kèm 1 bài "Bạn sẽ khắc chữ gì?"
- **Tỳ Hưu, chuông gió, bình phong:** đặt vào góc phòng khách hoặc cửa chính thật, kèm hướng dẫn vị trí đặt.

**Để lô hàng tồn bán chạy hơn:** gom thành bộ có tên, ví dụ "Bộ Bình An" (vòng và thẻ ý nghĩa), "Bộ Khai Xuân 2027" (vòng và Tỳ Hưu mini). Thêm tư vấn mệnh miễn phí. Ưu đãi có hạn theo ngày rằm hoặc mùng 1.

## D. Bài viết tuần 1 (sẵn sàng đăng)

### Ngày 1: Ra mắt (Reels quay tay chọn vòng, đặt lên lá số)
Mỗi chiếc vòng ở Ngọc Âm không bắt đầu từ kệ hàng, mà từ lá số của bạn.
Trước khi trao vòng, Ngọc Âm xem bản mệnh và điều bạn đang cần lúc này (bình an, công danh hay gia đạo) rồi mới chọn chất ngọc, màu đá cho hợp.
Bình luận **năm sinh** của bạn, Ngọc Âm gửi gợi ý màu đá hợp mệnh qua tin nhắn.
#ngocam #vongphongthuy #ngocphithuy #tuviphongthuy

### Ngày 2: 5 sai lầm khi chọn vòng (carousel 6 trang)
1. Chọn theo màu mình thích mà không xét bản mệnh
2. Đeo vòng quá chật hoặc quá lỏng
3. Đeo khi tắm hoặc xịt nước hoa trực tiếp lên vòng
4. Mua đá nhuộm màu vì giá rẻ
5. Nghĩ rằng đeo vòng là thay được mọi nỗ lực

Trang cuối: "Vòng là điểm tựa tinh thần, còn con đường là của bạn. Inbox để được xem mệnh miễn phí."

### Ngày 3: Mệnh Kim hợp đá gì? (carousel, dùng mẫu Canva)
**Hợp:** trắng, bạc, xám (bản mệnh); vàng, nâu đất (Thổ sinh Kim).
**Nên tránh:** đỏ, hồng, tím (Hỏa khắc Kim).
**Gợi ý:** Thạch Anh trắng, Phỉ Thuý tông sáng, Hoà Điền trắng.
Bạn mệnh Kim? Thả "Kim" xuống bình luận để nhận ảnh thật 3 mẫu hợp mệnh.

### Ngày 4: Câu chuyện khách hàng (chỉ dùng chuyện có thật, phải xin phép khách)
"Chị H. tìm đến Ngọc Âm vào một năm nhiều xáo trộn…" Kể theo 3 phần: vấn đề, quá trình tư vấn, cảm nhận. Kèm ảnh tay khách đeo vòng.

### Ngày 5: Mệnh Mộc (Reels 20 giây)
Câu móc: "Sinh năm 1980, 1981, 1988, 1989? Đây là màu đá của bạn."
**Hợp:** xanh lá (bản mệnh), xanh dương và đen (Thủy sinh Mộc).
**Nên tránh:** trắng, bạc (Kim khắc Mộc). Gợi ý: Phỉ Thuý xanh.
*Lưu ý: trước khi đăng, nhờ thầy soát lại danh sách năm sinh theo mệnh.*

### Ngày 6: Đá thật hay giả? (Reels)
Ba cách thử tại nhà: soi đèn xem vân tự nhiên không đều, cầm thấy mát tay lâu, gõ nhẹ nghe tiếng trong.
Kết video: "Mỗi vòng Ngọc Âm đều có giấy kiểm định *(chỉ nói câu này nếu Ngọc Âm có giấy thật)*."

### Ngày 7: Livestream (bài báo trước, đăng từ ngày 5)
"20h tối Chủ nhật: Thầy Tịnh xem mệnh trực tiếp. 10 người bình luận đầu được chọn vòng hợp mệnh, kèm ưu đãi riêng cho người xem live."

## E. Mẫu thiết kế trên Canva
Đã tạo 4 phương án cho bìa carousel "Mệnh … hợp đá gì?" (khung 4:5, tông nâu–be–vàng đồng, mây Đôn Hoàng):
- https://www.canva.com/d/GGFdm7cvmoSOYtZ
- https://www.canva.com/d/daeIFCNqOg0bw7T
- https://www.canva.com/d/J39bJmUM8ueueno
- https://www.canva.com/d/Bcfig8q3ARRd_97

Chọn 1 phương án làm mẫu chung: thay chữ tiêu đề và ảnh vòng theo từng mệnh. Logo Ngọc Âm cần tự chèn đúng file gốc.

---

# PHẦN 2: Soát page Facebook thật (theo ảnh chụp màn hình ngày 15/11/2026)

## 1. Hồ sơ page: 6 việc cần sửa ngay
| Vấn đề | Sửa thành |
|---|---|
| Ảnh bìa nền đỏ hồng tím, logo bạc: lệch hẳn tông nâu–be của web | Bìa tông nâu–be có ảnh vòng thật trên khay bát quái gỗ, kèm câu "Vòng chọn theo bản mệnh" |
| Facebook liên kết Instagram **@trangsucngocam**, trong khi tài khoản đưa cho tôi là **@ngocam_tuviphongthuy** | Chọn 1 tài khoản chính, sửa liên kết, tài khoản còn lại chuyển hướng người xem sang tài khoản chính |
| Đang hiện "Chuyển sang Trang để bắt đầu quản lý": đang dùng bằng hồ sơ cá nhân | Chuyển sang Trang để dùng Meta Business Suite, xem Insights, chạy quảng cáo và cài trả lời tự động |
| Chỉ có 1 đánh giá | Xin đánh giá từ khách cũ: những khách đã nhắn ảnh cảm ơn chính là nguồn |
| Phần giới thiệu ghi "Sáng tạo nội dung", nghe như cá nhân làm nội dung | Đổi danh mục thành "Cửa hàng trang sức". Phần giới thiệu ghi: "Ngọc & vòng phong thuỷ chọn theo bản mệnh · Tư vấn tử vi miễn phí · Cửa hàng tại Thái Nguyên" |
| Dùng chung một trang cho cả trà, tháp năng lượng, vòng và tranh AI | Ghim 3 bài lên đầu: bài bán vòng chủ lực, bài feedback khách, bài hướng dẫn chọn theo mệnh |

## 2. Ảnh: cái gì đang tốt, cái gì nên bỏ
**Đang tốt, giữ và làm nhiều hơn:**
- Ảnh tay cầm vòng thật, ảnh khách đeo vòng ngoài trời có hoa giấy hồng: chân thật, có cảm xúc.
- **Khay gỗ bát quái**: đạo cụ rất riêng, nên biến thành "dấu hiệu nhận diện" của Ngọc Âm.
- Ảnh chụp tin nhắn khách khen: bằng chứng niềm tin mạnh nhất, hiện chưa được khai thác.
- Ảnh soi đèn pin vào ngọc: chứng minh hàng thật.
- Ảnh cầm vòng trước mặt tiền cửa hàng: cho thấy có cửa hàng thật.

**Nên bỏ, hoặc dùng ChatGPT đổi nền:**
- Nền vải đỏ chói, nền đen bóng, tường gạch, táp-lô ô tô: lưới ảnh trông lộn xộn và rẻ hơn giá trị thật của hàng.
- Thẻ thông tin nửa trên ảnh, nửa dưới chữ nhỏ trên nền trắng (chỉ đỏ, charm hồ lô…): chữ không đọc được trên điện thoại. Nên chuyển phần chữ xuống caption hoặc thành carousel.
- Tranh AI đầy chữ (Mừng Trung Thu, 8/3, "Nhất mệnh nhì vận"): đẹp nhưng không bán được hàng. Mỗi tuần tối đa 1 tranh, và trong tranh phải có sản phẩm.
- Tháp năng lượng và trà ủ lạnh: nên để sang Instagram hoặc Story, hoặc gom thành một chuyên mục riêng, để page tập trung vào vòng.

## 3. Hàng đang có trong ảnh: gom thành 6 dòng để bán hàng tồn
| Dòng | Sản phẩm nhìn thấy trong ảnh | Tên gợi ý | Khách hướng tới |
|---|---|---|---|
| A | Vòng ngọc bản tròn: xanh hoa nổi, tím lavender, trắng băng, xanh lam ngọc | **Ngọc Âm Bản Mệnh** | Nữ 30–50, mua cho mình hoặc biếu mẹ |
| B | Vòng chỉ đỏ hoặc chỉ đen có ngọc bình an khấu, charm đồng xu, hồ lô | **Vòng Bình An / Vòng Khởi Tài** | Quà tặng giá mềm, người trẻ |
| C | Vòng hạt ngọc trắng, chuỗi hạt xanh đậm | **Chuỗi Tịnh Tâm** | Nam và nữ, đeo hằng ngày |
| D | Chuỗi thạch anh vàng quấn nhiều vòng, có hạt xanh | **Chuỗi Chiêu Tài** | Người buôn bán |
| E | Vòng cáp thép có ống đá xanh hoặc xám | **Dòng Hiện Đại** | Dân văn phòng, nam giới |
| F | Nhẫn bạc và vàng mặt đá xanh, mặt vàng | **Nhẫn Bản Mệnh** | Quà cưới, quà kỷ niệm |

## 4. Prompt ChatGPT cho từng dòng (dán sau đoạn "GIỮ NGUYÊN 100%" ở mục B)
- **A, vòng ngọc bản:** "Đặt vòng trên khay gỗ bát quái màu sáng, khay đặt trên khăn lụa nâu, nắng sớm chiếu xuyên qua ngọc thấy rõ vân hoa. Ảnh thứ hai: cổ tay phụ nữ áo dài lụa be đeo đúng chiếc vòng này, tay cầm chén trà men trắng. Khung 4:5."
- **B, vòng chỉ đỏ bình an khấu:** "Vòng đặt trên giấy dó màu be cạnh bao lì xì đỏ và cành đào nhỏ, chụp từ trên xuống, không khí Tết 2027 ấm áp. Ảnh thứ hai: vòng đeo trên tay đang mở hộp quà gỗ."
- **C, chuỗi hạt:** "Chuỗi hạt quấn quanh khay bát quái, bên cạnh có nén trầm đang toả khói mảnh, nền gỗ tối, ánh sáng một bên mềm, không khí tĩnh lặng."
- **D, chuỗi thạch anh vàng:** "Chuỗi đặt cạnh bàn tính gỗ cổ và sổ thu chi, ánh nắng vàng chiều, tạo cảm giác may mắn trong buôn bán."
- **E, vòng cáp thép:** "Cổ tay nam áo sơ mi trắng, đồng hồ dây da, đặt trên bàn làm việc gỗ có laptop mờ phía sau, tông nâu–be trung tính."
- **F, nhẫn:** "Nhẫn trong hộp gỗ óc chó mở nắp, lót nhung nâu, thêm một cánh hoa giấy hồng, macro thật cận vào viên đá."

**Kiểm tra trước khi đăng:** đặt ảnh ChatGPT cạnh ảnh gốc, so màu ngọc, số hạt và kiểu charm. Sai một chi tiết là không đăng. Ghi rõ trên caption: "Ảnh minh hoạ bối cảnh, sản phẩm thật như video kèm theo". Mỗi ảnh AI đi kèm 1 video quay thật.

## 5. Lưới Instagram mới (xoay vòng mỗi 3 bài)
Ảnh sản phẩm trên khay bát quái → ảnh vòng đeo trên tay → carousel kiến thức hoặc feedback. Cả 3 dùng chung tông nâu–be, logo nhỏ ở cùng một góc.
