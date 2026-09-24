"use client";

import { useId, type ReactNode } from "react";
import { fieldClass, labelClass } from "./styles";

export function FieldWrapper({
  label,
  labelFor,
  hint,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  /** When set, renders a native `<label htmlFor>` bound to this control's id
   *  instead of a plain span — screen readers announce it and clicking the
   *  text focuses the field. Only appropriate for a single input/textarea;
   *  multi-option fields (radio, checkbox groups) pass nothing here and
   *  rely on `role`/`aria-label` on their own container instead. */
  labelFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}) {
  const LabelTag = labelFor ? "label" : "span";

  return (
    <div className="mt-6 first:mt-0">
      <LabelTag htmlFor={labelFor} className={labelClass}>
        {label}
        {required ? <span className="text-purple"> *</span> : null}
        {optional ? <span className="normal-case text-mist/60"> (Optional)</span> : null}
      </LabelTag>
      {hint ? <p className="mt-1 text-xs text-mist/70">{hint}</p> : null}
      {children}
      {error ? <p className="mt-2 text-sm text-purple">{error}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  required,
  optional,
  id,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      label={label}
      labelFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
    >
      <input {...props} id={fieldId} className={fieldClass} />
    </FieldWrapper>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  optional,
  id,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      label={label}
      labelFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
    >
      <textarea {...props} id={fieldId} rows={props.rows ?? 4} className={`${fieldClass} resize-y`} />
    </FieldWrapper>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  optional,
  value,
  onChange,
  options,
  placeholder = "Select…",
  id,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  id?: string;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      label={label}
      labelFor={fieldId}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
    >
      <select
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

/** A single-select field rendered as a row of radio circles + labels. */
export function RadioField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  options,
  name,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options?: { id: string; label: string }[];
  name: string;
}) {
  const generatedName = useId();
  const groupName = name || generatedName;
  const items = options ?? [
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
  ];

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3" role="radiogroup" aria-label={label}>
        {items.map((item) => (
          <label key={item.id} className="flex cursor-pointer items-center gap-2 text-sm text-fog">
            <input
              type="radio"
              name={groupName}
              checked={value === item.id}
              onChange={() => onChange(item.id)}
              className="size-4 accent-purple"
            />
            {item.label}
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}

/** A multi-select field rendered as a vertical list of checkboxes. */
export function CheckboxListField({
  label,
  hint,
  error,
  required,
  optional,
  values,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  values: string[];
  onChange: (values: string[]) => void;
  options: readonly string[];
}) {
  const toggle = (option: string) => {
    onChange(
      values.includes(option)
        ? values.filter((item) => item !== option)
        : [...values, option],
    );
  };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} optional={optional}>
      <div className="mt-2 space-y-2" role="group" aria-label={label}>
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-fog">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => toggle(option)}
              className="size-4 rounded accent-purple"
            />
            {option}
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}
