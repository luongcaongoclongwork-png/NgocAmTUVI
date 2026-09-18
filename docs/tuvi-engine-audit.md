# Audit: Module Lập Lá Số Tử Vi (Ngọc Âm)

_Ghi lại trước khi implement, theo Bước 1–3 của quy trình đã thống nhất._

## 1. Kiến trúc hiện tại của repo

- **Stack:** Next.js 16.3.4 (App Router, Turbopack) + React 19.2.8 + TypeScript 5 (`strict: true`) + Tailwind CSS v4 (token CSS-first qua `@theme inline` trong [globals.css](../src/app/globals.css), không có `tailwind.config.js`).
- **Alias:** `@/*` → `src/*` ([tsconfig.json](../tsconfig.json)).
- **Không có state management library, không backend/DB** — đây là site marketing tĩnh, mọi nội dung là data file TS (`src/data/*.ts`) được component thuần hiển thị (pattern y hệt DTO-driven mà spec yêu cầu cho module Tử Vi).
- **Design tokens hiện có** (khác với palette ví dụ trong spec mục T):
  `--ivory #f4ebdd`, `--parchment #e8d7b9`, `--beige #d7c19c`, `--earth-brown #795a3a`, `--walnut #3e2b1e`, `--ink #25211b`, `--gold #af8a50`, `--bronze #80633e`, `--sage #7a8068`.
  Font: `Playfair Display` (`--font-heading`) + `Be Vietnam Pro` (`--font-body`), cả hai đã bật subset `vietnamese`.
  → Palette `#1A1A1A/#C0392B/#D4AF37/#F5F0E8` trong spec mục T là mood reference, **không** khớp token đang có. Theo mục A ("nếu đã có design system thì tái sử dụng"), tôi sẽ dùng token hiện có (`walnut`, `gold`, `ivory`...) khi build renderer ở Bước 7, trừ khi anh yêu cầu đổi.
- **Không có test runner nào được cài** (không Jest/Vitest trong devDependencies) — cần thêm để chạy golden test.
- **Routing liên quan:** `/tu-vi` đã tồn tại nhưng là trang giới thiệu dịch vụ khai vấn (không phải công cụ lập lá số). Nav (`Header.tsx`, `Footer.tsx`) đã có mục "Lập lá số" nhưng đang gắn nhãn "sắp ra mắt" — chưa có route `/lap-la-so`.

## 2. iztro hiện đang được dùng ở đâu

**Không có.** Không xuất hiện trong `package.json`, `package-lock.json`, hay `node_modules`. Route `/lap-la-so` chưa tồn tại. Đây là lý do module này bị hoãn lại trước đó: thử nghiệm hồi 2026‑09‑10 phát hiện bảng an sao/miếu vượng mặc định của iztro lệch với hai site benchmark Việt Nam, chưa root-cause, nên quyết định KHÔNG build page cho tới khi có Vietnamese Adapter đúng đắn — đúng như spec lần này yêu cầu.

## 3. Điểm iztro phải override để phù hợp Tử Vi Việt Nam

