# Ngọc Âm — Đặt hàng hình vector (bản v3)

Tài liệu này để giao cho người thiết kế hoặc một AI khác vẽ lại toàn bộ hình vector của web Ngọc Âm. Mỗi mục ghi rõ: hình dùng ở đâu, kích thước, nội dung cần vẽ, yêu cầu kỹ thuật và tên file. Cuối tài liệu có đoạn mô tả phong cách bằng tiếng Anh để dán vào đầu mọi yêu cầu.

Các hình hiện có trên web đều là bản phác dựng bằng công thức (cung tròn, vòng tròn lặp lại), chưa phải nét vẽ thật.

---

## 1. Ngọc Âm là ai (để người vẽ hiểu tinh thần)

- Tử Vi và Phong Thuỷ của **hậu nhân Khâm Thiên Giám, vua Minh Mạng, triều Nguyễn**. Khách hàng là người có tài chính cao; web phải trầm, sang, kín đáo.
- Tinh thần hình ảnh: **70% phong cảnh cung đình Nguyễn và sự tĩnh lặng của Thiền**, lấy nguồn chính từ **hình khắc trên Cửu Đỉnh** (chín đỉnh đồng ở Huế, đúc thời Minh Mạng: núi, sông, cửa biển, mặt trời, mặt trăng, sao, cây cỏ, thuyền bè); **30% dải mây Đôn Hoàng (tường vân)** dùng làm viền, góc, đường ngăn.
- Web trông như một bức thuỷ mặc trên giấy dó: nền be, mực nâu.

### Cấm tuyệt đối
- Rồng, phượng, hoa văn nhà Thanh, bảng màu đỏ–vàng kiểu Trung Hoa.
- Hình tượng Đôn Hoàng có hình người: phi thiên, Phật, Bồ Tát, toà sen, bích hoạ hang động. **Chỉ lấy dải mây.**
- Biểu tượng bói toán: quả cầu pha lê, vòng hoàng đạo 12 con giáp, bài tarot, sao trăng lấp lánh, màu tím huyền bí.
- Phong cách công nghệ: gradient, bóng đổ, kính mờ, neon, biểu tượng bo tròn kiểu ứng dụng, emoji.
- **Không vẽ lại, không mô phỏng logo Ngọc Âm** (vầng trăng "Trăng Xoắn" có vòng xoắn tỷ lệ vàng). Logo chỉ dùng file gốc trong bộ Logo Kit v1.2 (`public/images/logo/`).
- Không có chữ, không có con dấu, không có chữ ký trong bất kỳ hình nào.

---

## 2. Quy cách chung cho MỌI hình

| Hạng mục | Yêu cầu |
|---|---|
| Định dạng | **SVG thuần**, mỗi hình một file. Không nhúng ảnh bitmap, không nhúng font, không dùng `<filter>`, `<mask>`, gradient hay hiệu ứng. |
| Màu | **Một màu duy nhất.** Mọi nét dùng `stroke="currentColor"`, mọi mảng đặc dùng `fill="currentColor"`. **Không ghi mã màu cố định**, vì web tự tô màu theo từng chỗ. |
| Kiểu nét | Hình nét (mục 3, 4, 5, 6, 9): **chỉ có nét, không tô mảng** (`fill="none"`), đầu nét và góc nét bo tròn (`stroke-linecap="round"`, `stroke-linejoin="round"`). Nét phải có dáng tay khắc: hơi run, dày mỏng tự nhiên qua cách đi nét, không phải cung tròn hoàn hảo. |
| Độ dày nét | Ghi ở từng mục, tính theo đơn vị của `viewBox`. Trong một hình chỉ dùng tối đa 2 độ dày. |
| `viewBox` | Đúng như ghi ở từng mục, bắt đầu từ `0 0`. Hình nằm trọn trong khung, chừa lề tối thiểu 2 đơn vị. |
| Cấu trúc | Mỗi nét bút là **một thẻ `<path>` riêng** (không gộp cả hình vào một path), xếp theo **thứ tự vẽ**: nét nào vẽ trước đặt trước. Web sẽ cho hình "tự khắc" theo đúng thứ tự đó. |
| Không dùng | `transform` lồng nhiều tầng, `<use>`, `<symbol>`, `<clipPath>`, CSS trong file, thuộc tính riêng của phần mềm (Inkscape, Illustrator). |
| Dung lượng | Biểu tượng nhỏ dưới 3 KB; hình lớn dưới 40 KB. Toạ độ làm tròn 1 chữ số thập phân. |
| Nền | Trong suốt. |

