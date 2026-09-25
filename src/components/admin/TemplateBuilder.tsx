"use client";
import { useState } from "react";
import { type FormTemplate, type TemplateField } from "@/lib/client-setup/templates";
import { fieldClass, focusRing } from "@/components/client-setup/styles";

export function TemplateBuilder({ templates, onSaved }: { templates: FormTemplate[]; onSaved: (template: FormTemplate) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (index: number, change: Partial<TemplateField>) => setFields((old) => old.map((field, i) => i === index ? { ...field, ...change } : field));
  async function save() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/form-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description, fields }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      onSaved(body.template); setName(""); setDescription(""); setFields([]);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save template."); }
    finally { setBusy(false); }
  }
  return (
    <details className="mb-6 rounded-md border border-white/10 bg-night p-5">
      <summary className={`cursor-pointer text-sm font-medium ${focusRing}`}>Add a form template</summary>
      <p className="mt-4 text-sm text-mist">Build questions for a business category. Contact details and confirmation are included automatically. Save a new version to change a template; existing links keep their original questions.</p>
      <fieldset disabled={busy} className="mt-4 space-y-4">
        <label className="block text-sm">Start from an existing template (optional)
          <select className={fieldClass} value="" onChange={(e) => {
            const source = templates.find((template) => template.id === e.target.value);
            if (source) { setFields(source.fields.map((field) => ({ ...field }))); setName(`${source.name} copy`); setDescription(source.description); }
          }}><option value="">Choose a template to copy…</option>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select>
        </label>
        <label className="block text-sm">Template name<input className={fieldClass} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} /></label>
        <label className="block text-sm">Description<input className={fieldClass} value={description} maxLength={300} onChange={(e) => setDescription(e.target.value)} /></label>
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-md border border-white/10 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">Question {index + 1}<input className={fieldClass} value={field.label} maxLength={160} onChange={(e) => update(index, { label: e.target.value })} /></label>
              <label className="text-sm">Section<input className={fieldClass} value={field.section} maxLength={80} onChange={(e) => update(index, { section: e.target.value })} /></label>
              <label className="text-sm">Answer type<select className={fieldClass} value={field.type} onChange={(e) => update(index, { type: e.target.value as TemplateField["type"] })}>
                <option value="text">Short text</option><option value="textarea">Long text</option><option value="radio">Single choice (buttons)</option><option value="select">Single choice (dropdown)</option><option value="checkboxes">Multiple choice</option><option value="price">Price ($ per quantity)</option><option value="quantity">Quantity (number + unit)</option>
              </select></label>
              <label className="text-sm">Help text<input className={fieldClass} value={field.hint} maxLength={250} onChange={(e) => update(index, { hint: e.target.value })} /></label>
            </div>
            {!["radio", "checkboxes"].includes(field.type) && <label className="mt-4 block text-sm">Placeholder (example answer)<input className={fieldClass} value={field.placeholder} maxLength={160} placeholder="e.g. Harare, Chitungwiza and nearby areas" onChange={(e) => update(index, { placeholder: e.target.value })} /><span className="mt-1 block text-xs text-mist">Use {"{unit}"} or {"{product}"} to fill in the link&apos;s product.</span></label>}
            {["price", "quantity"].includes(field.type) && <label className="mt-4 block text-sm">Unit (optional)<input className={fieldClass} value={field.unit} maxLength={40} placeholder="e.g. bags — leave blank to use the product name" onChange={(e) => update(index, { unit: e.target.value })} /></label>}
            {(() => {
              // Conditions can only point at earlier choice questions.
              const parents = fields.slice(0, index).filter((item) => ["radio", "select", "checkboxes"].includes(item.type) && item.options.some(Boolean));
              if (!parents.length) return null;
              const parent = parents.find((item) => item.id === field.showIf?.field);
              return (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">Show only when
                    <select className={fieldClass} value={parent?.id ?? ""} onChange={(e) => {
                      const next = parents.find((item) => item.id === e.target.value);
                      update(index, { showIf: next ? { field: next.id, equals: next.options.find(Boolean) ?? "" } : undefined });
                    }}>
                      <option value="">Always show</option>
                      {parents.map((item) => <option key={item.id} value={item.id}>{item.label || "Untitled question"}</option>)}
                    </select>
                  </label>
                  {parent && <label className="text-sm">…is answered
                    <select className={fieldClass} value={field.showIf?.equals ?? ""} onChange={(e) => update(index, { showIf: { field: parent.id, equals: e.target.value } })}>
                      {parent.options.filter(Boolean).map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>}
                </div>
              );
            })()}
            {["select", "radio", "checkboxes"].includes(field.type) && <label className="mt-4 block text-sm">Options (one per line)<textarea className={fieldClass} value={field.options.join("\n")} onChange={(e) => update(index, { options: e.target.value.split("\n") })} /></label>}
            <div className="mt-4 flex justify-between gap-4"><label className="text-sm"><input type="checkbox" checked={field.required} onChange={(e) => update(index, { required: e.target.checked })} /> Required</label><button type="button" onClick={() => setFields((old) => old.filter((_, i) => i !== index).map((item) => item.showIf?.field === field.id ? { ...item, showIf: undefined } : item))} className="text-sm text-purple">Remove question</button></div>
          </div>
        ))}
        <div className="flex flex-wrap gap-4">
          <button type="button" disabled={fields.length >= 60} className={`text-sm text-purple ${focusRing}`} onClick={() => setFields((old) => [...old, { id: `q_${crypto.randomUUID().replaceAll("-", "")}`, label: "", section: "Business details", type: "text", required: false, options: [], hint: "", placeholder: "", unit: "" }])}>+ Add question</button>
          <button type="button" disabled={busy || !name.trim() || !fields.length} onClick={save} className={`rounded-md bg-purple px-5 py-3 text-sm disabled:opacity-50 ${focusRing}`}>{busy ? "Saving…" : "Save template"}</button>
        </div>
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-purple">{error}</p>}
    </details>
  );
}