| Vùng | iztro mặc định | Yêu cầu Việt Nam (Tân Biên) | Xử lý |
|---|---|---|---|
| Khôi – Việt tuổi Canh | Sửu / Mùi | Ngọ / Dần | Bảng override theo Thiên Can, áp dụng sau khi nhận raw output từ iztro |
| Miếu–Vượng–Đắc–Bình–Hãm | 7 cấp (Miếu/Vượng/Đắc/Lợi/Bình/Bất/Hãm), bảng nguồn Trung Quốc | 5 cấp (Miếu/Vượng/Đắc/Bình/Hãm), bảng nguồn Tân Biên — **khác bảng gốc, không phải chỉ gộp cấp** (vd: Thiên Phủ tại Mão: iztro Đắc → VN Bình; Tử Vi tại Sửu: iztro Miếu → VN Đắc) | Bảng tra độc lập `VIETNAMESE_BRIGHTNESS_TABLE`, không derive từ field brightness của iztro |
| Tuần / Triệt | Không có khái niệm "vùng án ngữ 2 cung"; hoặc thiếu hẳn tùy version | Tuần theo Lục Giáp (tuần của năm sinh), Triệt theo Thiên Can năm sinh — mỗi cái che 2 cung liên tiếp | Tính toán riêng trong adapter, render bằng overlay, không map như sao phụ |
| Tên sao | Chữ Hán hoặc pinyin | Tên Việt hóa chuẩn (Tử Vi, Thiên Cơ, ...) | Locale map đầy đủ, fail test nếu thiếu key |
| Tứ Hóa | Có sẵn nhưng gắn theo field nội bộ của iztro | Cần bảng tường minh, data-driven, tách khỏi UI | Bảng cứng theo Thiên Can (mục E spec) |
| Cấu trúc 12 cung / vòng sao phụ (Bác Sĩ, Tràng Sinh...) | Có nhưng field name tiếng Anh/pinyin nội bộ | Cần category rõ ràng (`majorStars`, `boshi`, `changSinh`...) không gộp chung | Mapping field-by-field sang `VietnameseChartDTO` |

Nguyên tắc: iztro chỉ dùng để tính **vị trí** (cung nào chứa sao gì, Ngũ Hành Cục, Can Chi, Đại Vận/Tiểu Hạn theo tuổi) — toàn bộ **diễn giải hiển thị** (tên, độ sáng, Khôi Việt, Tuần Triệt) đi qua Vietnamese Adapter trước khi tới UI.

## 4. Danh sách file sẽ tạo (Bước 4 trở đi)

Theo đúng cấu trúc mục B của spec:

```
src/lib/tuvi/engine/{iztroAdapter,vietnameseAdapter,chartEngine}.ts
src/lib/tuvi/profiles/{iztroDefault,vietnamTanBien,ngocAm}.ts
src/lib/tuvi/rules/{palaces,majorStars,auxiliaryStars,khoiViet,fourTransformations,brightness,tuanTriet,changSinh,daiVan,tieuHan,aspects}.ts
src/lib/tuvi/locale/{vi-VN,starNames.vi,palaceNames.vi,astronomyNames.vi}.ts
src/lib/tuvi/types/VietnameseChart.ts
src/lib/tuvi/tests/{vietnameseChart.test,goldenCharts.test}.ts
components/tuvi/{TuViChart,PalaceCell,CenterPalace,AspectOverlay,TuanTrietOverlay,BirthForm}.tsx
data/tuvi/{vietnamese-brightness,star-aliases}.ts
docs/tuvi-engine-audit.md   (file này)
```

Sẽ sửa: `package.json` (thêm `iztro@2.6.1` + test runner), `Header.tsx`/`Footer.tsx` (bỏ nhãn "sắp ra mắt" cho Lập lá số — chỉ sau khi UI xong), thêm route `src/app/lap-la-so/page.tsx`.

## 5. Kế hoạch test

1. **Unit test từng rule** (`rules/*.ts`): Khôi–Việt theo 10 Thiên Can, Tứ Hóa theo 10 Thiên Can, Tuần/Triệt cho đủ 6 tuần Giáp Tý/Tuất/Thân/Ngọ/Thìn/Dần × 5 cặp Can, brightness table cho các entry đã có nguồn xác minh.
2. **Golden chart test** (`goldenCharts.test.ts`): input cố định 05/07/2000 dương lịch, 07:30 (giờ Thìn), Nam — chạy qua pipeline `iztro → vietnameseAdapter (profile ngoc-am)` và assert từng cung trong bảng benchmark ở mục Q (12 cung, 14 chính tinh + độ sáng, Khôi Việt, Tứ Hóa, Mệnh Chủ/Thân Chủ, Thân cư, Tuần/Triệt). Không hardcode ngày này trong code nguồn — chỉ dùng làm input test.
3. **So sánh 2 profile** (`vietnameseChart.test.ts`): cùng 1 input, chạy profile `iztro-default` vs `ngoc-am`, assert Khôi/Việt tuổi Canh khác nhau đúng như mục R.
4. **Báo cáo entry chưa xác minh:** với các sao/cung không nằm trong bảng benchmark đã cho, brightness sẽ đánh dấu `sourceNeeded: true` thay vì đoán — sẽ liệt kê danh sách này trong báo cáo cuối, không chặn golden test (golden test chỉ cần đúng các entry mà benchmark đã cho).
5. **Chỉ sau khi golden test PASS** mới bắt đầu Bước 7 (renderer UI) — đúng Bước 6 trong quy trình.
6. Cuối cùng: `npm run lint`, `tsc --noEmit`, test suite, `npm run build`.

