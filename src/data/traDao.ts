/**
 * Nội dung trang Trà Đạo (/tra-dao) — toàn bộ văn bản lấy nguyên văn từ nội
 * dung do chủ trang cung cấp, chỉ tách đoạn để dễ render, không diễn giải
 * lại. Xem src/app/tra-dao/page.tsx cho phần trình bày.
 */

export const khuong = {
  name: "Khương",
  title: "Trà Sư · Ngọc Âm",
  signature: "Thuận trà · Thuận thủy · Thuận thời · Thuận tâm.",
  poem: [
    "Thuận tự nhiên mà pha,",
    "tĩnh tâm mà uống.",
    "Một chén trà mở đầu câu chuyện,",
    "một khoảng lặng đưa người trở về với mình.",
  ],
  introBeforeThuan: [
    "Khương đến với trà không từ sự cầu kỳ, mà từ điều giản dị nhất: muốn giữ một chén trà được là chính nó.",
    "Không tô hương để che vị.",
    "Không chuộng hình thức để lấn át chất trà.",
    "Không lấy kỹ xảo làm điều hơn thua.",
    "Một thức trà tốt, theo Khương, trước hết phải sạch, thật và thuận tự nhiên.",
    "Trong một chén trà có khí hậu của một mùa, thổ nhưỡng của một vùng đất, nguồn nước nuôi cây, đôi tay người chăm trà và cả những tháng năm mà lá trà đã đi qua.",
    "Người pha trà chẳng phải người làm nên những điều ấy.",
    "Chỉ là người biết lùi lại một bước, để trà tự nói câu chuyện của mình.",
    "Bởi thế, Khương không xem pha trà chỉ là kỹ thuật.",
    "Nước có tính của nước.",
    "Trà có tính của trà.",
    "Ngày nắng khác ngày mưa.",
    "Tâm tĩnh khác tâm động.",
    "Biết trà mà không biết nước, chưa đủ.",
    "Biết nước mà chẳng biết thời, chưa đủ.",
    "Biết cả trà lẫn nước, mà lòng còn vội, chén trà cũng khó tròn vị.",
    "Vậy nên trong trà của Khương có một chữ:",
  ],
  thuanWord: "THUẬN",
  introAfterThuan: [
    "Thuận theo trà.",
    "Thuận theo nước.",
    "Thuận theo trời đất.",
    "Và sau cùng, thuận lại chính mình.",
    "Ấy cũng là cách Khương hiểu về Đạo trong trà:",
    "Không cưỡng trà phải thành vị mình muốn.",
    "Không ép nước phải theo ý người.",
    "Không cầu một chén nào giống một chén nào.",
    "Chỉ cần đúng thời, đúng nước, đúng trà, đúng tâm.",
    "Rồi để mọi thứ tự nhiên mà thành.",
  ],
  /** Bio rút gọn dùng cho thẻ tư vấn viên trang chủ (Consultants.tsx) — ghép
   * từ các câu nguyên văn ở trên, không thêm ý mới, chỉ vừa độ dài 2 bio kia. */
  homeBio:
    "Khương đến với trà không từ sự cầu kỳ, mà từ điều giản dị nhất: muốn giữ một chén trà được là chính nó. Không tô hương để che vị, không chuộng hình thức để lấn át chất trà. Một thức trà tốt, theo Khương, trước hết phải sạch, thật và thuận tự nhiên — mang trong mình khí hậu của một mùa, thổ nhưỡng của một vùng đất và cả những tháng năm mà lá trà đã đi qua.",
};

export const traDaoNgocAmIntro = [
  "Người xưa gặp nhau bên một ấm trà.",
  "Có chuyện đời.",
  "Có chuyện người.",
  "Có chuyện đạo.",
  "Nhưng trước khi lời cất lên, nước đã sôi, trà đã mở, hương đã lan.",
  "Một chén trà vì thế không nhất thiết để tìm điều cao xa.",
  "Đôi khi chỉ là một khoảng dừng giữa đời sống nhiều vội vã.",
  "Ngồi xuống.",
  "Rót trà.",
  "Uống chậm.",
  "Để nghe người.",
  "Để nghe mình.",
];