**Web sẽ tô các màu này** (để người vẽ hình dung, không ghi vào file):

| Nơi dùng | Màu nét | Trên nền |
|---|---|---|
| Nền sáng | nâu óc chó `#6B4A2F`, đồng `#94733A`, mực `#2B1F17` | giấy dó `#ECE2CE`, giấy sáng `#F6EFE2` |
| Nền tối (chân trang, khối đặt lịch) | be sáng `#EFE3D1`, đồng nhạt `#D6B98F` | nâu đen `#1F1712` |

Hình phải đọc được ở cả hai trường hợp.

---

## 3. La bàn (nút mở menu "Khám phá") — ưu tiên 1

**Dùng ở đâu:** thanh đầu trang của mọi trang, bên trái chữ "Khám phá" (máy tính) hoặc "Menu" (điện thoại). Đây là hình khách thấy đầu tiên.

**Vấn đề hiện tại:** ba vòng tròn và một kim hình thoi, giống biểu tượng la bàn chung chung, không có chất riêng.

**Cần vẽ:** một chiếc **la kinh** (la bàn phong thuỷ của thầy địa lý Việt), nhìn thẳng từ trên xuống, tối giản đến mức vẫn rõ khi rất nhỏ.

### 3a. Bản biểu tượng — `la-ban.svg`
- `viewBox="0 0 64 64"`. **Hiển thị thực tế 34 × 34 px**, nên chi tiết phải cực ít.
- Độ dày nét: **2** (nét chính) và **1.2** (nét phụ).
- Thành phần, từ ngoài vào:
  1. Vòng ngoài: một vòng tròn, tâm (32, 32), bán kính khoảng 29.
  2. Vòng chia độ: **24 vạch ngắn** (24 sơn), trong đó 8 vạch ở tám hướng dài hơn.
  3. Vòng trong, bán kính khoảng 13: "thiên trì", ô chứa kim.
  4. **Kim**: thanh mảnh hai đầu nhọn, một đầu đặc để phân biệt hướng. **Kim phải nằm trong một nhóm riêng `<g id="kim">`, đối xứng quanh tâm (32, 32)**, vì web sẽ xoay kim quanh tâm này khi khách cuộn trang.
  5. Tâm: một chấm đặc nhỏ, bán kính 2.
- Không vẽ quẻ, chữ Hán hay 12 con giáp ở bản nhỏ này.
- Kiểm tra: thu hình xuống 28 px vẫn nhận ra là la kinh, không bị bết nét.

### 3b. Bản lớn — `la-ban-lon.svg` (tuỳ chọn, nên có)
- `viewBox="0 0 480 480"`. Hiển thị 240–480 px, làm hình trang trí khi mở menu và ở trang "không tìm thấy".
- Độ dày nét: **1.6** và **1**.
- Thêm so với bản nhỏ: 5–7 vòng đồng tâm; vòng 24 sơn chia ô đều; một vòng **8 quẻ bát quái chỉ bằng vạch liền và vạch đứt** (không chữ); một vòng dải mây nhỏ (xem mục 5) chạy quanh mép.
- Kim vẫn là nhóm riêng `<g id="kim">`, tâm (240, 240).

---

## 4. Bộ cảnh khắc Cửu Đỉnh — ưu tiên 2

**Dùng ở đâu:** làm hình mở chương và đường ngăn giữa các phần. Khi khách cuộn tới, hình **tự khắc từng nét** theo thứ tự các `<path>` trong file.

**Vấn đề hiện tại:** một hình duy nhất dùng lặp ở 7 chỗ; núi là các vòm cung theo công thức; không dựa trên hình khắc thật.

