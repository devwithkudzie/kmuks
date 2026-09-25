"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { focusRing } from "@/components/client-setup/styles";

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="confirm-dialog-title"
      // Esc closes a native dialog; keep React state in sync. Ignore it mid-request.
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-white/10 bg-night p-0 text-fog backdrop:bg-black/70"
    >
      <div className="p-5 sm:p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold">{title}</h2>
        <div className="mt-3 text-sm leading-relaxed text-mist">{children}</div>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            disabled={busy}
            onClick={onCancel}
            className={`min-h-11 rounded-md px-5 text-sm font-medium text-mist transition hover:text-fog disabled:opacity-50 ${focusRing}`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`inline-flex min-h-11 items-center justify-center rounded-md bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