export const traDaoSpiritQuote = ["Thuận tự nhiên mà pha.", "Tĩnh tâm mà uống."];
export const traDaoSpiritExtra = "Chân thành mà đối đãi.";
export const traDaoSpiritClosing =
  "Bởi trà quý đến đâu, nếu giữa người với người không có chân tình, chén trà ấy cũng chỉ còn hương vị.";

export type TraDaoExperience = { title: string; desc: string[] };

export const taiQuanIntro = [
  "Không gian trà của Ngọc Âm không đặt nặng nghi thức.",
  "Trà được dùng như một khoảng tĩnh, để con người có thể ngồi gần nhau hơn, nói những câu chuyện sâu hơn và nhìn lại chính mình trong một nhịp sống chậm hơn.",
];

export const traDaoTaiQuan: TraDaoExperience[] = [
  {
    title: "Trà đàm · Phật học",
    desc: [
      "Một ấm trà, một câu chuyện về Phật pháp và đời sống.",
      "Không đặt Phật học ở nơi xa xôi, mà cùng nhau nhìn vào những điều rất gần: cách đối diện với phiền não, nhân duyên, được mất, thương ghét, tu tập và cách giữ tâm giữa đời thường.",
      "Cùng uống trà. Cùng lắng nghe. Cùng suy ngẫm. Nhưng mỗi người tự tìm câu trả lời cho mình.",
    ],
  },
  {
    title: "Trà đàm · Tử Vi",
    desc: [
      "Lấy một chén trà làm khoảng dừng để nhìn lại mệnh, vận và chính mình.",
      "Tử Vi trong không gian trà của Ngọc Âm không nhằm khiến người ta sợ tương lai hay lệ thuộc vào số mệnh. Đó là một cuộc đối thoại để hiểu: ta đang đứng ở đâu, điều gì đang vận hành quanh mình, điều gì nên tiến, điều gì nên chậm, và điều gì vốn cần được hiểu trước khi thay đổi.",
      "Trà ở giữa câu chuyện ấy để người luận không quá vội, người nghe không quá động.",
    ],
  },
  {
    title: "Trà đàm · Phong Thuỷ",
    desc: [
      "Phong thủy trước hết là câu chuyện về người và nơi người đang sống.",
      "Qua một ấm trà, cùng nhìn lại nhà cửa, môi trường, phương vị, khí vận và mối tương tác giữa con người với không gian quanh mình.",
      "Không thần bí hóa phong thủy. Cũng không xem phong thủy như một phương pháp cưỡng cầu vận số. Mà trở về với nghĩa giản dị hơn: biết nơi mình ở, biết thế mình đứng, biết thuận theo hoàn cảnh mà điều chỉnh đời sống.",
    ],
  },
  {
    title: "Trà & Chuyện Đạo",
    desc: [
      "Có những chuyện đã qua hàng trăm năm, nhưng lòng người trong đó chưa từng cũ.",
      "Những buổi trà kể chuyện về Phật học, cổ nhân, hành trình tu tập, những nhân duyên trong lịch sử và những câu chuyện tưởng đã xa nhưng vẫn có thể soi chiếu đời sống hôm nay.",
      "Không chỉ để nghe chuyện người xưa. Mà đôi khi, mượn chuyện xưa để hiểu chuyện mình.",
    ],
  },
  {
    title: "Trà & Kết Vòng Nguyện Ý",
    desc: [
      "Một buổi trải nghiệm kết hợp giữa trà và việc tự tay kết nên một vật phẩm dành cho chính mình hoặc người thân.",
      "Không đặt nặng vào sự huyền bí của vật. Điều được giữ lại là ý niệm khi làm nên nó.",
      "Một hạt được xâu qua. Một nút được kết lại. Một chén trà được uống chậm. Đều là một khoảng thời gian người ta dành sự chú tâm cho một điều mình trân quý.",
    ],
  },
];

