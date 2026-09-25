"use client";
import {
  EXCLUSIVE_OPTION,
  fillTokens,
  isFieldVisible,
  priceParts,
  unitFor,
  type FormTemplate,
  type TemplateAnswers,
  type TemplateField,
} from "@/lib/client-setup/templates";
import { CheckboxListField, FieldWrapper, RadioField, SelectField, TextAreaField, TextField } from "./fields";
import { fieldClass, optionTileClass } from "./styles";

// fieldClass carries w-full and mt-2, which would override the compact price inputs' width.
const compactFieldClass = fieldClass.replace(/\bw-full\b/, "").replace(/\bmt-2\b/, "");

function PriceField({ field, value, product, error, onChange }: {
  field: TemplateField;
  value: string | string[] | undefined;
  product: string;
  error?: string;
  onChange: (value: string[]) => void;
}) {
  const [amount, quantity] = priceParts(value);
  const unit = unitFor(field, product);
  return (
    <FieldWrapper label={fillTokens(field.label, field, product)} required={field.required} hint={field.hint ? fillTokens(field.hint, field, product) : `e.g. $85 per 1,000 ${unit}`} error={error}>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm text-mist">$</span>
        <input
          aria-label={`${field.label} amount`}
          inputMode="decimal"
          maxLength={40}
          value={amount}
          onChange={(e) => onChange([e.target.value, quantity])}
          placeholder="85"
          className={`${compactFieldClass} w-24`}
        />
        <span className="text-sm text-mist">per</span>
        <input
          aria-label={`${field.label} quantity`}
          maxLength={40}
          value={quantity}
          onChange={(e) => onChange([amount, e.target.value])}
          placeholder="1,000"
          className={`${compactFieldClass} w-24`}
        />
        <span className="text-sm text-mist">{unit}</span>
      </div>
    </FieldWrapper>
  );
}

function QuantityField({ field, value, product, error, onChange }: {
  field: TemplateField;
  value: string | string[] | undefined;
  product: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const label = fillTokens(field.label, field, product);
  return (
    <FieldWrapper label={label} required={field.required} hint={field.hint ? fillTokens(field.hint, field, product) : undefined} error={error}>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          aria-label={label}
          inputMode="numeric"
          maxLength={40}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ? fillTokens(field.placeholder, field, product) : "1,000"}
          className={`${compactFieldClass} w-28`}
        />
        <span className="text-sm text-mist">{unitFor(field, product)}</span>
      </div>
    </FieldWrapper>
  );
}

/** Renders one template question; returns null while its show-if condition isn't met. */
export function TemplateFieldInput({ template, field, answers, product, error, onChange }: {
  template: FormTemplate;
  field: TemplateField;
  answers: TemplateAnswers;
  product: string;
  error?: string;
  onChange: (value: string | string[]) => void;
}) {
  if (!isFieldVisible(template, field, answers)) return null;
  const common = {
    label: fillTokens(field.label, field, product),
    hint: field.hint ? fillTokens(field.hint, field, product) : undefined,
    required: field.required,
    error,
  };
  const placeholder = field.placeholder ? fillTokens(field.placeholder, field, product) : undefined;
  const value = answers[field.id];
  const text = typeof value === "string" ? value : "";
  switch (field.type) {
    case "price":
      return <PriceField field={field} value={value} product={product} error={error} onChange={onChange} />;
    case "quantity":
      return <QuantityField field={field} value={value} product={product} error={error} onChange={onChange} />;
    case "checkboxes": {
      const current = Array.isArray(value) ? value : [];
      return (
        <CheckboxListField
          {...common}
          values={current}
          options={field.options}
          onChange={(next) => {
            // Ticking "None" clears the rest; ticking anything else clears "None".
            const added = next.find((option) => !current.includes(option));
            onChange(added === EXCLUSIVE_OPTION ? [EXCLUSIVE_OPTION] : next.filter((option) => option !== EXCLUSIVE_OPTION || !added));
          }}
        />
      );
    }
    case "consent":
      return (
        <div className="mt-7 first:mt-0">
          <label className={`${optionTileClass} items-start`}>
            <input
              type="checkbox"
              checked={text === "yes"}
              onChange={(e) => onChange(e.target.checked ? "yes" : "")}
              className="mt-0.5 size-4 shrink-0 rounded accent-purple"
            />
            <span className="leading-relaxed">
              {common.label}
              {common.hint ? <span className="text-mist"> ({common.hint.toLowerCase()})</span> : null}
            </span>
          </label>
          {error ? <p role="alert" className="mt-2 text-sm text-rose-300">⚠ {error}</p> : null}
        </div>
      );
    case "radio":
      return <RadioField {...common} name={field.id} value={text} options={field.options.map((option) => ({ id: option, label: option }))} onChange={onChange} />;
    case "select":
      return <SelectField {...common} value={text} options={field.options} placeholder={placeholder} onChange={onChange} />;
    case "textarea":
      return <TextAreaField {...common} maxLength={4000} placeholder={placeholder} value={text} onChange={(e) => onChange(e.target.value)} />;
    case "phone":
      return <TextField {...common} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder={placeholder} value={text} onChange={(e) => onChange(e.target.value)} />;
    default:
      return <TextField {...common} maxLength={4000} placeholder={placeholder} value={text} onChange={(e) => onChange(e.target.value)} />;
  }
}