## 6. Trạng thái profile / trường phái (chốt 2026-09-14)

Tài liệu này là kế hoạch viết TRƯỚC khi implement (mục 2 từng nói "chưa cài iztro, chưa có route /lap-la-so") — phần dưới đây ghi lại trạng thái THẬT của code ở thời điểm chốt, để không ai đọc lại tài liệu này rồi tưởng nhầm việc còn dang dở.

- **"Ngọc Âm" là thương hiệu, không phải một trường phái Tử Vi riêng.** `ngocAmProfile` kế thừa 100% `vietnamTanBienProfile` (`{ ...vietnamTanBienProfile, id: "ngoc-am" }`) — đây là quyết định chủ đích, đã được người phụ trách xác nhận, không phải profile "chưa làm xong". Toàn bộ UI (`LaSoResultClient.tsx`, `PrintPageClient.tsx`) chỉ gọi cố định `generateChart(input, "ngoc-am")`.
- **`vietnam-tan-bien` và `iztro-default` không phải lựa chọn cho người dùng** — hai profile này tồn tại thuần để `vietnameseChart.test.ts` so sánh output của Ngọc Âm với output gốc chưa override của iztro (chứng minh các override Khôi/Việt, độ sáng... thật sự có tác dụng). Không xây UI chọn phái xung quanh 2 id này.
- **Không có kế hoạch xây một bộ luật "Nam phái" độc lập** khác với Tân Biên. Nếu quyết định này đổi trong tương lai, cần một dự án nghiên cứu riêng (tìm nguồn Nam phái chuẩn, đối chiếu từng sao khác biệt thật sự với Tân Biên — ước tính chỉ ~10-15 sao thực sự "nhạy trường phái", không phải toàn bộ 72 sao) trước khi bật lại ý tưởng này.
- **Bảng sáng tối 6 sát tinh + Văn Xương/Văn Khúc** (`vietnamese-brightness.ts` → `MINOR_STAR_BRIGHTNESS_VI`): hoàn thiện phần lớn 2026-09-14 bằng cách đọc 16 lá số tuvi.vn có kiểm soát biến số (xem git log cho danh sách). Kình Dương, Đà La, Địa Không giờ đã xác minh 100% (đủ mọi vị trí có thể rơi vào). Văn Xương/Văn Khúc còn thiếu đúng 2 cung mỗi sao (Mão, Dậu) — không phải do chưa tìm được lá số, mà vì bản thân tuvi.vn cũng không hiện badge sáng tối ở 2 vị trí đó (xác nhận 2 lần độc lập). Địa Kiếp gần như không có dữ liệu khả dụng từ nguồn này (tuvi.vn chỉ hiện badge cho sao này 1/11 lần đọc được) — không nên tiếp tục cố lấy thêm bằng phương pháp này.

## 7. BUG đã chẩn đoán, xác minh 2 nguồn độc lập và ĐÃ SỬA: an sai vị trí Hỏa Tinh / Linh Tinh (phát hiện + sửa 2026-09-14)

Trong lúc đối chiếu bảng sáng tối (mục 6), phát hiện Hỏa Tinh và Linh Tinh **thường xuyên rơi vào cung khác nhau** giữa lá số Ngọc Âm (qua iztro) và tuvi.vn với cùng một ngày giờ sinh — không phải lỗi hiển thị độ sáng, mà là lỗi **an sao sai vị trí**.

