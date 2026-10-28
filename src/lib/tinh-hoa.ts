/**
 * Bản Đồ Tịnh Hoá Phong Thuỷ: Thầy Tịnh draws one card for each of the eight directions of a home, and the map
 * reads what each place asks for. Source: the owner's "pháp phong thuỷ" Word file (meaning by rank; the suit is
 * shown only, except 7 Cơ). The wording keeps the source's meaning point by point, said more gently (2026-10-27).
 */

export type Huong = "dong" | "dong-nam" | "nam" | "tay-nam" | "tay" | "tay-bac" | "bac" | "dong-bac";
/**
 * The owner's orientation: Đông at the top, Nam on the right, Tây at the bottom, Bắc on the left; the diagonals
 * sit between them. `goc` is the compass angle on screen, clockwise from the top.
 */
export const HUONG: { id: Huong; ten: string; goc: number; o: [number, number] }[] = [
  { id: "dong", ten: "Đông", goc: 0, o: [2, 1] },
  { id: "dong-nam", ten: "Đông Nam", goc: 45, o: [3, 1] },
  { id: "nam", ten: "Nam", goc: 90, o: [3, 2] },
  { id: "tay-nam", ten: "Tây Nam", goc: 135, o: [3, 3] },
  { id: "tay", ten: "Tây", goc: 180, o: [2, 3] },
  { id: "tay-bac", ten: "Tây Bắc", goc: 225, o: [1, 3] },
  { id: "bac", ten: "Bắc", goc: 270, o: [1, 2] },
  { id: "dong-bac", ten: "Đông Bắc", goc: 315, o: [1, 1] },
]; // o: [column, row] in a 3 × 3 grid, centre [2, 2] is the logo

export type Chat = "co" | "ro" | "bich" | "nhep";
export const CHAT: { id: Chat; ten: string; ky: string; son: boolean }[] = [
  { id: "co", ten: "Cơ", ky: "♥", son: true },
  { id: "ro", ten: "Rô", ky: "♦", son: true },
  { id: "bich", ten: "Bích", ky: "♠", son: false },
  { id: "nhep", ten: "Nhép", ky: "♣", son: false },
];

