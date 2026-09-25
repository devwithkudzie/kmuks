import { z } from "zod";

const fieldSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/).max(60),
  label: z.string().trim().min(1).max(160),
  section: z.string().trim().min(1).max(80),
  type: z.enum(["text", "textarea", "select", "checkboxes"]),
  required: z.boolean(),
  hint: z.string().max(250).default(""),
  options: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
}).superRefine((field, ctx) => {
  if (["select", "checkboxes"].includes(field.type) && !field.options.length) {
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
  if (new Set(template.fields.map((field) => field.id)).size !== template.fields.length) {
    ctx.addIssue({ code: "custom", message: "Question IDs must be unique." });
  }
});
export type FormTemplate = z.infer<typeof templateSchema>;
export type TemplateField = FormTemplate["fields"][number];
export type TemplateAnswers = Record<string, string | string[]>;

export function validateAnswers(template: FormTemplate, input: unknown) {
  const parsed = z.record(z.string(), z.union([z.string().max(4000), z.array(z.string().max(120)).max(30)])).safeParse(input);
  const errors: Record<string, string> = {};
  const answers: TemplateAnswers = {};
  if (!parsed.success) return { answers, errors: { form: "Invalid answers. Please check your entries." } };
  for (const field of template.fields) {
    const raw = parsed.data[field.id];
    const value = raw ?? (field.type === "checkboxes" ? [] : "");
    answers[field.id] = typeof value === "string" ? value.trim() : value;
    if (field.type === "checkboxes") {
      if (!Array.isArray(value) || value.some((item) => !field.options.includes(item))) errors[field.id] = "Select valid options.";
      else if (field.required && !value.length) errors[field.id] = "Select at least one option.";
    } else if (typeof value !== "string") errors[field.id] = "Enter a text answer.";
    else if (field.required && !value.trim()) errors[field.id] = "This field is required.";
    else if (field.type === "select" && value && !field.options.includes(value)) errors[field.id] = "Select a valid option.";
  }
  return { answers, errors };
}

const question = (id: string, label: string, section: string, type: TemplateField["type"] = "text", required = false, options: string[] = [], hint = ""): TemplateField => ({ id, label, section, type, required, options, hint });

export const CONSTRUCTION_TEMPLATE: FormTemplate = {
  id: "construction-materials-v1",
  name: "Construction & Building Materials",
  description: "For bricks, cement, timber, aggregates and other building materials.",
  fields: [
    question("price", "Current price and quantity", "Product & Pricing", "text", true, [], "Include currency and unit, e.g. $85 per 1,000 bricks or $10 per bag."),
    question("minimum_order", "Minimum order", "Product & Pricing", "text", true),
    question("bulk_pricing", "Bulk pricing", "Product & Pricing", "textarea"),
    question("product_details", "Product specifications and available sizes", "Product & Pricing", "textarea"),
    question("special_offer", "Current offers", "Product & Pricing", "textarea"),
    question("delivery_options", "Delivery options", "Delivery & Payment", "checkboxes", true, ["We deliver to customers", "Customers collect from our location"]),
    question("delivery_areas", "Delivery areas", "Delivery & Payment", "textarea"),
    question("delivery_time", "Typical delivery time", "Delivery & Payment"),
    question("payment_methods", "Payment methods", "Delivery & Payment", "checkboxes", true, ["Cash", "EcoCash", "Bank Transfer", "Other"]),
    question("payment_notes", "Payment terms and other methods", "Delivery & Payment", "textarea"),
    question("customer_types", "Main customers", "Customers & Sales", "checkboxes", true, ["Builders / Contractors", "Individual home builders", "Construction companies", "Hardware stores / Resellers", "Other"]),
    question("order_method", "How do customers order?", "Customers & Sales", "select", false, ["Phone / WhatsApp", "In person", "Through hardware stores", "Other"]),
    question("customer_notes", "Other customer types and sales notes", "Customers & Sales", "textarea"),
    question("previously_advertised", "Have you advertised before?", "Previous Marketing", "select", true, ["Yes", "No"]),
    question("platforms_used", "Platforms used", "Previous Marketing", "checkboxes", false, ["Facebook", "Instagram", "WhatsApp", "Flyers / Posters", "Local advertising", "Other"]),
    question("what_worked", "What worked well?", "Previous Marketing", "textarea"),
    question("what_didnt_work", "What didn’t work?", "Previous Marketing", "textarea"),
  ],
};
