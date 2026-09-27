/**
 * Shared "Chú giải thuật ngữ" copy for the Tử Vi Xuyên Tam Diệm brand
 * language, sourced verbatim from Ngọc Âm's printed price menus. Used by
 * both /tu-vi (BASE_GLOSSARY_TERMS) and /dai-chu-su (BASE + DAI_CHU_SU_TERM).
 */
import type { Pillar } from "@/components/PhilosophyPillars";

export const BASE_GLOSSARY_TERMS: Pillar[] = [
  {
    word: "Tử Vi Xuyên Tam Diệm",
    desc: "Phương pháp luận giải Tử Vi của Ngọc Âm. Dùng Diệm Bản để thấu hiểu bản thân và tự chọn hướng đi. Xuyên vấn, định hướng, phát triển nội lực, chuyển hoá điều bất như ý.",
  },
  {
    word: "Xuyên vấn (川問)",
    desc: "Cách Ngọc Âm định nghĩa phương pháp luận giải. \"Xuyên\" là dòng sông. \"Vấn\" là tìm hiểu, xem xét, luận giải liền mạch, nhìn trực diện vấn đề.",
  },
  {
    word: "Diệm Bản (焰版)",
    desc: "Cách Ngọc Âm định nghĩa lá số. \"Diệm\" là ngọn lửa, tượng trưng cho năng lượng nội tại. \"Bản\" là tấm bản đồ. Diệm Bản cho thấy những điều sẵn có trong mỗi người, để hiểu mình và sống thuận với mình, không phải để phó mặc cho số mệnh.",
  },
  {
    word: "Xuyên giả (川者)",
    desc: "Người thực hiện phiên Xuyên vấn, luận giải Diệm Bản cùng Chủ Sự bằng sự am tường về Tử vi Xuyên Tam Diệm.",
  },
  {
    word: "Chủ Sự (主事)",
    desc: "Người đến Xuyên vấn, người làm chủ chính việc của mình.",
  },
];

export const DAI_CHU_SU_TERM: Pillar = {
  word: "Đại Chủ Sự (大主事)",
  desc: "Người làm chủ và cầm lái doanh nghiệp. \"Đại\" không nằm ở quy mô cơ nghiệp, mà ở tầm vóc bên trong của người cầm lái. \"Chủ\" là người chịu trách nhiệm sau cùng cho những quyết định lớn. \"Sự\" là cơ nghiệp vận hành xung quanh chủ nhân tâm.",
};
