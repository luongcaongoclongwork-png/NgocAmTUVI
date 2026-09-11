const columns = [
  {
    title: "Tử vi",
    links: ["Lập lá số", "Khai vấn chuyên sâu", "Khai vấn toàn lá số", "Xem ngày giờ đẹp"],
  },
  {
    title: "Phong thuỷ",
    links: ["Dương trạch", "Âm trạch", "Không gian sống", "Văn phòng / thương mại"],
  },
  {
    title: "Dịch vụ",
    links: ["Bảng giá", "Đặt lịch tư vấn", "Câu hỏi thường gặp"],
  },
  {
    title: "Kiến thức",
    links: ["Tử vi", "Phong thuỷ", "Phật học", "Văn hoá"],
  },
  {
    title: "Cửa hàng",
    links: ["Ngọc phỉ thuý", "Ngọc hoà điền", "Đá phong thuỷ"],
  },
  {
    title: "Về Ngọc Âm",
    links: ["Câu chuyện thương hiệu", "Đội ngũ khai vấn", "Liên hệ"],
  },
];

const social = ["TikTok", "Facebook", "Instagram", "Email"];

function SealMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="7" y1="1.4" x2="7" y2="12.6" stroke="currentColor" strokeWidth="0.8" />
      <line x1="1.4" y1="7" x2="12.6" y2="7" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-earth-brown text-ivory">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        aria-hidden="true"
      >
        <pattern id="dongson" width="64" height="64" patternUnits="userSpaceOnUse">
          <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dongson)" />
      </svg>

      <div className="relative mx-auto max-w-[1280px] px-6 pb-10 pt-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold text-gold">
                <SealMark />
              </span>
              <span className="font-heading text-lg tracking-[0.2em]">NGỌC ÂM</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
              Tử Vi, Phong Thuỷ hậu nhân Khâm Thiên Giám — vua Minh Mạng, triều
              Nguyễn. Khai vấn, định hướng và đồng hành trên hành trình hiểu
              mình.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="tracking-label text-[11px] font-semibold uppercase text-gold">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-ivory/75 transition-colors hover:text-ivory"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h4 className="tracking-label text-[11px] font-semibold uppercase text-gold">
              Kết nối
            </h4>
            <ul className="mt-4 space-y-2.5">
              {social.map((s) => (
                <li key={s}>
                  <a href="#" className="text-sm text-ivory/75 transition-colors hover:text-ivory">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ngọc Âm. Mọi quyền được bảo lưu.</p>
          <p>Nội dung Tử Vi, Phong Thuỷ mang tính tham khảo và định hướng, không thay thế quyết định của bạn.</p>
        </div>
      </div>
    </footer>
  );
}
