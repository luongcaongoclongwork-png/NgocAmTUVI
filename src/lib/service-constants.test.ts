import { describe, expect, it } from "vitest";
import { formatPrice } from "./service-constants";

describe("formatPrice", () => {
  it("adds đ after a number, keeping any wording the admin typed", () => {
    expect(formatPrice("2.000.000")).toBe("2.000.000 đ");
    expect(formatPrice("Từ 1.500.000")).toBe("Từ 1.500.000 đ");
    expect(formatPrice(" 500.000 ")).toBe("500.000 đ");
  });

  it("leaves prices without a number, or already with a currency, as typed", () => {
    expect(formatPrice("Liên hệ")).toBe("Liên hệ");
    expect(formatPrice("700.000 đ")).toBe("700.000 đ");
    expect(formatPrice("700.000 VNĐ")).toBe("700.000 VNĐ");
  });
});
