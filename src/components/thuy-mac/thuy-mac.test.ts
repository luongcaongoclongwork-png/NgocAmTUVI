import { describe, expect, it } from "vitest";
import { calendarLeaf, dailyLine, lunarDateLabel } from "./calendar";
import { priceNumber } from "./JsonLd";
import { bookingFor, isBareRoute } from "./nav";

describe("calendarLeaf", () => {
  it("gives the lunar date, can chi, solar term and hoàng đạo hours of a day", () => {
    const leaf = calendarLeaf(2026, 9, 30);
    expect(leaf.solar.weekday).toBe("Thứ Tư");
    expect(leaf.lunar.day).toBe(20);
    expect(leaf.lunar.month).toBe("tháng Tám");
    expect(leaf.lunar.year.vi).toBe("Bính Ngọ");
    expect(leaf.lunar.dayCC).toEqual({ vi: "Đinh Mùi", han: "丁未" });
    expect(leaf.term.name).toBe("Thu phân");
    expect(leaf.term.day).toBe(8);
    expect(leaf.term.next).toBe("Hàn lộ");
    // a Mùi day: Dần, Mão, Tỵ, Thân, Tuất, Hợi
    expect(leaf.hours.filter((h) => h.good).map((h) => h.chi)).toEqual(["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"]);
    expect(leaf.hours).toHaveLength(12);
  });

  it("dates an article the almanac way", () => {
    expect(lunarDateLabel("2026-09-30T10:00:00.000Z")).toBe("ngày 20 tháng Tám, Bính Ngọ");
  });

  it("changes the day's line from one day to the next", () => {
    expect(dailyLine(2026, 9, 30)).not.toBe(dailyLine(2026, 10, 1));
  });
});

describe("priceNumber", () => {
  it("reads the number out of a price as typed in admin", () => {
    expect(priceNumber("2.000.000")).toBe(2000000);
    expect(priceNumber("Từ 1.500.000")).toBe(1500000);
    expect(priceNumber("Liên hệ")).toBeNull();
  });
});

describe("site chrome", () => {
  it("labels the booking button per page and steps aside where it would be in the way", () => {
    expect(bookingFor("/phong-thuy")?.href).toBe("/lien-he?topic=phong-thuy");
    expect(bookingFor("/dai-chu-su")?.label).toBe("Đặt lịch Đại Chủ Sự");
    expect(bookingFor("/tu-vi")?.short).toBe("Đặt lịch Tử Vi");
    expect(bookingFor("/")?.href).toBe("/lien-he");
    expect(bookingFor("/tranh-cuon")).toBeNull();
    expect(bookingFor("/lien-he")).toBeNull();
    expect(bookingFor("/la-so/xuyen-tam-diem")).toBeNull();
  });

  it("draws no chrome on admin or the print sheet", () => {
    expect(isBareRoute("/admin/lien-he")).toBe(true);
    expect(isBareRoute("/la-so/print")).toBe(true);
    expect(isBareRoute("/tu-vi")).toBe(false);
  });
});