**Nguồn gốc (đọc thẳng mã nguồn iztro):** `node_modules/iztro/lib/star/location.js`, hàm `getHuoLingIndex` (dòng 340-380). iztro chia năm sinh theo chi thành 4 nhóm tam hợp, mỗi nhóm có cung khởi (giờ Tý) riêng cho Hỏa Tinh và Linh Tinh, sau đó **luôn cộng thêm `timeIndex` (đếm thuận) cho cả hai sao, không phân biệt nhóm**.

**Đối chiếu thực nghiệm với tuvi.vn** (16 lá số, cùng ngày 15/06 dương lịch, Nam, trải đều 10 thiên can x nhiều giờ sinh khác nhau, có 2 lá số thiết kế riêng để phá vỡ tương quan năm-giờ nhằm loại trừ trùng hợp ngẫu nhiên): cung khởi điểm của iztro và tuvi.vn **giống hệt nhau** cho cả 2 sao ở cả 4 nhóm — chỉ khác nhau ở **chiều đếm** (thuận/nghịch), theo quy luật:

| Nhóm chi năm sinh | Hỏa Tinh (tuvi.vn) | Linh Tinh (tuvi.vn) |
|---|---|---|
| Dần-Ngọ-Tuất, Thân-Tý-Thìn (chi Dương) | Thuận (khớp iztro) | **Nghịch** (iztro sai) |
| Tỵ-Dậu-Sửu, Hợi-Mão-Mùi (chi Âm) | **Nghịch** (iztro sai) | Thuận (khớp iztro) |

Tức luôn có đúng 1 trong 2 sao đi nghịch, sao nào đi nghịch phụ thuộc nhóm Âm/Dương của chi năm sinh — không phải lỗi ngẫu nhiên, không phải do đọc sai lá số.

**Đối chiếu nguồn độc lập thứ 2 (tracuutuvi.com, 2026-09-14):** lập cùng 1 lá số (15/06/1985 dương lịch, 4 giờ, Nam — thuộc nhóm Tỵ-Dậu-Sửu) trên một engine hoàn toàn khác tuvi.vn. Kết quả khớp 100% với tuvi.vn ở cả vị trí lẫn độ sáng cho cả 5 sao đối chiếu được:

| Sao | tuvi.vn | tracuutuvi.com |
|---|---|---|
| Hỏa Tinh | Sửu (H) | Sửu (H) |
| Linh Tinh | Tý (H) | Tý (H) |
| Kình Dương | Thìn (Đ) | Thìn (Đ) |
| Đà La | Dần (H) | Dần (H) |
| Địa Không | Dậu (H) | Dậu (H) |

Đặc biệt Hỏa Tinh rơi đúng Sửu (chiều nghịch) ở cả hai nguồn, không phải Tỵ như công thức thuận của iztro sẽ cho ra — hai nguồn độc lập đồng thuận tuyệt đối, loại trừ khả năng trùng hợp hoặc lỗi đọc lá số ở một nguồn. Chẩn đoán ở trên được xem là ĐÃ XÁC MINH ĐỦ để tiến hành sửa.

**Hệ quả ước tính:** khoảng một nửa số lá số (tùy chi năm sinh) đang hiện sai cung của Hỏa Tinh hoặc Linh Tinh trên Ngọc Âm so với chuẩn tuvi.vn/Tân Biên.

**Trạng thái: ĐÃ SỬA (2026-09-14).** Thêm `ChartProfile.fixHuoLingDirection` (`true` cho `ngoc-am`/`vietnam-tan-bien`, `false` cho `iztro-default` — profile so sánh phải giữ nguyên bản gốc chưa override của iztro để test còn có ý nghĩa). Logic sửa nằm trong `vietnameseAdapter.ts`: với sao cần đảo chiều, tính lại cung bằng `cung_thuan_cua_iztro - 2*timeIndex` (tức trừ lùi từ chính kết quả thuận iztro đã tính, không cần chép lại bảng cung khởi của iztro) — tái sử dụng đúng cách các profile khác đã override sao (`khoiViet.ts`, `namPhaiStars.ts`). Đã có 3 test hồi quy vĩnh viễn trong `vietnameseChart.test.ts` (dùng đúng 2 lá số đã đối chiếu 2 nguồn ở trên) + chạy thử toàn bộ 12 lá số đã thu thập trong quá trình điều tra đều khớp 100%. Toàn bộ 35 test, typecheck, lint đều sạch.

