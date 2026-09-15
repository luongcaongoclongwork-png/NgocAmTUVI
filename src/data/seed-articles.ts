/**
 * The 6 articles that used to be hardcoded in src/data/articles.ts, now used
 * ONLY as the one-time seed for the new SQLite-backed `articles` table (see
 * src/lib/db.ts) so the live site's content is unchanged right after the
 * cutover to the admin panel. Not imported anywhere else.
 */
export type SeedArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  body: string[];
};

export const seedArticles: SeedArticle[] = [
  {
    slug: "menh-chu-va-than-chu",
    category: "Tử vi",
    title: "Mệnh Chủ và Thân Chủ nói gì về bạn?",
    excerpt:
      "Hai ngôi sao ít được nhắc đến nhưng định hình cách bạn phản ứng trước biến động của cuộc đời.",
    readTime: "6 phút đọc",
    image: "/images/07-may-troi-hoang-lien.webp",
    body: [
      "Trong một lá số Tử Vi, phần lớn sự chú ý thường dồn vào các chính tinh ở cung Mệnh — Tử Vi, Thiên Phủ, Vũ Khúc hay Liêm Trinh. Nhưng có hai vị trí khác, ít được nhắc đến hơn, lại âm thầm định hình cách một người phản ứng trước biến động: Mệnh Chủ và Thân Chủ.",
      "Mệnh Chủ gắn với phần tính cách nền tảng, cách một người ra quyết định trong những tình huống không có ai chỉ dẫn. Thân Chủ lại gắn với cách người đó ứng xử khi hoàn cảnh thay đổi — kiên định hay linh hoạt, chủ động hay chờ đợi.",
      "Hiểu hai vị trí này không giúp bạn đoán trước một sự kiện cụ thể. Nhưng nó giúp bạn nhận ra khuynh hướng phản ứng của chính mình — và từ đó, chọn cách phản ứng phù hợp hơn, thay vì để bản năng dẫn dắt hoàn toàn.",
      "Đây cũng là một trong những điều đầu tiên được nhìn đến trong một phiên khai vấn chuyên sâu tại Ngọc Âm — không phải để phán xét tốt xấu, mà để bạn hiểu rõ hơn cách mình vẫn đang vận hành.",
    ],
  },
  {
    slug: "tinh-khong-gian-truoc-khi-tinh-tam",
    category: "Phong thuỷ",
    title: "Tịnh không gian trước khi tịnh tâm",
    excerpt: "Vì sao Phong Thuỷ bắt đầu từ việc quan sát, không phải từ việc sắp đặt vật phẩm.",
    readTime: "5 phút đọc",
    image: "/images/08-may-troi-bai-tu-long.webp",
    body: [
      "Một hiểu lầm phổ biến về Phong Thuỷ là nghĩ rằng chỉ cần đặt đúng vật phẩm, đúng hướng, mọi việc sẽ tự khắc hanh thông. Nhưng Phong Thuỷ, ở gốc rễ, là một hệ thống quan sát — trước khi là một hệ thống sắp đặt.",
      "Trước khi điều chỉnh bất cứ điều gì, người tư vấn cần quan sát: không gian được sử dụng như thế nào, ánh sáng và luồng di chuyển ra sao, con người trong đó có thói quen gì. Sắp đặt mà không quan sát dễ trở thành áp đặt một khuôn mẫu lên một hoàn cảnh không phù hợp.",
      "Tại Ngọc Âm, một buổi tư vấn Phong Thuỷ luôn bắt đầu bằng việc lắng nghe và quan sát — trước khi đưa ra bất kỳ điều chỉnh cụ thể nào. Tịnh không gian, vì vậy, là bước đầu tiên để tịnh tâm — chứ không phải điều ngược lại.",
    ],
  },
  {
    slug: "vo-thuong-va-van-han",
    category: "Phật học",
    title: "Vô thường trong cách nhìn về vận hạn",
    excerpt: "Một góc nhìn Phật học giúp việc xem vận trở nên nhẹ nhàng và chủ động hơn.",
    readTime: "7 phút đọc",
    image: "/images/15-ban-gioc-may-suong-3d.webp",
    body: [
      "Trong Phật học, vô thường không phải một điều đáng sợ — mà là một sự thật để chấp nhận và sống cùng. Không có gì đứng yên mãi mãi, kể cả những giai đoạn khó khăn nhất trong một lá số.",
      "Khi nhìn vận hạn qua lăng kính vô thường, một giai đoạn bất lợi không còn là một bản án, mà là một chu kỳ sẽ đi qua. Điều quan trọng không phải là né tránh nó bằng mọi giá, mà là hiểu rõ bản chất của nó để đi qua một cách vững vàng hơn.",
      "Cách tiếp cận này cũng là điều Ngọc Âm mang vào mỗi phiên khai vấn: không hứa hẹn xoá bỏ khó khăn, mà đồng hành để bạn nhìn rõ và đi qua nó với ít hoang mang hơn.",
    ],
  },
  {
    slug: "biet-minh-biet-thoi",
    category: "Phát triển nội lực",
    title: "Biết mình, biết thời: hai điều kiện của quyết định đúng",
    excerpt: "Nội lực không đến từ việc biết trước tương lai, mà từ việc hiểu rõ chu kỳ của chính mình.",
    readTime: "4 phút đọc",
    image: "/images/10-hoang-lien-mu-cang-chai-3d.webp",
    body: [
      "Một quyết định đúng thường không chỉ phụ thuộc vào việc bạn có đủ thông tin hay không, mà còn phụ thuộc vào việc bạn có đang ở đúng giai đoạn để hành động hay không.",
      "Biết mình là hiểu rõ điểm mạnh, điểm yếu và giới hạn thực sự của bản thân. Biết thời là nhận ra giai đoạn hiện tại phù hợp để tiến hay nên tạm chờ. Thiếu một trong hai, quyết định dễ trở nên vội vàng hoặc chần chừ quá mức.",
      "Đây là lý do vì sao khai vấn Tử Vi tại Ngọc Âm luôn gắn liền hai phần: hiểu bản chất lá số, và đối chiếu với giai đoạn vận trình hiện tại — thay vì chỉ dừng ở một trong hai.",
    ],
  },
  {
    slug: "khong-gian-song-toi-gian",
    category: "Không gian sống",
    title: "Khi tối giản trở thành một nguyên lý Phong Thuỷ",
    excerpt: "Bớt đi không có nghĩa là thiếu — đôi khi đó chính là cách không gian lấy lại sự cân bằng.",
    readTime: "5 phút đọc",
    image: "/images/17-pu-luong-som-mai-3d.webp",
    body: [
      "Phong Thuỷ truyền thống thường được hình dung gắn liền với nhiều vật phẩm, nhiều quy tắc. Nhưng trong đời sống hiện đại, một trong những điều chỉnh hiệu quả nhất lại thường là lược bớt.",
      "Một không gian bị lấp đầy quá mức — bởi đồ đạc, bởi thông tin, bởi những việc dở dang — cũng là một không gian khó để dòng khí lưu chuyển tự nhiên. Tối giản, trong Phong Thuỷ, không phải một xu hướng thẩm mỹ, mà là một cách tịnh hoá.",
      "Ngọc Âm ứng dụng nguyên lý này trong các buổi tư vấn Phong Thuỷ tối giản kết hợp lối sống — nơi việc đầu tiên thường không phải là thêm vào, mà là nhận diện điều nên bớt đi.",
    ],
  },
  {
    slug: "van-hoa-xem-ngay",
    category: "Văn hoá",
    title: "Vì sao người Việt vẫn xem ngày trước việc lớn?",
    excerpt: "Một tập quán lâu đời, nhìn từ góc độ tâm lý học hiện đại thay vì chỉ từ niềm tin dân gian.",
    readTime: "6 phút đọc",
    image: "/images/16-nho-que-ha-giang-3d.webp",
    body: [
      "Xem ngày trước việc lớn — cưới hỏi, động thổ, khai trương — là một tập quán đã tồn tại rất lâu trong văn hoá Việt. Nhìn từ góc độ hiện đại, tập quán này có thể được hiểu không chỉ như một niềm tin, mà như một nghi thức chuẩn bị tâm lý.",
      "Việc dành thời gian lựa chọn một thời điểm phù hợp buộc người trong cuộc phải dừng lại, cân nhắc kỹ hơn thay vì hành động vội vàng. Bản thân quá trình chuẩn bị ấy — không chỉ kết quả — đã mang lại giá trị.",
      "Tại Ngọc Âm, khai vấn ngày giờ Hoàng Đạo được tiếp cận theo tinh thần đó: một sự chuẩn bị chu đáo cho những việc hệ trọng, không phải một sự đảm bảo tuyệt đối về kết quả.",
    ],
  },
];