export type Hang = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
export const HANG: Hang[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
export const HANG_TEN: Record<Hang, string> = { "2": "Hai", "3": "Ba", "4": "Bốn", "5": "Năm", "6": "Sáu", "7": "Bảy", "8": "Tám", "9": "Chín", "10": "Mười", J: "J", Q: "Q", K: "K", A: "Át" };

export type Nghia = { chu: string; tinhChat: string; nen: string; tranh?: string };
/** What the place of each rank asks for. chu: the one-word key shown on the map (Ngọc Âm's, draft). */
export const NGHIA: Record<Hang, Nghia> = {
  A: { chu: "Che chắn", tinhChat: "Chỗ này thường có lỗ hổng nên cần được che chắn.", nen: "Đặt gương hình chữ nhật hoặc hình vuông.", tranh: "Không đặt gương tròn." },
  "2": { chu: "Kho", tinhChat: "Chỗ này mang ý nghĩa của cái kéo, không hợp để bày đồ, nên dùng làm kho.", nen: "Để được đồ sắc nhọn, hoặc đặt tủ bếp." },
  "3": { chu: "Minh bạch", tinhChat: "Chỗ này như có con mắt âm dương nhìn vào, việc gì làm khuất tất ở đây cũng dễ bị phát hiện. Đây nên là nơi an toàn nhất trong nhà.", nen: "Đặt vật phong thuỷ mang tính răn đe, trấn giữ.", tranh: "Tránh làm việc khuất tất ở khu vực này." },
  "4": { chu: "Sinh sôi", tinhChat: "Chỗ này mang ý nghĩa sinh sản, sinh sôi, rất hợp cho phụ nữ ở.", nen: "Để vật phong thuỷ có đôi có cặp để sinh sôi nảy nở.", tranh: "Không đặt dao, búa." },
  "5": { chu: "Giữ sức", tinhChat: "Đây là khu vực yếu, cần để ý đến sức khỏe. Bước chân đi vào khu vực này cần được che chở.", nen: "Trải bạt hoặc thảm lên sàn; treo tràng hạt hay vòng lớn.", tranh: "Giữ kín đáo, tránh đóng mở cửa nhiều ở đây." },
  "6": { chu: "Thông gió", tinhChat: "Chỗ này cần mát, cần lạnh, hơi khô một chút. Khí ở đây dễ trơn trượt, ẩm ướt, và là nơi khí âm hay tụ lại.", nen: "Giữ cho có gió lùa; hợp để đồ gỗ.", tranh: "Tránh để xe cộ ở đây." },
  "7": { chu: "Vượt lên", tinhChat: "Chỗ này mang hình chim muông, tức là bậc thang: có một trở ngại cần theo đó mà bước lên. Hợp với hình ảnh sóng nước.", nen: "Rất dễ an vị Thần Tài ở đây." },
  "8": { chu: "Tụ khí", tinhChat: "Chỗ này rất sáng, nên nhà khó tụ khí.", nen: "Làm cho kín đáo để tụ khí; nếu có hoa, chọn hoa màu trầm, đậm." },
  "9": { chu: "Thanh sạch", tinhChat: "Chỗ này như sợi lông, sợi kim tuyến hay lá cỏ mỏng thưa: nhà dễ bám bụi.", nen: "Giữ sạch, và đặt vật phong thuỷ chuyên về quả." },
  "10": { chu: "Gia đạo", tinhChat: "Chỗ này liên quan đến gia đình, nhà dễ có lời qua tiếng lại. Có thể có người không thiện cảm với mình, nên cần giữ hoà khí.", nen: "Đặt vật phong thuỷ cho gia đình yên vui, ấm cúng; trồng cây hoặc làm vườn; có thể đặt thêm bùa trấn.", tranh: "Làm lễ tùy tiện ở đây thường không được việc." },
  J: { chu: "Sự nghiệp", tinhChat: "Chỗ này trợ cho người đàn ông trong nhà.", nen: "Đặt vật phong thuỷ theo học hành, sự nghiệp." },
  Q: { chu: "Tâm linh", tinhChat: "Chỗ này mang ý nghĩa xuyên thấu, trong suốt, thường là nơi tâm linh, và nên ở chỗ cao nhất trong nhà.", nen: "Vật phong thuỷ đặt ở đây phải thật cao cấp; nếu không thì thôi, không đặt." },
  K: { chu: "Cân bằng", tinhChat: "Chỗ này dễ mất cân bằng, mất thăng bằng, khập khiễng.", nen: "Đặt vật phong thuỷ cân bằng, dạng hình tròn.", tranh: "Không hợp để đông người ở đây." },
};
/** The one suit note in the source: 7 Cơ. */
export const GHI_CHU_CHAT: Partial<Record<`${Hang}-${Chat}`, string>> = {
  "7-co": "Nếu đang có sẵn tượng hay tranh nào nhìn chằm chằm vào nhà, nên bỏ đi.",
};

export type La = { hang: Hang; chat: Chat };
export type BanDo = { ten: string; ngaySinh: string; diaChi: string; la: Record<Huong, La> };
export const laKey = (l: La) => `${l.hang}-${l.chat}` as const;
export const laTen = (l: La) => `${l.hang === "A" ? "Át" : l.hang} ${CHAT.find((c) => c.id === l.chat)!.ten}`;

/** The map travels from the form to its page in sessionStorage only: it never leaves the device. */
const KEY = "ngocam-ban-do-tinh-hoa";
export function luuBanDo(b: BanDo) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(b));
  } catch {}
}
export function docBanDo(): BanDo | null {
  try {
    const b = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as BanDo | null;
    return b && b.la && HUONG.every((h) => b.la[h.id]) ? b : null;
  } catch {
    return null;
  }
}

/**
 * The last maps Thầy Tịnh made, kept on this device only (localStorage), so a map survives closing the tab.
 * Nothing is sent anywhere; clearing the browser's site data removes them.
 */
export type BanDoLuu = { id: string; lapLuc: string; banDo: BanDo };
const GAN_DAY = "ngocam-ban-do-gan-day";
const GAN_DAY_MAX = 12;
export function docGanDay(): BanDoLuu[] {
  try {
    const list = JSON.parse(localStorage.getItem(GAN_DAY) ?? "[]") as BanDoLuu[];
    return Array.isArray(list) ? list.filter((x) => x?.banDo?.la && HUONG.every((h) => x.banDo.la[h.id])) : [];
  } catch {
    return [];
  }
}
/** Saves a map at the top of the list; the same home and cards replace their older copy. */
export function luuGanDay(b: BanDo): BanDoLuu[] {
  const sig = (x: BanDo) => `${x.ten}|${x.diaChi}|${HUONG.map((h) => laKey(x.la[h.id])).join(",")}`;
  const item: BanDoLuu = { id: String(Date.now()), lapLuc: new Date().toISOString(), banDo: b };
  const list = [item, ...docGanDay().filter((x) => sig(x.banDo) !== sig(b))].slice(0, GAN_DAY_MAX);
  try {
    localStorage.setItem(GAN_DAY, JSON.stringify(list));
  } catch {}
  return list;
}
export function xoaGanDay(id: string): BanDoLuu[] {
  const list = docGanDay().filter((x) => x.id !== id);
  try {
    localStorage.setItem(GAN_DAY, JSON.stringify(list));
  } catch {}
  return list;
}
