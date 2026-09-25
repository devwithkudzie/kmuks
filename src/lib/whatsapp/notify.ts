/**
 * Sends a WhatsApp message to the site owner through Meta's WhatsApp Cloud API.
 *
 * Messages a business starts must use an approved template, so set
 * WHATSAPP_TEMPLATE_NAME to a template whose body takes the lead fields as
 * {{1}}…{{5}} (see README). Without a template it falls back to a plain text
 * message, which Meta only delivers if you've messaged the business number in
 * the last 24 hours — handy for testing, not for production.
 */

type LeadAlert = {
  name: string;
  businessName: string;
  whatsapp: string;
  description: string;
  source: string;
};

function config() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const to = process.env.WHATSAPP_NOTIFY_TO?.replace(/\D/g, "");
  if (!token || !phoneNumberId || !to) return null;
  return {
    token,
    phoneNumberId,
    to,
    template: process.env.WHATSAPP_TEMPLATE_NAME?.trim() ?? "",
    language: process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || "en",
    version: process.env.WHATSAPP_GRAPH_VERSION?.trim() || "v23.0",
  };
}

/** Template parameters can't contain newlines, tabs or 4+ spaces in a row. */
function param(value: string, max = 200) {
  const clean = value.replace(/\s+/g, " ").trim() || "—";
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export async function notifyNewLead(lead: LeadAlert): Promise<void> {
  const settings = config();
  if (!settings) {
    console.info("[whatsapp] notification skipped: WHATSAPP_* environment variables are not set.");
    return;
  }

  const values = [lead.name, lead.businessName, lead.whatsapp, lead.description, lead.source];
  const body = settings.template
    ? {
        messaging_product: "whatsapp",
        to: settings.to,
        type: "template",
        template: {
          name: settings.template,
          language: { code: settings.language },
          components: [{ type: "body", parameters: values.map((value) => ({ type: "text", text: param(value) })) }],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: settings.to,
        type: "text",
        text: {
          body: [
            "New Work with me lead",
            `Name: ${lead.name}`,
            `Business: ${lead.businessName}`,
            `WhatsApp: ${lead.whatsapp}`,
            `What they do: ${lead.description}`,
            `Source: ${lead.source}`,
          ].join("\n"),
        },
      };

  const response = await fetch(
    `https://graph.facebook.com/${settings.version}/${settings.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${settings.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    // Meta's error body explains the problem (expired token, unapproved template…) and holds no secrets.
    throw new Error(`WhatsApp API ${response.status}: ${await response.text()}`);
  }
}