## 8. Bố cục lá số: sao đè lên chữ — phương án "F" (lưới co giãn theo nội dung) + gỡ bỏ phương án "D" (2026-09-15)

Người dùng báo lỗi "sao đè lên chữ" ở lưới 4x4 hiện tại, hỏi liệu đổi khung sang chữ nhật có giúp không. Tái hiện được lỗi thật (đo bằng `getBoundingClientRect`, không suy đoán) trên cả web lẫn bản in — bản in nặng hơn nhiều (5/12 cung tràn, nặng nhất 17.5px) vì ô cung trên giấy nhỏ hơn nhiều so với màn hình.

**Tham khảo tuvi.vn:** lá số của họ dựng bằng `<table>` HTML thật, mỗi HÀNG tự co theo đúng cung nào trong hàng đó đang dày nhất — không ép 4 hàng cao bằng nhau như Ngọc Âm. Đây là gốc của phương án F.

**Đã làm (F):**
- `chartRowLayout.ts` (mới) — tính lại tỉ lệ chiều cao 4 hàng dựa trên điểm "độ dày" đã có sẵn (`paletteDensity.ts`), có baseline riêng cho hàng 2-3 (mang thêm Trung Cung) và sàn tối thiểu mỗi hàng. Thuần dữ liệu, tính trước khi vẽ — không cần đo DOM runtime.
- Viết lại toán học của `StructuralGridSVG.tsx` (đường kẻ lưới), `AspectOverlay.tsx` (đường tam hợp/xung chiếu/giáp cung), `TuanTrietOverlay.tsx` (nhãn Tuần/Triệt) để nhận biên hàng THẬT thay vì giả định 4 hàng đều 25% — đã kiểm chứng trực quan trên web, đường vẽ đúng vị trí.
- **Phát hiện phụ quan trọng, đã sửa luôn:** công thức tính độ dày cho cung "Vô Chính Diệu" (0 chính tinh) điểm 0 ở phần chính tinh dù dòng chữ thay thế vẫn chiếm chỗ — khiến cung dày sao bị xếp nhầm mức "normal" (không được co chữ). Sửa: tính điểm với `max(majorCount, 1)`. Tự nó đã sửa được một lỗi tràn 21px trên web (cung Quan Lộc, lá số "Lê Văn Đức").
- **Bật cho web, TẮT cho bản in.** Test chéo nhiều lá số phát hiện: phương án F giúp rõ rệt lá số "Trang" (17.5px→10.8px trên in) nhưng lại làm NẶNG HƠN một lá số cực đoan khác ("Lê Văn Đức", năm xem = năm sinh: 22.3px→30px, thêm 3 cung tràn mới) — vì tổng ngân sách chiều cao trên A4 quá chật, giật chỗ từ hàng này bù hàng khác có thể phản tác dụng. Bản in do đó CHỈ nhận phần sửa điểm-độ-dày (luôn có lợi, không có ca nào xấu đi), KHÔNG nhận phần lưới co giãn — xem comment trong `PrintChart.tsx`.
- Có 12 test tạm (không giữ lại) xác nhận 12/12 lá số đã thu thập trong phiên đều đúng như kỳ vọng trên web.

**Đã làm rồi GỠ (D):** ban đầu làm thêm modal "xem chi tiết cung" khi bấm vào cung trên desktop (giống mobile đã có), nhưng sau khi thấy lưới co giãn (F) đã đủ rõ, người dùng yêu cầu bỏ — thấy thừa. Đã gỡ sạch (`PalaceDetailModal.tsx` xoá, `TuViChart.tsx` trả về hành vi bấm-để-tô-đậm tam hợp như cũ).

