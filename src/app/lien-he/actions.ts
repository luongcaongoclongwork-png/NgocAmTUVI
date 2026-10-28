"use server";

import { after } from "next/server";
import { createLeadPublic } from "@/lib/contact-leads";
import { notifyNewLead } from "@/lib/lead-notify";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "success"; interest: string };

export async function submitLeadAction(
  _prev: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  // The package picked on a service card (hidden field), recorded alongside
  // the topic so the lead says exactly what was asked about. No schema
  // change: validateLeadInput already caps interest at 200 characters.
  const interest = String(formData.get("interest") || "");
  const service = String(formData.get("service") || "").trim().slice(0, 120);
  // A tea or a piece picked on its own page, carried the same way.
  const item = String(formData.get("item") || "").trim().slice(0, 120);
  const picked = service ? `Gói: ${service}` : item ? `Món: ${item}` : "";

  const result = await createLeadPublic({
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    interest: picked ? `${interest || "Chưa xác định"} — ${picked}` : interest,
    message: String(formData.get("message") || ""),
    consent: String(formData.get("consent") || ""),
    // Hidden field real visitors never fill in — named to look plausible to bots.
    honeypot: String(formData.get("website") || ""),
  });

  if (!result.ok) return { status: "error", error: result.error };

  // Ping the admin (Telegram) after the visitor already has their reply;
  // a slow or failing notification can never cost us the lead.
  const lead = result.lead;
  after(() => notifyNewLead(lead));

  return { status: "success", interest: lead.interest };
}
