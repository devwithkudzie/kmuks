import { unitWordFor } from "./constants";
import { z } from "zod";

export const FIELD_TYPES = ["text", "textarea", "select", "radio", "checkboxes", "price", "quantity"] as const;
const CHOICE_TYPES: readonly string[] = ["select", "radio", "checkboxes"];

const fieldSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/).max(60),
  label: z.string().trim().min(1).max(160),
  section: z.string().trim().min(1).max(80),
  type: z.enum(FIELD_TYPES),
  required: z.boolean(),
  hint: z.string().max(250).default(""),
  // Example text inside the empty input. "{unit}" and "{product}" are filled from the link.
  placeholder: z.string().max(160).default(""),
  options: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  // Price and quantity fields: what is being counted, e.g. "bricks". Blank uses the link's product.
  unit: z.string().trim().max(40).default(""),
  // Only ask this question when another question's answer is (or includes) this option.
  showIf: z.object({ field: z.string().max(60), equals: z.string().max(120) }).optional(),
}).superRefine((field, ctx) => {
  if (CHOICE_TYPES.includes(field.type) && !field.options.length) {
    ctx.addIssue({ code: "custom", message: "Choice fields need options." });
  }
  if (new Set(field.options).size !== field.options.length) {
    ctx.addIssue({ code: "custom", message: "Options must be unique." });
  }
});
export const templateSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).max(80),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300),
  fields: z.array(fieldSchema).min(1).max(60),
}).superRefine((template, ctx) => {
  const ids = template.fields.map((field) => field.id);
  if (new Set(ids).size !== ids.length) {
    ctx.addIssue({ code: "custom", message: "Question IDs must be unique." });
  }
  template.fields.forEach((field, index) => {
    if (field.showIf && !ids.slice(0, index).includes(field.showIf.field)) {
      ctx.addIssue({ code: "custom", message: `"${field.label}" can only depend on an earlier question.` });
    }
  });
});
export type FormTemplate = z.infer<typeof templateSchema>;
export type TemplateField = FormTemplate["fields"][number];
export type TemplateAnswers = Record<string, string | string[]>;

/** Price answers are stored as [amount, quantity]. */
export function priceParts(value: string | string[] | undefined): [string, string] {
  return Array.isArray(value) ? [value[0] ?? "", value[1] ?? ""] : ["", ""];
}

export function unitFor(field: TemplateField, product: string) {
  return field.unit || unitWordFor(product);
}

/** Fills "{unit}" and "{product}" in hints and placeholders. */
export function fillTokens(text: string, field: TemplateField, product: string) {
  return text.replaceAll("{unit}", unitFor(field, product)).replaceAll("{product}", product);
}

/**
 * Whether a question should be asked given the current answers. A question
 * whose controlling question is itself hidden is hidden too.
 */
export function isFieldVisible(template: FormTemplate, field: TemplateField, answers: TemplateAnswers, depth = 0): boolean {
  if (!field.showIf) return true;
  const parent = template.fields.find((item) => item.id === field.showIf!.field);
  if (!parent || depth > 10 || !isFieldVisible(template, parent, answers, depth + 1)) return false;
  const value = answers[parent.id];
  return Array.isArray(value) ? value.includes(field.showIf.equals) : value === field.showIf.equals;
}

