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
