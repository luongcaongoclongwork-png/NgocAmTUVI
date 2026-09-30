import { Solar } from "lunar-typescript";
import { HEAVENLY_STEM_VI, EARTHLY_BRANCH_VI } from "@/lib/tuvi/locale/astronomyNames.vi";

/**
 * "Tờ lịch hôm nay" for the Khâm Thiên Giám draft: the lunar date, can chi,
 * solar term and the six auspicious (hoàng đạo) hours of a Vietnam-time day.
 *
 * Uses lunar-typescript (already a dependency via iztro). It computes the
 * Chinese (GMT+8) calendar; the known Vietnam/China divergences are rare
 * historical dates (see src/lib/tuvi/rules/vietnamChinaCalendarOverride.ts),
 * none in the current years.
 */

const MONTHS = ["Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười Một", "Chạp"];
const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

/** 24 solar terms: Vietnamese name and one plain line about the season. */
const TERMS: Record<string, { vi: string; note: string }> = {
  小寒: { vi: "Tiểu hàn", note: "Rét nhẹ đầu tiên của cuối năm; ngày bắt đầu dài ra." },
  大寒: { vi: "Đại hàn", note: "Đỉnh rét của năm, trước khi xuân về." },
  立春: { vi: "Lập xuân", note: "Bắt đầu mùa xuân theo lịch tiết khí." },
  雨水: { vi: "Vũ thủy", note: "Mưa xuân bắt đầu, đất ấm dần." },
  惊蛰: { vi: "Kinh trập", note: "Sấm đầu mùa, muôn loài thức dậy sau mùa đông." },
  春分: { vi: "Xuân phân", note: "Ngày và đêm dài bằng nhau, giữa mùa xuân." },
  清明: { vi: "Thanh minh", note: "Trời trong, khí sáng; mùa tảo mộ, nhớ về nguồn cội." },
  谷雨: { vi: "Cốc vũ", note: "Mưa rào cho lúa mạ, cuối mùa xuân." },
  立夏: { vi: "Lập hạ", note: "Bắt đầu mùa hè." },
  小满: { vi: "Tiểu mãn", note: "Hạt lúa bắt đầu chắc, nắng lên." },
  芒种: { vi: "Mang chủng", note: "Mùa gieo trồng của lúa có râu hạt." },
  夏至: { vi: "Hạ chí", note: "Ngày dài nhất trong năm, giữa mùa hè." },
  小暑: { vi: "Tiểu thử", note: "Nóng nhẹ, mở đầu những ngày oi." },
  大暑: { vi: "Đại thử", note: "Đỉnh nóng của năm." },
  立秋: { vi: "Lập thu", note: "Bắt đầu mùa thu theo lịch tiết khí." },
  处暑: { vi: "Xử thử", note: "Hết nóng, trời dịu dần." },
  白露: { vi: "Bạch lộ", note: "Sương sớm trắng trên cỏ, đêm mát hơn." },
  秋分: { vi: "Thu phân", note: "Ngày và đêm dài bằng nhau, giữa mùa thu." },
  寒露: { vi: "Hàn lộ", note: "Sương lạnh, trời vào thu sâu." },
  霜降: { vi: "Sương giáng", note: "Sương muối bắt đầu xuống, cuối thu." },
  立冬: { vi: "Lập đông", note: "Bắt đầu mùa đông." },
  小雪: { vi: "Tiểu tuyết", note: "Lạnh dần, phương bắc có tuyết nhẹ." },
  大雪: { vi: "Đại tuyết", note: "Lạnh sâu, ngày ngắn." },
  冬至: { vi: "Đông chí", note: "Đêm dài nhất trong năm; từ đây ngày dài ra." },
};

const HOUR_RANGE: Record<string, string> = {
  Tý: "23–1", Sửu: "1–3", Dần: "3–5", Mão: "5–7", Thìn: "7–9", Tỵ: "9–11",
  Ngọ: "11–13", Mùi: "13–15", Thân: "15–17", Dậu: "17–19", Tuất: "19–21", Hợi: "21–23",
};
const BRANCH_ORDER = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function canChi(ganZhi: string) {
  const [g, z] = [...ganZhi];
  return { vi: `${HEAVENLY_STEM_VI[g] ?? g} ${EARTHLY_BRANCH_VI[z] ?? z}`, han: ganZhi };
}

/** Today's date parts in Vietnam time. */
export function vietnamToday(now = new Date()): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const [y, m, d] = parts.split("-").map(Number);
  return { y, m, d };
}