/** Human-readable answer, used for the sheet, the dashboard and the review step. */
export function formatAnswer(field: TemplateField, value: string | string[] | undefined, product: string): string {
  if (field.type === "price") {
    const [amount, quantity] = priceParts(value);
    if (!amount) return "";
    return `$${amount.replace(/^\$/, "")}${quantity ? ` per ${quantity} ${unitFor(field, product)}` : ""}`;
  }
  if (field.type === "quantity") {
    return typeof value === "string" && value ? `${value} ${unitFor(field, product)}` : "";
  }
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

export function validateAnswers(template: FormTemplate, input: unknown, fields = template.fields) {
  const parsed = z.record(z.string(), z.union([z.string().max(4000), z.array(z.string().max(120)).max(30)])).safeParse(input);
  const errors: Record<string, string> = {};
  const answers: TemplateAnswers = {};
  if (!parsed.success) return { answers, errors: { form: "Invalid answers. Please check your entries." } };
  for (const field of fields) {
    const empty = field.type === "checkboxes" || field.type === "price" ? [] : "";
    // Hidden questions are neither required nor kept.
    if (!isFieldVisible(template, field, parsed.data)) {
      answers[field.id] = empty;
      continue;
    }
    const value = parsed.data[field.id] ?? empty;
    answers[field.id] = typeof value === "string" ? value.trim() : value.map((item) => item.trim());
    if (field.type === "price") {
      const [amount, quantity] = priceParts(value);
      if (!Array.isArray(value) || value.length > 2) errors[field.id] = "Enter a price.";
      else if (field.required && !amount.trim()) errors[field.id] = "Let us know your price.";
      else if (amount.trim() && !quantity.trim()) errors[field.id] = "Let us know the quantity this price is for.";
      else if (amount.trim() && !/^\$?\s*[\d,]+(\.\d+)?$/.test(amount.trim())) errors[field.id] = "Enter the price as a number, e.g. 85.";
    } else if (field.type === "checkboxes") {
      if (!Array.isArray(value) || value.some((item) => !field.options.includes(item))) errors[field.id] = "Select valid options.";
      else if (field.required && !value.length) errors[field.id] = "Select at least one option.";
    } else if (typeof value !== "string") errors[field.id] = "Enter a text answer.";
    else if (field.required && !value.trim()) errors[field.id] = CHOICE_TYPES.includes(field.type) ? "Select an option." : "This field is required.";
    else if ((field.type === "select" || field.type === "radio") && value && !field.options.includes(value)) errors[field.id] = "Select a valid option.";
    else if (field.type === "quantity" && value.trim() && !/^[\d,]+(\.\d+)?$/.test(value.trim())) errors[field.id] = "Enter a number, e.g. 1,000.";
  }
  return { answers, errors };
}

const question = (
  id: string,
  label: string,
  section: string,
  type: TemplateField["type"] = "text",
  extra: Partial<Omit<TemplateField, "id" | "label" | "section" | "type">> = {},
): TemplateField => ({ id, label, section, type, required: false, options: [], hint: "", placeholder: "", unit: "", ...extra });

export const BULK_VARIES = "Changes for larger orders";

export const CONSTRUCTION_TEMPLATE: FormTemplate = {
  id: "construction-materials-v1",
  name: "Construction & Building Materials",
  description: "For bricks, cement, timber, aggregates and other building materials.",
  fields: [
    question("price", "Price", "Product & Pricing", "price", { required: true }),
    question("minimum_order", "Minimum order", "Product & Pricing", "quantity", { required: true, placeholder: "1,000" }),
    question("bulk_pricing", "Bulk pricing", "Product & Pricing", "radio", { required: true, options: ["Same price", BULK_VARIES] }),
    question("bulk_pricing_details", "Bulk pricing details", "Product & Pricing", "textarea", {
      placeholder: "e.g. $80 per 1,000 {unit} for orders above 10,000 {unit}",
      showIf: { field: "bulk_pricing", equals: BULK_VARIES },
    }),
    question("product_details", "Product details", "Product & Pricing", "textarea", {
      placeholder: "e.g. Standard {product} suitable for general construction. Sizes: 222 x 106 x 73 mm.",
    }),
    question("special_offer", "Special offer", "Product & Pricing", "radio", { options: ["No", "Yes"] }),
    question("special_offer_details", "Offer details", "Product & Pricing", "textarea", {
      placeholder: "e.g. Free delivery for orders above 20,000 {unit}.",
      showIf: { field: "special_offer", equals: "Yes" },
    }),
    question("delivery_options", "Delivery options", "Delivery & Payment", "checkboxes", {
      required: true, options: ["We deliver to customers", "Customers collect from our location"],
    }),
    question("delivery_areas", "Delivery areas", "Delivery & Payment", "textarea", {
      placeholder: "e.g. Harare, Chitungwiza, Ruwa and nearby areas",
    }),
    question("delivery_time", "Typical delivery time", "Delivery & Payment", "select", {
      options: ["Same day", "Next day", "1-3 days", "3-7 days", "More than a week"],
    }),
    question("payment_methods", "Accepted payment methods", "Delivery & Payment", "checkboxes", {
      required: true, options: ["Cash", "EcoCash", "Bank Transfer", "Other"],
    }),
    question("payment_method_other", "Other payment method", "Delivery & Payment", "text", {
      placeholder: "e.g. InnBucks, OneMoney",
      showIf: { field: "payment_methods", equals: "Other" },
    }),
    question("payment_notes", "Payment notes", "Delivery & Payment", "textarea", {
      placeholder: "e.g. 70% upfront for new customers, balance on delivery.",
    }),
    question("customer_types", "Main customers", "Customers & Sales", "checkboxes", {
      required: true, options: ["Builders / Contractors", "Individual home builders", "Construction companies", "Hardware stores / Resellers", "Other"],
    }),
    question("customer_type_other", "Other customer type", "Customers & Sales", "text", {
      placeholder: "e.g. Schools, churches, government projects",
      showIf: { field: "customer_types", equals: "Other" },
    }),
    question("order_method", "How do customers usually order?", "Customers & Sales", "radio", {
      options: ["Phone / WhatsApp", "In person", "Through hardware stores", "Other"],
    }),
    question("order_method_other", "Other ordering method", "Customers & Sales", "text", {
      placeholder: "e.g. Through our website",
      showIf: { field: "order_method", equals: "Other" },
    }),
    question("customer_notes", "Any notes about customers or sales?", "Customers & Sales", "textarea", {
      placeholder: "e.g. Most orders come through WhatsApp.",
    }),
    question("previously_advertised", "Have you promoted your {product} before?", "Previous Marketing", "radio", {
      required: true, options: ["Yes", "No"],
    }),
    question("platforms_used", "Where did you promote?", "Previous Marketing", "checkboxes", {
      hint: "Select all that apply.",
      options: ["Facebook", "Instagram", "WhatsApp", "Flyers / Posters", "Local advertising", "Other"],
      showIf: { field: "previously_advertised", equals: "Yes" },
    }),
    question("platform_other", "Other platform", "Previous Marketing", "text", {
      placeholder: "e.g. Radio, newspaper",
      showIf: { field: "platforms_used", equals: "Other" },
    }),
    question("what_worked", "What worked well?", "Previous Marketing", "textarea", {
      placeholder: "e.g. Project photos and testimonials.",
      showIf: { field: "previously_advertised", equals: "Yes" },
    }),
    question("what_didnt_work", "What didn't work well?", "Previous Marketing", "textarea", {
      placeholder: "e.g. Boosted posts didn't bring many serious enquiries.",
      showIf: { field: "previously_advertised", equals: "Yes" },
    }),
  ],
};

/**
 * Parses a template saved on a setup link or in the Form Templates tab.
 * Links store a copy of their template; links on the built-in construction
 * template always get its current questions so improvements reach them too.
 */
export function parseStoredTemplate(json: string): FormTemplate {
  const template = templateSchema.parse(JSON.parse(json));
  return template.id === CONSTRUCTION_TEMPLATE.id ? CONSTRUCTION_TEMPLATE : template;
}
