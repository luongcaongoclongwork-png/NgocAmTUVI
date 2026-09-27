"use server";

import { createLeadPublic } from "@/lib/contact-leads";

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

  const result = await createLeadPublic({
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    interest: service ? `${interest || "Chưa xác định"} — Gói: ${service}` : interest,
    message: String(formData.get("message") || ""),
    consent: String(formData.get("consent") || ""),
    // Hidden field real visitors never fill in — named to look plausible to bots.
    honeypot: String(formData.get("website") || ""),
  });

  if (!result.ok) return { status: "error", error: result.error };
  return { status: "success", interest: result.lead.interest };
}