export const traUlLanhIntro = [
  "Nếu trà đạo tại quán là một khoảng chậm, thì trà ủ lạnh của Ngọc Âm là cách đưa tinh thần ấy vào nhịp sống hiện đại.",
  "Không phải lúc nào cũng có đủ thời gian để nhóm lửa, đun nước và ngồi trọn một tuần trà.",
  "Nhưng vẫn có thể uống một thức trà sạch, thật và giữ được bản vị.",
  "Các dòng trà được lựa chọn và ủ lạnh để vị trà mở ra từ từ trong nước, hướng tới cảm giác nhẹ, thanh và tự nhiên.",
];

export type TraSanPham = { name: string; desc: string[]; image?: string; imageAlt?: string };

export const traUlLanh: TraSanPham[] = [
  {
    name: "Ý Trà",
    desc: ["Lục trà Tân Cương ủ lạnh.", "Thanh, nhẹ và trong.", "Một thức trà dành cho những lúc cần một khoảng sáng giữa ngày."],
  },
  {
    name: "Nguyện Trà",
    desc: [
      "Hồng trà Tân Cương bốn năm, ủ lạnh.",
      "Vị trà trầm hơn, mềm hơn, mang theo độ chín của thời gian.",
      "Một niệm khởi thành ý. Một ý giữ lâu thành nguyện.",
    ],
  },
  {
    name: "Sen Trà",
    desc: ["Trà sen ủ lạnh.", "Hương sen không lấy sự nồng làm quý, mà quý ở chỗ thanh mà còn, nhẹ mà sâu."],
  },
  {
    name: "Lục Trà Shan Tuyết",
    desc: ["Shan Tuyết xanh ủ lạnh.", "Từ những cây trà nơi núi cao, giữ vị khoáng, độ thanh và khí vị riêng của miền sơn cước."],
  },
  {
    name: "Hồng Trà Shan Tuyết",
    desc: ["Shan Tuyết hồng ủ lạnh.", "Ấm vị hơn, hậu sâu hơn, nhưng vẫn giữ sự mộc mạc của trà núi."],
  },
];

export const traBieuIntro = [
  "Người xưa mang trà đến thăm nhau.",
  "Không hẳn vì trà quý.",
  "Mà bởi trong một gói trà có một ý:",
];
export const traBieuQuote = "Tôi nhớ đến người.";
export const traBieuIntro2 = [
  "Trà biếu của Ngọc Âm vì vậy không lấy sự xa hoa làm trọng.",
  "Điều được chọn trước tiên vẫn là:",
];
export const traBieuCriteria = "Trà sạch. Trà thật. Nguyên vị. Và xứng đáng để trao cho một người mình quý.";

export const traBieuList: TraSanPham[] = [
  { name: "Lục trà Tân Cương", desc: [] },
  { name: "Trà Sen Tân Cương", desc: [] },
  { name: "Lục trà Shan Tuyết", desc: [] },
  { name: "Hồng trà Shan Tuyết", desc: [] },
];

export const traBieuClosing = [
  "Có những món quà đẹp bởi hình thức.",
  "Cũng có những món quà đẹp bởi giá trị.",
  "Nhưng có lẽ món quà khiến người ta nhớ lâu nhất vẫn là món quà có tâm ý của người chọn.",
  "Một hộp trà tử tế không nhất thiết phải nói nhiều. Chỉ cần người nhận mở trà, đun nước, uống một chén — và biết rằng đã có ai đó nghĩ đến mình.",
];

export const motChenTraClosing = [
  "Đến cuối cùng, trà đạo của Khương cũng không có quá nhiều điều để nói.",
  "Nước vừa thì pha.",
  "Trà mở thì rót.",
  "Khách đến thì mời.",
  "Không cầu kỳ để thành cao nhã.",
  "Không huyền bí để thành đạo vị.",
  "Chỉ mong trong một ngày nhiều tiếng động, còn có một nơi để người ta ngồi xuống bên một ấm trà.",
];

export const motChenTraVows = ["Thuận tự nhiên mà pha.", "Tĩnh tâm mà uống.", "Chân thành mà đối đãi."];
