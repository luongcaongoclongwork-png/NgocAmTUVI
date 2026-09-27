import "server-only";
import { formatLeadMessage, type NotifiableLead } from "@/lib/lead-notify-format";
import { sendTelegramMessage } from "@/lib/telegram";

/**
 * Tells the admin about a new lead. Runs inside after() from the contact
 * form's Server Action, so it never slows down or breaks the visitor's
 * submission — the lead is already safely saved before this is called.
 */
export async function notifyNewLead(lead: NotifiableLead): Promise<void> {
  const { errors } = await sendTelegramMessage(formatLeadMessage(lead, process.env.SITE_URL));
  if (errors.length) console.error(`[lead-notify] lead #${lead.id}:`, errors.join(" | "));
}