**Yêu cầu chung cho cả bộ:**
- **Vẽ theo ảnh tư liệu thật của hình khắc trên Cửu Đỉnh** (đặt trước Thế Miếu, Đại Nội Huế). Người vẽ cần tra ảnh từng hình khắc và giữ đúng lối tạo hình của nó: nét khắc nổi đơn giản, núi xếp lớp, sóng nước hình vảy, mây cuộn. Không tự nghĩ ra phong cảnh.
- `viewBox="0 0 1200 400"` (tỉ lệ 3:1). Hiển thị rộng 620–1200 px.
- Độ dày nét: **1.4** (nét chính) và **1** (nét phụ).
- **Chỉ có nét.** Riêng các hình khép kín nằm phía trước (dãy núi gần, thân thuyền) cần che nét phía sau thì đặt `fill="var(--orn-fill, none)"` thay cho `fill="none"`.
- Mỗi nét một `<path>`, mỗi path thêm `class="draw"` và `pathLength="1"`. Thứ tự: xa trước, gần sau; trong mỗi lớp đi từ trái sang phải.
- Số lượng: 40–90 path mỗi cảnh. Không quá rậm, để chừa khoảng trống như tranh Thiền.
- Bố cục: đường chân trời ở khoảng 78% chiều cao; hai mép trái phải nhạt dần (thưa nét) để ghép vào trang không lộ mép.

**Năm cảnh cần vẽ** (đề tài chọn trong các nhóm hình khắc của Cửu Đỉnh; người vẽ đối chiếu tư liệu để chọn đúng hình):

| File | Dùng cho | Đề tài |
|---|---|---|
| `cuu-dinh-nui-song.svg` | Trang chủ (phần truyền thừa), trang Về Ngọc Âm | Núi và sông xứ Huế: một dãy núi thấp dáng bằng như núi Ngự Bình, dòng sông uốn phía trước, mặt trời nhỏ, vài cụm mây. |
| `cuu-dinh-thien-van.svg` | Trang Tử Vi | Bầu trời: mặt trời, mặt trăng, các chòm sao khắc trên đỉnh (chấm tròn nối bằng nét thẳng), mây. Phần đất chỉ là một dải núi thấp ở đáy. |
| `cuu-dinh-dia-the.svg` | Trang Phong Thuỷ | Thế đất: núi nhiều lớp, một cửa biển hoặc cửa sông mở ra, sóng nước hình vảy, vài cây cổ thụ. |
| `cuu-dinh-thuyen.svg` | Trang Đại Chủ Sự | Một chiếc thuyền buồm lớn kiểu thuyền khắc trên đỉnh, đi trên sóng, xa xa là dãy núi. Gợi hình người cầm lái. |
| `cuu-dinh-co-cay.svg` | Sổ tay (phần Phật học) | Cây cỏ hoa lá khắc trên đỉnh: sen, cây tùng hoặc cây cổ thụ, đặt trong khoảng trống rộng. Tĩnh nhất trong năm cảnh. |

### Dải dài cho khối đặt lịch — `cuu-dinh-dai.svg`
- `viewBox="0 0 1600 320"`. Nằm mờ (độ rõ khoảng 18%) phía sau khối "Đặt lịch Xuyên vấn" ở cuối mọi trang, trên nền tối.
- Nội dung: chỉ **sóng nước và một dãy núi xa**, rất thưa nét (25–40 path), không có chi tiết nổi bật ở giữa vì chữ nằm đè lên.

---

## 5. Dải mây Đôn Hoàng (tường vân) — ưu tiên 3

**Dùng ở đâu:** đường ngăn giữa các phần, viền, góc. Hiện web không còn dải mây vector nào.

**Cần vẽ:** mây cuộn kiểu Đôn Hoàng: các vòng xoáy nối nhau bằng một nét đuôi dài, mềm. **Chỉ mây**, không có hình người hay hoa sen.

| File | `viewBox` | Mô tả |
|---|---|---|
| `may-dai.svg` | `0 0 160 48` | **Một đơn vị lặp ngang.** Mép trái và mép phải phải khớp nhau tuyệt đối: nét chạm mép trái ở toạ độ y nào thì chạm mép phải ở đúng y đó, để xếp nối tiếp không lộ chỗ ghép. Web lặp đơn vị này suốt chiều rộng trang, cao 48 px. |
| `may-goc.svg` | `0 0 96 96` | Một cụm mây góc, đặt ở góc trên trái của khung; ba góc còn lại do web lật hình. Mây toả từ góc (0, 0) vào trong. |
| `may-ngan.svg` | `0 0 480 48` | Đường ngăn: một cụm mây ở giữa, hai bên kéo ra hai nét ngang mảnh dài, nhạt dần về hai đầu. |

