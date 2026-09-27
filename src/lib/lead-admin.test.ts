import { afterEach, describe, expect, it } from "vitest";
import { csvCell, foldVietnamese, leadMatchesQuery, toCsv } from "./lead-admin";
import { formatAppointment, fromVietnamInputValue, toVietnamInputValue } from "./vn-time";
import {
  addLeadNote,
  countLeadsByStatus,
  createLead,
  deleteLead,
  getLeadDetailForAdmin,
  getUpcomingAppointments,
  setLeadAppointment,
  setLeadStatus,
} from "./contact-leads";

describe("search", () => {
  const lead = { name: "Nguyễn Thị Tráng", phone: "+84912345678", interest: "Phong Thuỷ văn phòng", message: "Đổi hướng bàn làm việc" };

  it("folds Vietnamese diacritics and đ", () => {
    expect(foldVietnamese("Đường Thuỷ ĐẸP")).toBe("duong thuy dep");
  });

  it("matches without accents, word by word, across fields", () => {
    expect(leadMatchesQuery(lead, "trang")).toBe(true);
    expect(leadMatchesQuery(lead, "phong thuy van phong")).toBe(true);
    expect(leadMatchesQuery(lead, "huong ban")).toBe(true);
    expect(leadMatchesQuery(lead, "tu vi")).toBe(false);
    expect(leadMatchesQuery(lead, "   ")).toBe(true);
  });

  it("matches phone digits in any format", () => {
    expect(leadMatchesQuery(lead, "0912 345")).toBe(true);
    expect(leadMatchesQuery(lead, "345678")).toBe(true);
    expect(leadMatchesQuery(lead, "0999")).toBe(false);
  });
});

describe("csv", () => {
  it("quotes, escapes and blocks spreadsheet formulas", () => {
    expect(csvCell('Anh "Ba"')).toBe('"Anh ""Ba"""');
    expect(csvCell("=HYPERLINK(\"x\")")).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvCell("+84912")).toBe('"\'+84912"');
    expect(csvCell("-1")).toBe('"\'-1"');
  });

  it("starts with a UTF-8 BOM and uses CRLF", () => {
    const csv = toCsv(["Tên"], [["Trang"]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toBe('﻿"Tên"\r\n"Trang"\r\n');
  });
});

describe("vietnam time", () => {
  it("round-trips datetime-local values as Vietnam time", () => {
    const iso = fromVietnamInputValue("2026-10-01T09:30");
    expect(iso).toBe("2026-10-01T02:30:00.000Z");
    expect(toVietnamInputValue(iso!)).toBe("2026-10-01T09:30");
    expect(formatAppointment(iso!)).toBe("Thứ Năm, 01/10 · 09:30");
    expect(fromVietnamInputValue("")).toBeNull();
    expect(fromVietnamInputValue("01/10/2026")).toBeNull();
  });
});

// Hits the real dev SQLite file like contact-leads.test.ts; every lead
// created here is deleted afterwards (deleteLead also removes its notes).
const created: number[] = [];
afterEach(async () => {
  for (const id of created.splice(0)) await deleteLead(id);
});

async function newLead() {
  const r = await createLead({ name: "Test Lead Admin", phone: "0987654321", interest: "Thử", message: "Tin thử cho test.", consent: "on", honeypot: "" });
  if (!r.ok) throw new Error(r.error);
  created.push(r.lead.id);
  return r.lead.id;
}

describe("lead management", () => {
  it("setting an appointment books the lead and shows it as upcoming", async () => {
    const id = await newLead();
    const soon = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    await setLeadAppointment(id, soon);
    const d = await getLeadDetailForAdmin(id);
    expect(d?.status).toBe("booked");
    expect(d?.appointmentAt).toBe(soon);
    expect((await getUpcomingAppointments(14)).some((l) => l.id === id)).toBe(true);

    await setLeadStatus(id, "closed");
    expect((await getUpcomingAppointments(14)).some((l) => l.id === id)).toBe(false);

    await setLeadAppointment(id, null);
    expect((await getLeadDetailForAdmin(id))?.appointmentAt).toBe("");
  });

  it("does not move a closed lead back to booked when an appointment is set", async () => {
    const id = await newLead();
    await setLeadStatus(id, "closed");
    await setLeadAppointment(id, new Date(Date.now() + 86400000).toISOString());
    expect((await getLeadDetailForAdmin(id))?.status).toBe("closed");
  });

  it("keeps a note history, newest first, and counts by status", async () => {
    const before = await countLeadsByStatus();
    const id = await newLead();
    await addLeadNote(id, "admin", "Gọi lần 1, chưa nghe máy.");
    await addLeadNote(id, "admin", "Gọi lần 2, hẹn thứ Bảy.");
    const d = await getLeadDetailForAdmin(id);
    expect(d?.notes.map((n) => n.body)).toEqual(["Gọi lần 2, hẹn thứ Bảy.", "Gọi lần 1, chưa nghe máy."]);
    expect(d?.noteCount).toBe(2);
    const after = await countLeadsByStatus();
    expect(after.new).toBe(before.new + 1);
    expect(after.all).toBe(before.all + 1);
  });

  it("deleteLead removes the lead and its notes", async () => {
    const id = await newLead();
    await addLeadNote(id, "admin", "x");
    await deleteLead(id);
    created.splice(created.indexOf(id), 1);
    expect(await getLeadDetailForAdmin(id)).toBeNull();
  });
});