export function calendarLeaf(y: number, m: number, d: number) {
  const solar = Solar.fromYmd(y, m, d);
  const lunar = solar.getLunar();
  const month = lunar.getMonth();

  const prev = lunar.getPrevJieQi(true);
  const next = lunar.getNextJieQi(true);
  const prevSolar = prev.getSolar();
  const dayOfTerm = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(prevSolar.getYear(), prevSolar.getMonth() - 1, prevSolar.getDay())) / 86400000) + 1;
  const nextSolar = next.getSolar();

  // getTimes(): 13 two-hour periods from 00:00; the last "Tý" (23:00) belongs to tomorrow.
  const hours = lunar
    .getTimes()
    .slice(0, 12)
    .map((t) => {
      const chi = EARTHLY_BRANCH_VI[t.getZhi()] ?? t.getZhi();
      return { chi, range: HOUR_RANGE[chi], good: t.getTianShenLuck() === "吉" };
    })
    .sort((a, b) => BRANCH_ORDER.indexOf(a.chi) - BRANCH_ORDER.indexOf(b.chi));

  return {
    solar: { weekday: WEEKDAYS[solar.getWeek()], d, m, y },
    lunar: {
      day: lunar.getDay(),
      month: `tháng ${MONTHS[Math.abs(month) - 1]}${month < 0 ? " nhuận" : ""}`,
      year: canChi(lunar.getYearInGanZhi()),
      monthCC: canChi(lunar.getMonthInGanZhi()),
      dayCC: canChi(lunar.getDayInGanZhi()),
    },
    term: {
      name: TERMS[prev.getName()]?.vi ?? prev.getName(),
      note: TERMS[prev.getName()]?.note ?? "",
      day: dayOfTerm,
      next: TERMS[next.getName()]?.vi ?? next.getName(),
      nextDate: `${nextSolar.getDay()}/${nextSolar.getMonth()}`,
    },
    hours,
  };
}

export type CalendarLeaf = ReturnType<typeof calendarLeaf>;

/** "ngày 3 tháng Tám, Bính Ngọ" — used to date articles the almanac way. */
export function lunarDateLabel(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "";
  const lunar = Solar.fromYmd(y, m, d).getLunar();
  const month = lunar.getMonth();
  return `ngày ${lunar.getDay()} tháng ${MONTHS[Math.abs(month) - 1]}${month < 0 ? " nhuận" : ""}, ${canChi(lunar.getYearInGanZhi()).vi}`;
}

/**
 * One line for the day, in Ngọc Âm's voice (draft copy for the owner to
 * review — later editable in admin). Picked by day number so it changes daily.
 */
const DAILY_LINES = [
  "Biết mình trước, rồi mới biết thời.",
  "Nước không tranh với núi; nước tìm đường vòng và vẫn ra tới biển.",
  "Một căn phòng gọn gàng là lời mời tâm trí ngồi xuống.",
  "Điều bất như ý thường là chỗ bài học đang đứng chờ.",
  "Chậm lại một nhịp cũng là một cách đi tiếp.",
  "Không có vận hạn nào đứng yên mãi; mọi giai đoạn đều đi qua.",
  "Hiểu rõ điều mình muốn giữ, rồi mới quyết điều mình sẵn lòng buông.",
  "Người cầm lái vững không phải vì biển lặng, mà vì biết mình đang ở đâu.",
  "Thuận thế không phải buông xuôi; là chọn đúng lúc để dùng sức.",
  "Tịnh không gian trước, rồi tịnh tâm sẽ dễ hơn.",
  "Diệm Bản cho thấy ngọn lửa sẵn có; giữ lửa là việc của mỗi người.",
  "Một câu hỏi đúng đáng giá hơn mười lời đoán trước.",
  "Hôm nay làm tròn một việc nhỏ, ngày mai sẽ nhẹ hơn.",
  "Nơi ở phản chiếu người ở; sửa nơi ở cũng là soi lại mình.",
  "Khi chưa rõ đường, hãy nhìn lại nguồn.",
  "Sự vững vàng đến từ hiểu mình, không đến từ chắc chắn về tương lai.",
  "Ai cũng có mùa gieo và mùa gặt; đừng đòi gặt giữa mùa gieo.",
  "Lắng nghe người khác bắt đầu từ việc lắng nghe chính mình.",
  "Điều hợp với người này chưa chắc hợp với người kia; hiểu mình để chọn đúng.",
  "Một chén trà ngon cần nước sạch, lửa vừa và lòng không vội.",
  "Khó khăn chưa hẳn là dấu hiệu sai đường; đôi khi là dấu hiệu đang lên dốc.",
  "Giữ lời hứa với chính mình là nền của mọi thịnh vượng.",
  "Mỗi quyết định lớn đều bắt đầu bằng một lần dừng lại.",
  "Nhìn trực diện vấn đề, rồi vấn đề sẽ bớt lớn.",
  "Hài hoà không phải không có khác biệt; là các khác biệt tìm được chỗ đứng.",
  "Không vội kết luận về người, cũng đừng vội kết luận về mình.",
  "Biết đủ ở hôm nay để còn sức cho ngày mai.",
  "Mọi dòng sông đều có khúc quanh; khúc quanh làm nên phù sa.",
  "Đổi hướng không phải thất bại; đi sai mà không dừng mới đáng lo.",
  "Sáng ra mở cửa cho gió vào, cũng là mở lòng cho điều mới.",
];

export function dailyLine(y: number, m: number, d: number): string {
  const n = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  return DAILY_LINES[n % DAILY_LINES.length];
}
