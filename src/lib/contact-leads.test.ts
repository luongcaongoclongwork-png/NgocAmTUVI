import { afterEach, describe, expect, it } from "vitest";
import { getDb } from "./db";
import { createLead, getLeadByIdForAdmin, updateLeadStatus } from "./contact-leads";
import type { LeadFormInput } from "./contact-leads-constants";

// These hit the project's real SQLite file (data/articles.db, same as dev —
// there's no separate test DB in this project's architecture). Every test
// deletes its own rows in afterEach so the dev database isn't left polluted.
const insertedIds: number[] = [];

afterEach(() => {
  if (insertedIds.length === 0) return;
  const db = getDb();
  const del = db.prepare("DELETE FROM contact_leads WHERE id = ?");
  for (const id of insertedIds.splice(0)) del.run(id);
});

function validInput(overrides: Partial<LeadFormInput> = {}): LeadFormInput {
  return {
    name: "Lê Thị C",
    phone: "0987654321",
    interest: "Không gian sống hoặc nơi làm việc",
    message: "Tôi muốn xem lại bố cục phòng khách.",
    consent: "on",
    honeypot: "",
    ...overrides,
  };
}

describe("createLead", () => {
  it("inserts a valid lead with status 'new' and returns it", async () => {
    const result = await createLead(validInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    insertedIds.push(result.lead.id);

    expect(result.lead.status).toBe("new");
    expect(result.lead.adminNote).toBe("");
    expect(result.lead.name).toBe("Lê Thị C");
    expect(result.lead.phone).toBe("0987654321");
    expect(result.lead.consent).toBe(true);

    const reloaded = await getLeadByIdForAdmin(result.lead.id);
    expect(reloaded).not.toBeNull();
    expect(reloaded?.interest).toBe("Không gian sống hoặc nơi làm việc");
  });

  it("rejects invalid input without touching the database", async () => {
    const before = (await getDb().prepare("SELECT COUNT(*) AS n FROM contact_leads").get()) as {
      n: number;
    };
    const result = await createLead(validInput({ phone: "not-a-phone" }));
    expect(result.ok).toBe(false);
    const after = (await getDb().prepare("SELECT COUNT(*) AS n FROM contact_leads").get()) as {
      n: number;
    };
    expect(after.n).toBe(before.n);
  });

  it("rejects a submission with no consent", async () => {
    const result = await createLead(validInput({ consent: undefined }));
    expect(result.ok).toBe(false);
  });
});

describe("updateLeadStatus", () => {
  it("transitions a lead's status and saves the admin note", async () => {
    const created = await createLead(validInput());
    if (!created.ok) throw new Error("setup failed");
    insertedIds.push(created.lead.id);

    const updated = await updateLeadStatus(created.lead.id, "contacted", "Đã gọi, hẹn lại chiều mai.");
    expect(updated.status).toBe("contacted");
    expect(updated.adminNote).toBe("Đã gọi, hẹn lại chiều mai.");
    expect(() => new Date(updated.updatedAt).toISOString()).not.toThrow();

    const reloaded = await getLeadByIdForAdmin(created.lead.id);
    expect(reloaded?.status).toBe("contacted");
  });

  it("walks through the full status lifecycle", async () => {
    const created = await createLead(validInput());
    if (!created.ok) throw new Error("setup failed");
    insertedIds.push(created.lead.id);

    const sequence = ["contacted", "discussing", "booked"] as const;
    for (const status of sequence) {
      const updated = await updateLeadStatus(created.lead.id, status, "");
      expect(updated.status).toBe(status);
    }
  });
});
