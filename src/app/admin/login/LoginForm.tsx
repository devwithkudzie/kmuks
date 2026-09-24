"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import { fieldClass, focusRing, labelClass } from "@/components/client-setup/styles";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="next" value={next} />

      <label className={labelClass}>
        Password
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>

      {state.error ? (
        <p className="mt-4 rounded-md bg-purple/10 px-4 py-3 text-sm text-fog">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-purple px-5 text-sm font-medium text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