- Độ dày nét: **1.2**. Mỗi vòng xoáy là một `<path>` riêng, thêm `class="draw"` và `pathLength="1"`.
- Mây phải thoáng: ở chiều cao 48 px chỉ nên có 3–4 vòng xoáy mỗi đơn vị.

---

## 6. Bộ biểu tượng mục — ưu tiên 3

**Dùng ở đâu:** cạnh tên từng mục ở trang chủ, menu, trang bảng giá. Hiển thị **40–56 px**.

- Mỗi biểu tượng: `viewBox="0 0 64 64"`, độ dày nét **1.6**, chỉ có nét, tối đa 12 path.
- Cả bộ phải cùng một tay vẽ: cùng độ dày, cùng mức chi tiết, cùng khoảng trống quanh hình (lề 6 đơn vị).

| File | Mục | Hình |
|---|---|---|
| `icon-tu-vi.svg` | Tử Vi Xuyên Tam Diệm | **Ba ngọn lửa** ("Tam Diệm" là ba ngọn lửa) xếp cạnh nhau trên một nét sông uốn ("Xuyên" là dòng sông). Không vẽ vòng hoàng đạo. |
| `icon-phong-thuy.svg` | Phong Thuỷ Là Tịnh | Một ngọn núi phía sau, một nét nước uốn phía trước (sơn và thuỷ), mặt nước phẳng lặng. |
| `icon-dai-chu-su.svg` | Xuyên Vấn Đại Chủ Sự | Bánh lái thuyền, hoặc mũi thuyền rẽ sóng nhìn nghiêng. Không vẽ vương miện, ngai. |
| `icon-tra-dao.svg` | Trà Đạo | Một chén trà không quai, một làn hơi mảnh bay lên. |
| `icon-lap-la-so.svg` | Lập lá số | Lưới lá số: hình vuông chia 4 × 4, bốn ô giữa gộp thành một ô lớn (Trung cung). |
| `icon-so-tay.svg` | Sổ tay | Cuốn sách cổ đóng chỉ: bìa chữ nhật, gáy có bốn mũi chỉ khâu. |
| `icon-vat-pham.svg` | Vật phẩm | Miếng ngọc bội tròn có lỗ giữa, một sợi dây treo ngắn. |

---

## 7. Trục gỗ của cuộn tranh — ưu tiên 4

**Dùng ở đâu:** trên và dưới mỗi "cuộn tranh": cuộn chữ tiêu đề, cuộn chân dung Xuyên giả, ô triết lý, thẻ form Lập lá số. Hiện chỉ là thanh nâu phẳng.

Cuộn tranh có bề rộng thay đổi, nên trục chia ba mảnh: hai đầu trục là hình vẽ, phần thân giữa web tự kéo dài bằng màu đặc.

| File | `viewBox` | Mô tả |
|---|---|---|
| `truc-dau-trai.svg` | `0 0 28 16` | Đầu trục bên trái: núm tiện tròn nhô ra ngoài thân trục, có một hai gờ tiện. Mép phải của hình là thân trục cao **6 đơn vị**, nằm giữa chiều cao (từ y = 5 đến y = 11), để nối với phần thân. |
| `truc-dau-phai.svg` | `0 0 28 16` | Đối xứng gương của hình trên. |
| `day-treo.svg` | `0 0 120 44` | Dây treo ở giữa trục trên: sợi dây hình chữ V ngược, đỉnh có một vòng móc nhỏ. Chỉ có nét, độ dày 1.2. |

- Hai đầu trục là **mảng đặc** (`fill="currentColor"`, không viền). Đây là ngoại lệ so với quy tắc "chỉ có nét".
- Hiển thị thực tế cao 6–8 px, nên hình phải cực gọn.

---

## 8. Dòng sông mực của bảng giá — ưu tiên 4

**Dùng ở đâu:** chạy dọc bên trái danh sách các phiên Xuyên vấn và giá. Hiện là một đường kẻ thẳng với các chấm tròn.