**Còn tồn đọng (không thuộc phạm vi hôm nay):** bản in vẫn còn ca tràn thật với lá số/năm xem cực đoan (ví dụ Mệnh có 2 chính tinh cùng lúc) — cần một trong hai hướng đã nêu từ đầu: đo chiều cao thật (không chỉ ước lượng theo số lượng sao) hoặc bớt nội dung hiển thị ở cung quá dày. Chưa làm hôm nay.

## 9. Bản in: sao lưu biến mất / sao bị đẩy thấp hơn — ĐÃ SỬA bằng "F" (bật lại cho in) + đo-rồi-co per-cell (2026-09-19)

Người dùng báo (trên `/la-so/print`) một cung có 2 chính tinh cạnh nhau (VD Vũ Khúc + Thiên Tướng) bị đẩy thấp hơn cung khác cùng hàng, và khối "Lưu" của một cung khác biến mất hẳn. Xác nhận đúng 2 cơ chế đã nêu ở mục 8: (1) `.palace-main-stars` tự xuống 2 dòng khi 2 chính tinh + trạng thái + tứ hóa không vừa 1 dòng, đẩy mọi thứ bên dưới xuống theo; (2) `.tuvi-palace` bản in có `overflow:hidden` + `flex-shrink:0` trên mọi khối nội dung — cung nào tổng nội dung cao hơn ô cố định sẽ bị cắt thật, khối "Lưu" (nằm cuối cùng trước footer) mất trước tiên.

**Đã làm — kết hợp 2 lớp thay vì chọn 1:**
1. **Bật lại phương án F cho bản in** (`PrintChart.tsx` giờ truyền `useVariableRowHeights`, gỡ bỏ giới hạn "chỉ web" đã ghi ở mục 8) — không còn đứng một mình như lần trước, nên ca "Lê Văn Đức" (từng bị NẶNG HƠN khi bật F một mình) giờ được lớp 2 dưới đây bắt lại thay vì tràn thật.
2. **`usePrintOverflowGuard.ts` (mới)** — sau khi trang render xong với font thật (đợi `document.fonts.ready`), đo `scrollHeight` so với `clientHeight` thật của từng ô cung; ô nào vẫn tràn thì tự co riêng ô đó qua biến CSS `--pz-scale` (in.css: mọi cỡ chữ sao/nhãn + khoảng cách dọc trong ô đều nhân với biến này) — từng bước nhỏ tới khi vừa khít hoặc chạm sàn 0.78 (vẫn đọc được). Đây chính là hướng "đo chiều cao thật" đã nêu ở mục 8 nhưng chưa làm khi đó.
3. Gate cả 2 đường xuất bản in vào lớp đo này: `/la-so/print?autoprint=1` (đợi `onOverflowGuardSettled` mới gọi `window.print()`) và nút "Xuất PDF" trên `/la-so` (đợi cùng cờ, có trần 3s phòng lỗi) — cả hai đều dùng chung `A4TuViPrintRenderer`, không tách riêng.

**Test:** 26+ lá số khác nhau (nhiều ca `năm xem = năm sinh` — đúng loại từng làm F một mình bị NẶNG HƠN ở mục 8 — trải dài 1950-2010, cả 2 giới, cả dương/âm lịch, tên rất dài, giờ qua nửa đêm) đo trực tiếp `scrollHeight` vs `clientHeight` sau khi lớp đo chạy xong: **0px tràn ở mọi ca**, một số ô thực sự cần co (đã xác nhận qua `--pz-scale` < 1, có ca xuống tới 0.88) — tức lớp an toàn có hoạt động thật, không phải không làm gì. Bắt được và sửa luôn 1 lỗi trong lúc test: vòng lặp co dùng ngưỡng dung sai `+1px` khiến 1 ca dừng lại sớm với đúng 1px dư — bỏ dung sai, dùng so sánh chặt `scrollHeight > clientHeight`. `tsc`/`lint`/`npm test` (35/35) sạch trong suốt.
