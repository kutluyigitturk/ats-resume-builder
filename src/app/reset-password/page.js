"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import AuthField from "@/components/AuthField";
import { checkPassword } from "@/lib/password";
import { shake } from "@/lib/shake";

const cardShadow = "0 1px 2px rgba(23,23,27,0.03), 0 12px 32px -14px rgba(23,23,27,0.12)";

const FIELDS = ["password", "confirm"];

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const formErrorRef = useRef(null);
  const refs = { password: passwordRef, confirm: confirmRef };

  function reportFirst(fieldErrors) {
    const first = FIELDS.find((field) => fieldErrors[field]);
    if (!first) return;

    const element = refs[first].current;
    element?.focus();
    shake(element);
  }

  function validate() {
    const next = {};

    // The same rules the server applies. The address is not known here, so the
    // server keeps the last word on the check that needs it.
    const passwordError = checkPassword(password);
    if (passwordError) next.password = passwordError;

    if (!next.password && password !== confirm) {
      next.confirm = "The two passwords do not match.";
    }

    return next;
  }

  function clearError(field) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate();
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      reportFirst(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // A rejected password belongs on the password field; a dead link is
        // about the whole page, so the server sends it without one.
        if (data.field) {
          const serverErrors = { [data.field]: data.error };
          setErrors(serverErrors);
          reportFirst(serverErrors);
        } else {
          setFormError(data.error ?? "Something went wrong. Try again in a moment.");
          shake(formErrorRef.current);
        }
        return;
      }

      setDone(true);
    } catch {
      setFormError("Could not reach the server. Check your connection and try again.");
      shake(formErrorRef.current);
    } finally {
      setSubmitting(false);
    }
  }

  // Nothing on this page works without a token, and an empty form that fails
  // on submit is a worse way to say so.
  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">Link incomplete</h1>
        <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
          Open the link from the email exactly as it was sent, or request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <h1 className="text-[25px] font-semibold tracking-tight text-slate-900">
          Password changed
        </h1>
        <p className="mt-1.5 mb-6 text-[14.5px] leading-relaxed text-slate-500">
          You have been signed out everywhere else. Log in with your new password.
        </p>
        <Link
          href="/login"
          className="flex h-[47px] w-full items-center justify-center rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Go to log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-[25px] font-semibold tracking-tight text-slate-900">
        Set a new password
      </h1>
      <p className="mt-1.5 mb-6 text-center text-[14.5px] text-slate-500">
        Choose something you haven&apos;t used here before.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <AuthField
          ref={passwordRef}
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
        />

        <AuthField
          ref={confirmRef}
          id="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={confirm}
          error={errors.confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            clearError("confirm");
          }}
        />

        {formError && (
          <p
            ref={formErrorRef}
            role="alert"
            className="mb-[15px] rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 h-[47px] w-full rounded-xl bg-blue-700 text-[15px] font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Change password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f6f4] px-5 py-20"
      style={{ fontFamily: "var(--font-geist), sans-serif" }}
    >
      <div className="absolute top-7 left-8">
        <Logo />
      </div>

      <div
        className="w-full max-w-[400px] rounded-2xl border border-[#e6e6e3] bg-white p-9"
        style={{ boxShadow: cardShadow }}
      >
        {/* useSearchParams needs a Suspense boundary during prerendering. */}
        <Suspense fallback={<p className="text-center text-[14.5px] text-slate-500">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