| File | `viewBox` | Mô tả |
|---|---|---|
| `song-muc-than.svg` | `0 0 24 200` | **Đoạn thân lặp theo chiều dọc.** Một nét bút lông đi từ trên xuống, tâm nét quanh x = 12, bề rộng dao động 2–5 đơn vị, mép hơi xơ như nét mực khô. Mép trên và mép dưới phải khớp nhau (cùng vị trí x, cùng bề rộng) để lặp không lộ chỗ ghép. |
| `song-muc-dau.svg` | `0 0 24 60` | Đầu nguồn: nét bút bắt đầu, đậm và to ở trên, thon xuống rồi nối khớp với đoạn thân. |
| `song-muc-cuoi.svg` | `0 0 24 60` | Cuối dòng: nét bút nhạt và xơ dần rồi dứt. |
| `giot-muc.svg` | `0 0 28 28` | Giọt mực đánh dấu mỗi phiên: một chấm mực tròn không đều, mép hơi loang, có một hai tia mực rất nhỏ. Tâm ở (14, 14). |

- Cả bốn hình là **mảng đặc** (`fill="currentColor"`, không viền).

---

## 9. Hoạ tiết nền — ưu tiên 5

| File | `viewBox` | Mô tả |
|---|---|---|
| `song-nuoc.svg` | `0 0 56 24` | Hoạ tiết sóng nước hình vảy kiểu khắc trên Cửu Đỉnh, **lặp được cả ngang lẫn dọc** (bốn mép khớp nhau). Chỉ có nét, độ dày 1. Web dùng rất mờ làm mặt nước phía sau tờ lịch. |
| `lich-mep-xe.svg` | `0 0 24 10` | Mép giấy xé của tờ lịch: một đoạn răng cưa không đều, **lặp ngang**. Mảng đặc. |

---

## 10. Đoạn mô tả phong cách (dán vào đầu mọi yêu cầu gửi AI)

> Single-colour SVG line illustration for the website of Ngọc Âm, a premium Vietnamese astrology and feng shui house descended from the Khâm Thiên Giám (imperial observatory) of Emperor Minh Mạng, Nguyễn dynasty, Huế. Style: the engraved reliefs on the Nine Dynastic Urns (Cửu Đỉnh) of Huế, redrawn as fine hand-engraved line work — calm, sparse, generous empty space, Zen stillness. Lines look hand-cut: slightly irregular, never perfect geometric arcs.
> Technical: pure SVG, exact viewBox as given, transparent background, every stroke uses stroke="currentColor", fill="none" unless stated, stroke-linecap and stroke-linejoin round, at most two stroke widths, one separate <path> per brush stroke in drawing order, no gradients, filters, masks, embedded images, fonts or text, coordinates rounded to one decimal.
> Never include: dragons, phoenixes, Chinese Qing motifs, red-and-gold palette, flying apsaras, Buddha or bodhisattva figures, lotus thrones, zodiac wheels, crystal balls, tarot, stars-and-moon kitsch, mystical purple, any logo, seal, signature or lettering.

Sau đoạn này, dán tiếp phần mô tả của đúng hình cần vẽ ở các mục trên.

---

## 11. Bảng kiểm trước khi giao

1. Mở file bằng trình soạn văn bản: không còn mã màu nào (`#...`, `rgb(...)`), chỉ có `currentColor`, `none` hoặc `var(--orn-fill, none)`.
2. `viewBox` đúng như ghi trong tài liệu.
3. Đổi màu chữ của trang chứa hình sang nâu đậm rồi sang be sáng: hình đổi màu theo, đọc tốt ở cả hai.
4. Thu hình xuống đúng kích thước hiển thị thực tế (la bàn 34 px, biểu tượng 40 px): nét không bết.
5. Hình lặp (`may-dai`, `song-muc-than`, `song-nuoc`, `lich-mep-xe`): xếp ba bản nối nhau, không thấy chỗ ghép.
6. La bàn: nhóm `<g id="kim">` xoay quanh tâm mà không lệch.
7. Cảnh Cửu Đỉnh: các path có `class="draw"` và `pathLength="1"`, xếp theo thứ tự vẽ.
8. Không có rồng, hình người, chữ, con dấu, logo.

## 12. Giao file

Đặt toàn bộ file `.svg` vào thư mục `public/images/vector/` của dự án (hoặc gửi cả thư mục), giữ đúng tên file như trong tài liệu. Việc gắn hình vào web và thêm hiệu ứng tự khắc do phía lập trình làm.

**Tổng cộng 27 file:** la bàn 2, cảnh Cửu Đỉnh 6, mây 3, biểu tượng 7, trục gỗ 3, dòng sông mực 4, hoạ tiết nền 2.
